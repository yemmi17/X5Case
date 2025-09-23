# ml/Dockerfile

FROM nvidia/cuda:12.1.0-base-ubuntu22.04

# Устанавливаем uv (современный и быстрый установщик пакетов)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы с зависимостями
COPY pyproject.toml uv.lock ./

# Устанавливаем зависимости
RUN uv sync --frozen --no-dev

# Копируем все .py файлы из корня папки ml в рабочую директорию /app
COPY *.py ./

# Команда для запуска будет в docker-compose.yml