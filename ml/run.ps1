# Имя образа
$IMAGE_NAME = "ml"

Write-Host "Building Docker image: $IMAGE_NAME"
docker build -t $IMAGE_NAME .

Write-Host "Running container with GPU access and mounting project directory..."
# --gpus all: даёт контейнеру доступ ко всем GPU
# -it: интерактивный режим с терминалом
# --rm: удалять контейнер после остановки
# -v: монтирование текущей директории в /app контейнера
docker run --gpus all -it --rm -v "${PWD}:/app" $IMAGE_NAME

Write-Host "Process completed."
