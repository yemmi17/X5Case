import asyncio
import time
import statistics
from typing import List, Tuple

import httpx
from rich.console import Console
from rich.table import Table

# --- КОНФИГУРАЦИЯ ТЕСТА ---
# URL сервиса (для hackathon-compose порт 8000 проброшен на localhost)
API_URL = "http://46.30.46.219:8000/api/predict"

# Целевой запросный поток (RPS) и длительность теста
TARGET_RPS = 500  # целевые запросы в секунду
TEST_DURATION_SEC = 20  # длительность в секундах

# Ограничение одновременных запросов (чтобы не ушли в тысячные в полёте)
MAX_IN_FLIGHT = 1000

# Максимальное время ожидания ответа отдельного запроса (сек)
REQUEST_TIMEOUT_SEC = 5.0

# Тестовое тело запроса
TEST_PAYLOAD = {
    "text": "Apple is looking at buying U.K. startup for $1 billion"
}
# -------------------------

console = Console()


async def send_request(client: httpx.AsyncClient, sem: asyncio.Semaphore, request_id: int) -> Tuple[int, float, bool]:
    """
    Отправляет один запрос и измеряет время ответа.
    Возвращает кортеж: (id запроса, время, успех)
    """
    start = time.perf_counter()
    async with sem:
        try:
            resp = await client.post(API_URL, json=TEST_PAYLOAD, timeout=REQUEST_TIMEOUT_SEC)
            resp.raise_for_status()
            elapsed = time.perf_counter() - start
            return (request_id, elapsed, True)
        except Exception:
            elapsed = time.perf_counter() - start
            return (request_id, elapsed, False)


async def run_rps_test():
    """Открытая модель нагрузки: поддерживаем целевой RPS фиксированной скоростью посылки запросов."""
    console.print(f"[bold yellow]🚀 Старт RPS-теста[/bold yellow]: целевой поток [bold cyan]{TARGET_RPS} rps[/bold cyan] в течение [bold cyan]{TEST_DURATION_SEC}s[/bold cyan]")

    interval = 1.0 / float(TARGET_RPS)
    end_at = time.perf_counter() + TEST_DURATION_SEC

    results: List[Tuple[int, float, bool]] = []
    tasks: List[asyncio.Task] = []
    sem = asyncio.Semaphore(MAX_IN_FLIGHT)

    request_counter = 0
    next_scheduled = time.perf_counter()

    async with httpx.AsyncClient() as client:
        # Планируем запросы с нужным интервалом, пока не выйдет время
        while True:
            now = time.perf_counter()
            if now >= end_at:
                break

            # Если пора отправлять следующий запрос — делаем это сразу
            if now >= next_scheduled:
                request_counter += 1
                tasks.append(asyncio.create_task(send_request(client, sem, request_counter)))
                next_scheduled += interval
            else:
                # Спим до момента следующего слота (короткий сон для точности и экономии CPU)
                await asyncio.sleep(min(0.0005, max(0.0, next_scheduled - now)))

        # Дожидаемся завершения всех запросов
        if tasks:
            for chunk_start in range(0, len(tasks), 1000):
                chunk = tasks[chunk_start:chunk_start + 1000]
                results.extend(await asyncio.gather(*chunk))

    analyze_results_rps(results, scheduled=request_counter)


def percentile(values: List[float], p: float) -> float:
    if not values:
        return 0.0
    idx = max(0, min(len(values) - 1, int(round((p / 100.0) * (len(values) - 1)))))
    return sorted(values)[idx]


def analyze_results_rps(results: List[Tuple[int, float, bool]], scheduled: int):
    successes = [r for r in results if r[2]]
    failures = [r for r in results if not r[2]]
    latencies = [r[1] for r in successes]

    total_completed = len(results)
    total_success = len(successes)
    total_failed = len(failures)

    achieved_rps = total_completed / TEST_DURATION_SEC if TEST_DURATION_SEC > 0 else 0.0

    table = Table(title="📈 RPS-тест — результаты")
    table.add_column("Метрика", style="cyan", no_wrap=True)
    table.add_column("Значение", style="magenta")

    table.add_row("Запросов запланировано", str(scheduled))
    table.add_row("Запросов завершено", str(total_completed))
    table.add_row("Успешных", f"[green]{total_success}[/green]")
    table.add_row("Неуспешных", f"[red]{total_failed}[/red]")
    table.add_row("Достигнутый RPS", f"{achieved_rps:.2f}")

    if latencies:
        table.add_row("Средняя задержка", f"{statistics.mean(latencies):.4f} c")
        table.add_row("Медиана (p50)", f"{percentile(latencies, 50):.4f} c")
        table.add_row("p90", f"{percentile(latencies, 90):.4f} c")
        table.add_row("p95", f"{percentile(latencies, 95):.4f} c")
        table.add_row("p99", f"{percentile(latencies, 99):.4f} c")

    console.print(table)


if __name__ == "__main__":
    asyncio.run(run_rps_test())


