#!/bin/bash

IMAGE_NAME="ml"

echo "Building Docker image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" .

echo "Running container with GPU access and mounting project directory..."
# --gpus all: даёт контейнеру доступ ко всем GPU.
# -it: запускает контейнер в интерактивном режиме с терминалом.
# --rm: автоматически удаляет контейнер после его остановки.
# -v "$(pwd)":/app: монтирует вашу текущую директорию в /app внутри контейнера.
winpty docker run --gpus all -it --rm \
    -v "$(pwd)":/app \
    "$IMAGE_NAME"
    
echo "Process completed."