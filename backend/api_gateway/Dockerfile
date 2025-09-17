# Используем тот же базовый образ, что и для других сервисов
FROM python:3.11-slim

# Устанавливаем Poetry
RUN pip install poetry

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы с зависимостями
COPY poetry.lock pyproject.toml ./

# Устанавливаем зависимости, не создавая виртуальное окружение внутри контейнера
RUN poetry config virtualenvs.create false && poetry install --no-root --no-dev

# Копируем весь исходный код нашего сервиса
COPY . .

# Команда для запуска будет в docker-compose.yml