# NER Service - Документация

## Обзор

NER (Named Entity Recognition) Service использует машинное обучение для извлечения структурированных сущностей из неструктурированного текста.

## Технологии

- **FastAPI** - веб-фреймворк
- **spaCy** - библиотека для NLP
- **PyTorch** - фреймворк машинного обучения
- **uv** - менеджер пакетов Python

## Эндпоинты

### POST /api/predict

Основной эндпоинт для извлечения сущностей из текста.

#### Параметры запроса
```json
{
  "text": "coca-cola 1.5л"
}
```

#### Пример запроса
```bash
curl -X POST "http://localhost:8001/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "coca-cola 1.5л"}'
```

#### Ответ
```json
[
  {
    "start_index": 0,
    "end_index": 9,
    "entity": "B-BRAND"
  },
  {
    "start_index": 10,
    "end_index": 14,
    "entity": "I-VOLUME"
  }
]
```

## Модель данных

### Входные данные (TextInput)
```python
class TextInput(BaseModel):
    text: str
```

### Выходные данные (ResponseEntity)
```python
class ResponseEntity(BaseModel):
    start_index: int
    end_index: int
    entity: str
```

### Типы сущностей

Модель распознает следующие типы сущностей:

- **B-BRAND** / **I-BRAND** - бренд товара
- **B-TYPE** / **I-TYPE** - тип/категория товара
- **B-VOLUME** / **I-VOLUME** - объем товара
- **B-PERCENTAGE** / **I-PERCENTAGE** - процентное содержание

## BIO-разметка

Система использует BIO-разметку для обозначения границ сущностей:

- **B-** (Begin) - начало сущности
- **I-** (Inside) - продолжение сущности
- **O** (Outside) - не сущность

### Примеры разметки

#### Простая сущность
```
Текст: "coca-cola"
Разметка: B-BRAND
```

#### Составная сущность
```
Текст: "coca-cola 1.5л"
Разметка: B-BRAND I-VOLUME
```

#### Множественные сущности
```
Текст: "молоко 3.2% 1л"
Разметка: B-TYPE B-PERCENTAGE B-VOLUME
```

## Логика обработки

### 1. Получение запроса
```python
@app.post("/api/predict", response_model=Response)
async def extract_entities_endpoint(input_data: TextInput = Body(...)):
    if not input_data.text:
        return Response(entities=[])
```

### 2. Извлечение сущностей
```python
# Вызываем тяжелую функцию в отдельном потоке
result = await run_in_threadpool(extract_entities_for_backend, input_data.text)
return result
```

### 3. Обработка в отдельном потоке
```python
def extract_entities_for_backend(text: str) -> Response:
    # Загрузка модели spaCy
    nlp = spacy.load("model/")
    
    # Обработка текста
    doc = nlp(text)
    
    # Извлечение сущностей
    entities = []
    for ent in doc.ents:
        entities.append(ResponseEntity(
            start_index=ent.start_char,
            end_index=ent.end_char,
            entity=ent.label_
        ))
    
    return Response(entities=entities)
```

## Модель машинного обучения

### Архитектура
- **Основа**: spaCy с кастомной моделью
- **Тип**: Transformer-based NER
- **Язык**: Русский
- **Домен**: Товары и продукты

### Обучение
- **Данные**: Размеченные тексты товаров
- **Метрики**: F1-score, Precision, Recall
- **Валидация**: Cross-validation

### Конфигурация модели
```json
{
  "model_name": "ru_core_news_sm",
  "pipeline": ["tok2vec", "ner"],
  "entities": ["BRAND", "TYPE", "VOLUME", "PERCENTAGE"]
}
```

## Примеры работы

### Пример 1: Бренд и объем
```bash
# Запрос
curl -X POST "http://localhost:8001/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "coca-cola 1.5л"}'

# Ответ
[
  {"start_index": 0, "end_index": 9, "entity": "B-BRAND"},
  {"start_index": 10, "end_index": 14, "entity": "I-VOLUME"}
]
```

### Пример 2: Тип и процент
```bash
# Запрос
curl -X POST "http://localhost:8001/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "молоко 3.2%"}'

# Ответ
[
  {"start_index": 0, "end_index": 6, "entity": "B-TYPE"},
  {"start_index": 7, "end_index": 11, "entity": "B-PERCENTAGE"}
]
```

### Пример 3: Сложный запрос
```bash
# Запрос
curl -X POST "http://localhost:8001/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "Простоквашино молоко 2.5% 930мл"}'

# Ответ
[
  {"start_index": 0, "end_index": 12, "entity": "B-BRAND"},
  {"start_index": 13, "end_index": 19, "entity": "B-TYPE"},
  {"start_index": 20, "end_index": 24, "entity": "B-PERCENTAGE"},
  {"start_index": 25, "end_index": 30, "entity": "B-VOLUME"}
]
```

## Производительность

### Метрики
- **Время обработки**: ~100-500ms на запрос
- **Пропускная способность**: ~100 запросов/сек
- **Память**: ~2GB RAM
- **CPU**: 2-4 ядра

### Оптимизация
- Асинхронная обработка
- Кэширование модели
- Пул потоков для CPU-интенсивных задач

## Мониторинг

### Логирование
- Входящие запросы
- Время обработки
- Ошибки модели
- Использование ресурсов

### Метрики
- Количество запросов
- Время ответа
- Точность распознавания
- Использование памяти

## Развертывание

### Docker
```dockerfile
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev
COPY . .
```

### Переменные окружения
```env
# Модель загружается из локальной директории
MODEL_PATH=/app/model/
```

### Зависимости
- Python 3.12+
- spaCy 3.8+
- PyTorch 2.8+
- FastAPI 0.117+
