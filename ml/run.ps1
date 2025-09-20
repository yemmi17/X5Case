# Имя образа
$IMAGE_NAME = "ml"

# Проверка наличия образа
$imageExists = docker images -q $IMAGE_NAME

if (-not $imageExists) {
    Write-Host "Image $IMAGE_NAME not found. Building Docker image..."
    docker build -t $IMAGE_NAME .
} else {
    Write-Host "Image $IMAGE_NAME already exists. Skipping build."
}

Write-Host "Running container with GPU access and mounting project directory..."
# --gpus all: даёт контейнеру доступ ко всем GPU
# -it: интерактивный режим с терминалом
# --rm: удалять контейнер после остановки
# -v: монтирование текущей директории в /app контейнера
docker run --gpus all -it --rm -v "${PWD}:/app" $IMAGE_NAME

Write-Host "Process completed."