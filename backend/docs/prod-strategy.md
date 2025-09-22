# Руководство по развертыванию NER-сервиса

Этот документ описывает шаги по интеграции готовой ML-модели в `ner_service` и его последующему развертыванию в production-окружении для хакатона и дальнейшего использования.

## 1. Интеграция и запуск ML-модели

Когда ML-команда предоставит обученную модель (например, файл `model.pth` и сопутствующие файлы, как токенизатор), выполните следующие шаги.

### Шаг 1.1: Размещение файлов модели

1. Создайте директорию `ner_service/app/weights/` (или `ner_service/app/model/`).
2. Поместите все файлы, необходимые для работы модели (сам файл с весами, файлы токенизатора, конфиги и т.д.), в эту директорию.

### Шаг 1.2: Загрузка модели при старте сервиса

Модель должна загружаться в память **один раз** при запуске приложения, а не на каждый запрос. Это критически важно для производительности.

Модифицируйте `ner_service/app/main.py`:

```python
# ner_service/app/main.py
from fastapi import FastAPI, Body
from fastapi.concurrency import run_in_threadpool
from contextlib import asynccontextmanager
from . import schemas
from .ml_model import Model  # Предполагается, что вы создали класс для модели

# --- Глобальная переменная для хранения модели ---
# Изначально None, будет инициализирована при старте
ml_model = None

# --- Lifespan Manager для загрузки/выгрузки модели ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Код, который выполнится ПРИ СТАРТЕ приложения
    print("Загрузка ML-модели...")
    global ml_model
    # Укажите путь к вашим весам
    ml_model = Model(model_path="app/weights/best_model.pth")
    print("Модель успешно загружена.")
      
    yield  # В этот момент приложение готово принимать запросы

    # Код, который выполнится ПРИ ОСТАНОВКЕ приложения
    print("Выгрузка ресурсов...")
    ml_model = None

app = FastAPI(lifespan=lifespan)

# --- Эндпоинт для предсказаний ---
@app.post("/api/predict", response_model=schemas.NERResponse)
async def predict(payload: schemas.NERRequest = Body(...)):
    if not payload.input:
        return []

    # Вызываем метод predict НАШЕЙ модели.
    # Это синхронная, CPU-bound операция, поэтому оборачиваем ее
    # в run_in_threadpool, чтобы не блокировать сервер.
    result = await run_in_threadpool(ml_model.predict, payload.input)
      
    return result
```

### Шаг 1.3: Создание класса модели

Создайте файл `ner_service/app/ml_model.py`, который инкапсулирует всю логику работы с моделью.

```python
# ner_service/app/ml_model.py
# Пример для PyTorch модели
import torch

class Model:
    def __init__(self, model_path: str):
        # Здесь происходит загрузка модели и токенизатора с диска
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = torch.load(model_path, map_location=self.device)
        self.model.eval()
        # self.tokenizer = ...  # Загрузка токенизатора

    def predict(self, text: str) -> list:
        """
        Синхронная функция, которая принимает текст и возвращает
        BIO-разметку согласно требованиям хакатона.
        """
        # 1. Токенизация текста
        # inputs = self.tokenizer(text, return_tensors="pt").to(self.device)

        # 2. Предсказание модели
        # with torch.no_grad():
        #     logits = self.model(**inputs).logits
          
        # 3. Постобработка и форматирование в BIO-разметку
        # ...
          
        # Примерный результат
        # Это просто для примера, здесь будет ваша логика
        if "кола 2л" in text.lower():
            return [
                {"start_index": 0, "end_index": 3, "entity": "B-BRAND"},
                {"start_index": 5, "end_index": 6, "entity": "B-VOLUME"}
            ]
        return []
```

## 2. Конфигурация docker-compose.prod.yml

Для задачи хакатона оценивается только `ner_service`. Чтобы не тратить ресурсы сервера, вы можете закомментировать `api_gateway` и `search_service` в файле `docker-compose.prod.yml`.

```yaml
services:
  # ner_service остается работать
  ner_service:
    container_name: ner_service_prod
    build:
      context: ./ner_service
      dockerfile: Dockerfile
    ports:
      - "8000:8000"  # Для хакатона можно выставить порт 80
    env_file:
      - .env
    restart: always

  # --- Эти сервисы можно временно отключить ---
  # db:
  #   ...
  # search_service:
  #   ...
  # api_gateway:
  #   ...
```

**Важно**: Для полноценной работы всего приложения (включая фронтенд) эти сервисы должны быть раскомментированы.

## 3. Что такое Gunicorn и как он используется?

**Gunicorn** — это production-ready WSGI сервер для Python.

Представьте, что uvicorn (который вы используете для разработки) — это один кассир в магазине. Он работает быстро, но если к нему выстроится очередь, всем придется ждать.

**Gunicorn** — это менеджер, который открывает несколько касс (uvicorn в роли "кассиров") и распределяет покупателей (запросы) между ними. Это позволяет обрабатывать несколько запросов одновременно, эффективно используя все ядра процессора.

В нашем проекте Gunicorn будет запускать и управлять несколькими процессами UvicornWorker.

## 4. Изменения в Dockerfile для работы с Gunicorn

Да, для каждого сервиса, который будет запускаться в production, нужно убедиться, что его Dockerfile использует gunicorn в CMD.

Вот пример **production-ready Dockerfile для ner_service**:

```dockerfile
# ner_service/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Устанавливаем Poetry и Gunicorn
RUN pip install poetry gunicorn

# Копируем файлы зависимостей и устанавливаем их
# --no-dev флаг не ставит зависимости для разработки (например, pytest)
COPY poetry.lock pyproject.toml ./
RUN poetry config virtualenvs.create false && poetry install --no-root --no-dev

# Копируем код нашего приложения
COPY ./app /app/app

# --- ВАЖНО: Команда для запуска в production ---
# Gunicorn запускает 4 "воркера" класса UvicornWorker.
# Они будут слушать на порту 8000 внутри контейнера.
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "-b", "0.0.0.0:8000", "--timeout", "120"]
```

Этот же шаблон нужно применить к Dockerfile для `api_gateway` и `search_service`.

## 5. Что такое "workers" и как выбрать их количество?

**Worker** — это отдельный дочерний процесс, который запускает Gunicorn. Каждый воркер содержит полную копию вашего приложения и может независимо обрабатывать запросы.

- **Зачем они нужны?** Python из-за Global Interpreter Lock (GIL) не может выполнять код на нескольких ядрах процессора в рамках одного процесса. Запуская несколько воркеров (процессов), мы обходим это ограничение и можем утилизировать все ядра CPU.
- **Как выбрать количество?** Золотое правило для CPU-bound задач (как наша):
  ```
  (2 * количество_ядер_CPU) + 1
  ```
  Например, если у вашего сервера на хакатоне 2 ядра, оптимальным будет `(2 * 2) + 1 = 5` воркеров. Если 4 ядра, то `(2 * 4) + 1 = 9` воркеров. Это значение вы указываете в Dockerfile (`-w 5`).

## 6. Дополнительные способы ускорения

Если базовая оптимизация с Gunicorn недостаточна, вот несколько продвинутых техник:

### 6.1. Использование GPU

Если ваша модель поддерживает и требует GPU, необходимо:

1. **Изменить базовый образ в Dockerfile:**
   Вместо `python:3.11-slim` используйте официальный образ от NVIDIA, который содержит CUDA.
   ```dockerfile
   FROM nvidia/cuda:12.1.1-runtime-ubuntu22.04
   ```
   (Вам нужно будет установить Python и Poetry вручную поверх него).

2. **Пробросить GPU в контейнер:**
   В `docker-compose.prod.yml` добавьте секцию `deploy` к `ner_service`:
   ```yaml
   ner_service:
     # ... (build, ports, etc)
     deploy:
       resources:
         reservations:
           devices:
             - driver: nvidia
               count: 1  # или all
               capabilities: [gpu]
   ```
   Это требует, чтобы на хост-машине был установлен NVIDIA Container Toolkit.

3. **Адаптировать код**: Убедитесь, что ваш код в `ml_model.py` перемещает модель и тензоры на GPU (`.to("cuda")`).

### 6.2. Оптимизация самой модели

- **Квантизация**: Преобразование весов модели из float32 в int8. Это значительно уменьшает размер модели и ускоряет вычисления на CPU, почти без потери качества.
- **Конвертация в ONNX**: ONNX (Open Neural Network Exchange) — это открытый формат для моделей машинного обучения. Конвертация в ONNX и запуск через ONNX Runtime может дать существенный прирост скорости.

### 6.3. Асинхронное батчирование (Batching)

Это сложная, но очень эффективная техника. Сервис накапливает несколько запросов, пришедших за короткий промежуток времени (например, 10-20 мс), объединяет их в один "батч" (пакет) и отправляет в модель за один проход. Это гораздо эффективнее, чем обрабатывать каждый запрос по отдельности, особенно на GPU.

Для реализации можно использовать специальные библиотеки или самописные решения на основе asyncio.