# API Endpoints Documentation

## Обзор архитектуры

Система состоит из трех микросервисов:

1. **API Gateway** - основной шлюз для клиентов
2. **Search Service** - сервис поиска и управления продуктами
3. **Mock NER Service** - сервис извлечения сущностей (заглушка)

## Схема взаимодействия

```
Клиент → API Gateway → NER Service (извлечение сущностей)
                    ↓
                Search Service (поиск продуктов)
```

---

## 1. API Gateway Service

**Базовый URL:** `http://localhost:8000`

### Эндпоинты

#### GET `/api/v1/search`

**Описание:** Основной эндпоинт для сквозного поиска товаров

**Параметры:**
- `q` (string, query) - текстовый запрос для поиска

**Процесс работы:**
1. Принимает текстовый запрос
2. Отправляет его в NER-сервис для извлечения сущностей
3. Использует извлеченные сущности для фильтрации в Search-сервисе
4. Возвращает найденные товары

**Пример запроса:**
```bash
GET /api/v1/search?q=молоко домик в деревне 3.2% 1л
```

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Молоко Домик в деревне 3.2% 1л",
    "price": 89.90,
    "old_price": 99.90,
    "image_url": "https://example.com/milk.jpg",
    "rating": 4.5,
    "reviews_count": 1234,
    "category": "молочные продукты",
    "in_stock": true
  }
]
```

**Возможные ошибки:**
- `503` - Ошибка при обращении к внутреннему сервису
- `4xx/5xx` - Ошибки от внутренних сервисов

---

## 2. Search Service

**Базовый URL:** `http://localhost:8001`

### Эндпоинты

#### GET `/`

**Описание:** Приветственное сообщение сервиса

**Ответ:**
```json
{
  "message": "Welcome to the Search Service"
}
```

#### POST `/api/v1/products/`

**Описание:** Создать новый продукт

**Тело запроса (ProductCreate):**
```json
{
  "name": "string",
  "price": 0.0,
  "old_price": 0.0,  // опционально
  "image_url": "string",
  "rating": 0.0,
  "reviews_count": 0,
  "category": "string",
  "in_stock": true
}
```

**Ответ (ProductRead):**
```json
{
  "id": 1,
  "name": "string",
  "price": 0.0,
  "old_price": 0.0,
  "image_url": "string",
  "rating": 0.0,
  "reviews_count": 0,
  "category": "string",
  "in_stock": true
}
```

#### GET `/api/v1/products/`

**Описание:** Получить список продуктов с фильтрацией

**Параметры:**
- `skip` (int, query, default: 0) - количество записей для пропуска
- `limit` (int, query, default: 100, max: 100) - максимальное количество записей
- `category` (string, query, optional) - фильтр по категории

**Пример запроса:**
```bash
GET /api/v1/products/?skip=0&limit=10&category=молочные продукты
```

**Ответ:**
```json
[
  {
    "id": 1,
    "name": "Молоко Домик в деревне 3.2% 1л",
    "price": 89.90,
    "old_price": 99.90,
    "image_url": "https://example.com/milk.jpg",
    "rating": 4.5,
    "reviews_count": 1234,
    "category": "молочные продукты",
    "in_stock": true
  }
]
```

#### GET `/api/v1/products/{product_id}`

**Описание:** Получить продукт по ID

**Параметры:**
- `product_id` (int, path) - ID продукта

**Ответ (ProductRead):**
```json
{
  "id": 1,
  "name": "string",
  "price": 0.0,
  "old_price": 0.0,
  "image_url": "string",
  "rating": 0.0,
  "reviews_count": 0,
  "category": "string",
  "in_stock": true
}
```

**Ошибки:**
- `404` - Product not found

#### PATCH `/api/v1/products/{product_id}`

**Описание:** Частично обновить продукт

**Параметры:**
- `product_id` (int, path) - ID продукта

**Тело запроса (ProductUpdate):**
```json
{
  "name": "string",        // опционально
  "price": 0.0,           // опционально
  "old_price": 0.0,       // опционально
  "image_url": "string",  // опционально
  "rating": 0.0,          // опционально
  "reviews_count": 0,     // опционально
  "category": "string",   // опционально
  "in_stock": true        // опционально
}
```

**Ответ (ProductRead):** Обновленный продукт

**Ошибки:**
- `404` - Product not found

#### DELETE `/api/v1/products/{product_id}`

**Описание:** Удалить продукт

**Параметры:**
- `product_id` (int, path) - ID продукта

**Ответ:**
```json
{
  "ok": true
}
```

**Ошибки:**
- `404` - Product not found

---

## 3. Mock NER Service

**Базовый URL:** `http://localhost:8002`

### Эндпоинты

#### POST `/extract_entities`

**Описание:** Извлечение сущностей из текста (заглушка)

**Тело запроса:**
```json
{
  "text": "string"
}
```

**Ответ:**
```json
{
  "category": "молочные продукты",
  "brand": "домик в деревне",
  "percentage": "3.2%",
  "volume": "1л"
}
```

**Примечание:** Это заглушка, которая всегда возвращает одинаковый результат для демонстрации работы системы.

---

## Модели данных

### ProductCreate
```json
{
  "name": "string",           // обязательное
  "price": 0.0,              // обязательное
  "old_price": 0.0,          // опциональное
  "image_url": "string",     // обязательное
  "rating": 0.0,             // обязательное
  "reviews_count": 0,        // обязательное
  "category": "string",      // обязательное
  "in_stock": true           // обязательное
}
```

### ProductRead
Включает все поля из `ProductCreate` плюс:
```json
{
  "id": 1                    // обязательное
}
```

### ProductUpdate
Все поля опциональны:
```json
{
  "name": "string",          // опциональное
  "price": 0.0,              // опциональное
  "old_price": 0.0,         // опциональное
  "image_url": "string",    // опциональное
  "rating": 0.0,            // опциональное
  "reviews_count": 0,       // опциональное
  "category": "string",     // опциональное
  "in_stock": true          // опциональное
}
```

---

## Примеры использования

### 1. Поиск через API Gateway

```bash
curl "http://localhost:8000/api/v1/search?q=молоко домик в деревне"
```

### 2. Создание продукта

```bash
curl -X POST "http://localhost:8001/api/v1/products/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Молоко Домик в деревне 3.2% 1л",
    "price": 89.90,
    "old_price": 99.90,
    "image_url": "https://example.com/milk.jpg",
    "rating": 4.5,
    "reviews_count": 1234,
    "category": "молочные продукты",
    "in_stock": true
  }'
```

### 3. Получение продуктов с фильтрацией

```bash
curl "http://localhost:8001/api/v1/products/?category=молочные продукты&limit=10"
```

### 4. Обновление продукта

```bash
curl -X PATCH "http://localhost:8001/api/v1/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 79.90,
    "in_stock": false
  }'
```

---

## Настройка переменных окружения

### API Gateway
```env
NER_SERVICE_URL=http://localhost:8002
SEARCH_SERVICE_URL=http://localhost:8001
```

### Search Service
```env
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database_name
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"
```

### Mock NER Service
Не требует дополнительных настроек.
