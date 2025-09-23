FROM nvidia/cuda:13.0.0-base-ubuntu22.04

# Заменить latest на что-то другое желательно
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY uv.lock pyproject.toml /app/

RUN uv sync --frozen --no-dev

COPY main.py /app