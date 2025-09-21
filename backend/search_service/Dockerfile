FROM python:3.11-slim

# Устанавливаем Poetry
RUN pip install poetry

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы Poetry и устанавливаем зависимости
# Это кэшируется, чтобы не переустанавливать зависимости при каждом изменении кода
COPY poetry.lock pyproject.toml ./

RUN poetry config virtualenvs.create false && poetry install --no-root --only main

# Копируем исходный код приложения
COPY . .

# Команда для запуска приложения будет в docker-compose.yml