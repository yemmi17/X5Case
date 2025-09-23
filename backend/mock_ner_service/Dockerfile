FROM python:3.11-slim
RUN pip install poetry
WORKDIR /app
COPY poetry.lock pyproject.toml ./
RUN poetry config virtualenvs.create false && poetry install --no-root --only main
COPY . .