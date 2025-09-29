import asyncio
import time
import random
from typing import List, Tuple, Dict

import httpx
from rich.console import Console
from rich.table import Table

# --- КОНФИГУРАЦИЯ ТЕСТА ---
# URL твоего эндпоинта
API_URL = "http://79.143.29.56:8000/api/predict"
# Количество одновременных запросов для отправки
CONCURRENT_REQUESTS = 100
# Максимально допустимое время ответа на один запрос (в секундах)
MAX_RESPONSE_TIME_SEC = 1.0
# Список тестовых данных для отправки. Для каждого запроса будет выбран случайный.
TEST_PAYLOADS: List[Dict[str, str]] = [
    {"input": "сгущенное молоко"},
    {"input": "инженер-программист из МАИ"},
    {"input": "Детекция нефтяных пятен на спутниковых снимках"},
    {"input": ""},  # Тест на пустой ввод
]
# -------------------------

console = Console()

async def send_request(client: httpx.AsyncClient, request_id: int) -> Tuple[int, float, bool]:
    """
    Асинхронно отправляет один запрос, измеряет время ответа и валидирует результат.

    Возвращает кортеж: (id запроса, время выполнения, флаг успеха).
    """
    start_time = time.perf_counter()
    # Выбираем случайные данные для отправки
    payload = random.choice(TEST_PAYLOADS)
    
    try:
        response = await client.post(API_URL, json=payload, timeout=10.0)
        response.raise_for_status()  # Проверяем, что ответ успешный (HTTP 2xx)
        
        # --- Валидация ответа ---
        response_data = response.json()
        if not isinstance(response_data, list):
            raise TypeError(f"Ответ не является списком (list), получено: {type(response_data)}")
        
        # Проверка кейса с пустым вводом
        if payload["input"] == "" and response_data != []:
            raise ValueError("Для пустого `input` ответ должен быть пустым списком `[]`")
        
        end_time = time.perf_counter()
        response_time = end_time - start_time
        
        console.print(f"Запрос [bold cyan]#{request_id}[/bold cyan] (input: '{payload['input']}') выполнен за [bold green]{response_time:.4f}c[/bold green]")
        return (request_id, response_time, True)

    except httpx.HTTPStatusError as e:
        end_time = time.perf_counter()
        response_time = end_time - start_time
        console.print(f"[bold red]Ошибка в запросе #{request_id}:[/bold red] Статус {e.response.status_code} за {response_time:.4f}c")
        return (request_id, response_time, False)
        
    except (Exception, TypeError, ValueError) as e:
        end_time = time.perf_counter()
        response_time = end_time - start_time
        console.print(f"[bold red]Критическая ошибка/ошибка валидации в запросе #{request_id}:[/bold red] {e} за {response_time:.4f}c")
        return (request_id, response_time, False)


async def run_load_test():
    """
    Главная функция для запуска нагрузочного теста.
    """
    console.print(f"[bold yellow]🚀 Запускаем нагрузочный тест...[/bold yellow]")
    console.print(f"Цель: [bold cyan]{CONCURRENT_REQUESTS}[/bold cyan] одновременных запросов к [bold magenta]{API_URL}[/bold magenta]")
    
    async with httpx.AsyncClient() as client:
        tasks = [send_request(client, i) for i in range(1, CONCURRENT_REQUESTS + 1)]
        results: List[Tuple[int, float, bool]] = await asyncio.gather(*tasks)

    analyze_results(results)


def analyze_results(results: List[Tuple[int, float, bool]]):
    """
    Анализирует результаты теста и выводит итоговую таблицу.
    """
    successful_requests = [res for res in results if res[2]]
    failed_requests = [res for res in results if not res[2]]
    
    response_times = [res[1] for res in successful_requests]
    slow_requests = [res for res in successful_requests if res[1] > MAX_RESPONSE_TIME_SEC]

    # --- Создаем итоговую таблицу ---
    table = Table(title="📊 Результаты нагрузочного теста")
    table.add_column("Метрика", style="cyan", no_wrap=True)
    table.add_column("Значение", style="magenta")

    table.add_row("Всего запросов", str(len(results)))
    table.add_row("Успешных запросов", f"[green]{len(successful_requests)}[/green]")
    table.add_row("Неудачных запросов", f"[red]{len(failed_requests)}[/red]")
    
    if response_times:
        avg_time = sum(response_times) / len(response_times)
        max_time = max(response_times)
        min_time = min(response_times)
        table.add_row("Среднее время ответа", f"{avg_time:.4f} сек")
        table.add_row("Макс. время ответа", f"{max_time:.4f} сек")
        table.add_row("Мин. время ответа", f"{min_time:.4f} сек")

    table.add_row(f"Запросы дольше {MAX_RESPONSE_TIME_SEC} сек", f"[yellow]{len(slow_requests)}[/yellow]")
    
    console.print(table)
    
    # Итоговое заключение
    if failed_requests:
        console.print("[bold red]❌ Тест провален: есть неудачные запросы или ошибки валидации.[/bold red]")
    elif slow_requests:
        console.print(f"[bold yellow]⚠️ Тест пройден с замечаниями: {len(slow_requests)} запросов превысили лимит в {MAX_RESPONSE_TIME_SEC} сек.[/bold yellow]")
    else:
        console.print("[bold green]✅ Тест успешно пройден! Все запросы быстрые и успешные.[/bold green]")


if __name__ == "__main__":
    asyncio.run(run_load_test())