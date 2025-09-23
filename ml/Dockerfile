# ml/Dockerfile

# 1. Используем официальный и легкий образ Python
FROM python:3.12-slim

# 2. Устанавливаем системные зависимости для сборки пакетов (spaCy их требует)
# RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

# 3. Устанавливаем uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/

# 4. Устанавливаем рабочую директорию
WORKDIR /app

# 5. Копируем файлы с зависимостями
COPY pyproject.toml uv.lock ./

# 6. Устанавливаем Python-зависимости
RUN uv sync --frozen --no-dev

# 7. Скачиваем модель spaCy во время сборки образа
# RUN python -m spacy download ru_core_news_sm
COPY model ./

# 8. Копируем все ваши Python-файлы в контейнер
COPY app/*.py ./

# Команда для запуска будет в docker-compose.yml