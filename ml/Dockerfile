FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# Сначала копируем ТОЛЬКО файлы, отвечающие за зависимости
COPY pyproject.toml uv.lock ./

# Устанавливаем зависимости в стандартное виртуальное окружение .venv
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

# Теперь копируем остальной код приложения
COPY . .

# --- ВАЖНО: Добавляем путь к .venv/bin в системный PATH ---
# Это "активирует" виртуальное окружение для всех последующих команд
ENV PATH="/app/.venv/bin:$PATH"

# Команда для запуска в PROD. Теперь gunicorn будет найден 100%
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "-b", "0.0.0.0:8000"]