FROM nvidia/cuda:13.0.0-base-ubuntu22.04

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*
RUN pip3 install uv

WORKDIR /app

COPY pyproject.toml .
COPY uv.lock .

RUN uv venv
RUN uv pip install -r uv.lock

COPY main.py .

CMD ["/app/.venv/bin/python3", "main.py"]