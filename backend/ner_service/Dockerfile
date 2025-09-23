# ner_service/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Устанавливаем Poetry
RUN pip install poetry

# Копируем файлы зависимостей и устанавливаем их
COPY poetry.lock pyproject.toml ./
RUN poetry config virtualenvs.create false && poetry install --no-root --no-dev

# Копируем код приложения
COPY ./app /app/app

# Запускаем приложение через Gunicorn с 4 воркерами
# Число воркеров подбирается под сервер (обычно 2 * кол-во ядер + 1)
# TODO: подобрать число воркеров под сервер
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "-b", "0.0.0.0:8000"]