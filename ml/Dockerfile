FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

# 4. Устанавливаем рабочую директорию
WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# ENV UV_LINK_MODE=copy

# Ensure installed tools can be executed out of the box
ENV UV_TOOL_BIN_DIR=/usr/local/bin

# Install the project's dependencies using the lockfile and settings
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-dev

COPY . ./

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev