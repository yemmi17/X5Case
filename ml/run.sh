#!/bin/bash

IMAGE_NAME="ml"

if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" == "" ]]; then
    echo "Docker image $IMAGE_NAME not found. Building image..."
    docker build -t "$IMAGE_NAME" .
else
    echo "Docker image $IMAGE_NAME found. Skipping build."
fi

echo "Running container with GPU access and mounting project directory..."
# --gpus all: даёт контейнеру доступ ко всем GPU.
# -it: интерактивный режим с терминалом.
# --rm: автоматически удаляет контейнер после остановки.
# -v "$(pwd)":/app: монтирует текущую директорию внутрь контейнера.
winpty docker run --gpus all -it --rm \
    -v "$(pwd)":/app \
    "$IMAGE_NAME"
    
echo "Process completed."
