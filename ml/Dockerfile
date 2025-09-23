FROM nvidia/cuda:12.1.0-base-ubuntu22.04

# Build deps for Python wheels that may need compilation (thinc, blis, etc.)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       g++ \
       git \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем uv (современный и быстрый установщик пакетов)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файл с зависимостями (не используем lock, чтобы учесть изменения)
COPY pyproject.toml ./

# Устанавливаем зависимости
RUN uv sync --no-dev

# Копируем все .py файлы из корня папки ml в рабочую директорию /app
COPY *.py ./

# Команда для запуска будет в docker-compose.yml