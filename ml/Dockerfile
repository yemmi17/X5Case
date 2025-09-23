# 1. Используем официальный и легкий образ Python
FROM python:3.12-slim

# 2. Устанавливаем системные зависимости для сборки пакетов (spaCy их требует)
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

# 3. Устанавливаем uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/

# 4. Устанавливаем рабочую директорию
WORKDIR /app

# 5. Копируем файлы с зависимостями
COPY pyproject.toml uv.lock* ./

# 6. Устанавливаем Python-зависимости
# Добавим --system чтобы uv ставил зависимости в системный python, а не в .venv
RUN uv pip install --system --no-cache --no-deps -r pyproject.toml

# 7. Скачиваем модель spaCy во время сборки образа
COPY model ./model

# 8. Копируем все ваши Python-файлы в контейнер
COPY app/ .