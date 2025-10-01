# API Gateway - Документация

## Обзор

API Gateway является центральным компонентом системы, который координирует взаимодействие между фронтендом и микросервисами.

## Эндпоинты

### GET /api/v1/search

Основной эндпоинт для поиска товаров.

#### Параметры запроса
- `q` (string, обязательный) - поисковый запрос
- `page` (int, опциональный, по умолчанию 1) - номер страницы
- `size` (int, опциональный, по умолчанию 10) - количество товаров на странице

#### Пример запроса
```bash
curl -X GET "http://localhost:8000/api/v1/search?q=coca-cola 1.5л&page=1&size=10"
```

## Логика обработки запроса

### 1. Получение сущностей от NER Service

```python
# Отправка запроса в NER Service
ner_response = await client.post(
    "http://ner_service:8001/api/predict", 
    json={"text": "coca-cola 1.5л"}, 
    timeout=10.0
)
```

**Входные данные:**
```json
{"text": "coca-cola 1.5л"}
```

**Ответ NER Service:**
```json
[
  {"start_index": 0, "end_index": 9, "entity": "B-BRAND"},
  {"start_index": 10, "end_index": 14, "entity": "I-VOLUME"}
]
```

### 2. Парсинг BIO-разметки

Функция `parse_ner_response()` преобразует BIO-разметку в словарь сущностей:

```python
def parse_ner_response(ner_data: List[Dict], text: str) -> Dict[str, str]:
    entities = {}
    current_entity_type = None
    current_entity_value = ""

    for item in ner_data:
        entity_type = item['entity'].split('-')[-1]  # BRAND, TYPE, VOLUME, etc.
        value = text[item['start_index']:item['end_index']]

        if item['entity'].startswith('B-'):
            # Сохраняем предыдущую сущность
            if current_entity_type:
                entities[current_entity_type.lower()] = current_entity_value.strip()
            # Начинаем новую сущность
            current_entity_type = entity_type
            current_entity_value = value
        elif item['entity'].startswith('I-'):
            # Продолжение или новая сущность
            if current_entity_type == entity_type:
                current_entity_value += " " + value
            else:
                if current_entity_type:
                    entities[current_entity_type.lower()] = current_entity_value.strip()
                current_entity_type = entity_type
                current_entity_value = value

    # Сохраняем последнюю сущность
    if current_entity_type:
        entities[current_entity_type.lower()] = current_entity_value.strip()

    return entities
```

**Результат парсинга:**
```python
{"brand": "coca-cola", "volume": "1.5л"}
```

### 3. Маппинг сущностей на параметры поиска

```python
search_params = parsed_entities.copy()
# Маппинг сущностей на параметры поиска
if 'type' in search_params:
    search_params['category'] = search_params.pop('type')
search_params['page'] = page
search_params['size'] = size
```

**Результат маппинга:**
```python
{"brand": "coca-cola", "volume": "1.5л", "page": 1, "size": 10}
```

### 4. Поиск товаров в Search Service

```python
search_response = await client.get(
    "http://search_service:8002/", 
    params=search_params, 
    timeout=10.0
)
```

**Ответ Search Service:**
```json
{
  "items": [
    {
      "name": "Coca-Cola Zero",
      "price": 150.0,
      "brand": "Coca-Cola",
      "volume": "1.5л",
      "category": "напитки",
      "in_stock": true,
      "id": 38
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10,
  "pages": 1
}
```

### 5. Формирование ответа для фронтенда

```python
# Создаем сущности для ответа фронтенду
frontend_entities = [
    {"entity": key.upper(), "value": value} 
    for key, value in parsed_entities.items()
]

return {
    "entities": frontend_entities,
    "products": products_data
}
```

**Финальный ответ:**
```json
{
  "entities": [
    {"entity": "BRAND", "value": "coca-cola"},
    {"entity": "VOLUME", "value": "1.5л"}
  ],
  "products": {
    "items": [...],
    "total": 1,
    "page": 1,
    "size": 10,
    "pages": 1
  }
}
```

### GET /api/v1/products/{product_id}

Эндпоинт для получения одного товара по его ID через API Gateway. Проксирует запрос в Search Service: `GET {SEARCH_SERVICE_URL}/products/{product_id}`.

#### Параметры пути
- `product_id` (int, обязательный) — идентификатор товара

#### Пример запроса
```bash
curl -X GET "http://localhost:8000/api/v1/products/84"
```

#### Логика
- Gateway делает запрос: `GET {SEARCH_SERVICE_URL}/products/{product_id}`
- При `404` от Search Service пробрасывается `404 Product not found`
- При сетевой ошибке — `503 Search service is unavailable`

#### Примеры ответов
- 200 OK
```json
{
  "id": 84,
  "name": "Молоко Домик в деревне 3.2%",
  "price": 99.9,
  "image_url": "...",
  "rating": 4.8,
  "reviews_count": 120,
  "category": "молочные продукты",
  "brand": "Домик в деревне",
  "volume": "950мл",
  "percentage": "3.2%",
  "in_stock": true
}
```

- 404 Not Found
```json
{ "detail": "Product not found" }
```


### GET /api/v1/products/popular

Эндпоинт для получения популярных товаров с пагинацией через API Gateway. Проксирует запрос в Search Service: `GET {SEARCH_SERVICE_URL}/products/popular`.

#### Параметры запроса
- `page` (int, опциональный, по умолчанию 1)
- `size` (int, опциональный, по умолчанию 10)

#### Пример запроса
```bash
curl -X GET "http://localhost:8000/api/v1/products/popular?page=1&size=5"
```

#### Логика
- Gateway формирует `params = { page, size }`
- Делает запрос: `GET {SEARCH_SERVICE_URL}/products/popular`
- Возвращает ответ Search Service как есть
- При сетевой ошибке — `503 Search service is unavailable`

#### Пример ответа
```json
{
  "items": [
    {
      "id": 89,
      "name": "Coca-Cola Classic",
      "price": 150.0,
      "image_url": "...",
      "rating": 5.0,
      "reviews_count": 250,
      "category": "напитки",
      "brand": "Coca-Cola",
      "volume": "2л",
      "in_stock": true
    }
    // ...
  ],
  "total": 13,
  "page": 1,
  "size": 5,
  "pages": 3
}
```

## Обработка ошибок

### Ошибки NER Service
```python
except httpx.RequestError as e:
    raise HTTPException(
        status_code=503, 
        detail=f"NER service is unavailable: {e}"
    )
```

### Ошибки Search Service
```python
except httpx.RequestError as e:
    raise HTTPException(
        status_code=503, 
        detail=f"Search service is unavailable: {e}"
    )
```

## Конфигурация

### Настройки
```python
class Settings(BaseSettings):
    ner_service_url: str
    search_service_url: str
```

### Переменные окружения
```env
NER_SERVICE_URL="http://ner_service:8001"
SEARCH_SERVICE_URL="http://search_service:8002"
```

## Логирование

API Gateway логирует:
- Входящие запросы
- Ошибки взаимодействия с сервисами
- Время выполнения запросов

## Производительность

- Таймаут запросов: 10 секунд
- Асинхронная обработка
- Пул соединений httpx
- Кэширование не реализовано (можно добавить Redis)
