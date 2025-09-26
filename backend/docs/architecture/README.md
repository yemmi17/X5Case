# Документация системы поиска товаров

## Обзор

Система представляет собой микросервисную архитектуру для интеллектуального поиска товаров с использованием машинного обучения для извлечения сущностей из текстовых запросов.

## Структура документации

### 1. [Архитектура системы](./architecture-overview.md)
- Обзор компонентов
- Схема взаимодействия
- Форматы данных
- Конфигурация

### 2. [API Gateway](./api-gateway.md)
- Эндпоинты и параметры
- Логика обработки запросов
- Парсинг BIO-разметки
- Маппинг сущностей
- Обработка ошибок

### 3. [NER Service](./ner-service.md)
- Модель машинного обучения
- Типы сущностей
- BIO-разметка
- Примеры работы
- Производительность

### 4. [Search Service](./search-service.md)
- Модель данных
- Логика поиска и фильтрации
- База данных PostgreSQL
- Пагинация
- Миграции

### 5. [Поток данных](./data-flow.md)
- Детальная схема взаимодействия
- Примеры запросов
- Преобразования данных
- Обработка ошибок

## Быстрый старт

### Режим разработки (полная система)
```bash
cd backend
docker-compose -f docker-compose.dev.yml up -d
```

### Заполнение базы данных
```bash
docker-compose -f docker-compose.dev.yml exec search_service \
  poetry run python scripts/seed.py
```

### Тестирование API
```bash
curl -X GET "http://localhost:8000/api/v1/search?q=coca-cola 1.5л"
```

### Режим хакатона (только NER)
```bash
cd backend
docker-compose -f docker-compose.hackathon.yml up -d
```

### Тестирование NER напрямую
```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "coca-cola 1.5л"}'
```

## Компоненты системы

### API Gateway (порт 8000)
- Единая точка входа
- Координация между сервисами
- Агрегация результатов

### NER Service (порт 8001)
- Извлечение сущностей из текста
- Модель spaCy
- BIO-разметка

### Search Service (порт 8002)
- Поиск товаров в БД
- Фильтрация и пагинация
- SQLModel + PostgreSQL

### PostgreSQL (порт 5433)
- Хранение данных о товарах
- Индексы для быстрого поиска

## Примеры использования

### Простой поиск по бренду
```bash
curl -X GET "http://localhost:8000/api/v1/search?q=coca-cola"
```

### Поиск с объемом
```bash
curl -X GET "http://localhost:8000/api/v1/search?q=coca-cola 1.5л"
```

### Поиск по категории
```bash
curl -X GET "http://localhost:8000/api/v1/search?q=напитки"
```

### Сложный запрос
```bash
curl -X GET "http://localhost:8000/api/v1/search?q=Простоквашино молоко 2.5% 930мл"
```

## Формат ответа

```json
{
  "entities": [
    {"entity": "BRAND", "value": "coca-cola"},
    {"entity": "VOLUME", "value": "1.5л"}
  ],
  "products": {
    "items": [
      {
        "id": 38,
        "name": "Coca-Cola Zero",
        "price": 150.0,
        "brand": "Coca-Cola",
        "volume": "1.5л",
        "category": "напитки",
        "in_stock": true
      }
    ],
    "total": 1,
    "page": 1,
    "size": 10,
    "pages": 1
  }
}
```

## Типы сущностей

- **BRAND** - бренд товара
- **TYPE** - тип/категория товара
- **VOLUME** - объем товара
- **PERCENTAGE** - процентное содержание

## Разработка

### Структура проекта
```
X5Case/
├── backend/
│   ├── api_gateway/          # API Gateway сервис
│   ├── search_service/       # Search Service
│   ├── docs/                 # Документация
│   ├── docker-compose.dev.yml      # Полная система для разработки
│   └── docker-compose.hackathon.yml # Только NER для хакатона
└── ml/                      # Реальный ML сервис (NER)
    ├── app/
    ├── model/
    └── Dockerfile
```

### Зависимости
- Python 3.11+
- FastAPI
- SQLModel
- spaCy
- PostgreSQL
- Docker

### Переменные окружения
```env
NER_SERVICE_URL="http://ner_service:8001"
SEARCH_SERVICE_URL="http://search_service:8002"
DATABASE_URL="postgresql://myuser:mypassword@db:5432/ner_db"
```

## Мониторинг

### Логи
```bash
# Режим разработки
docker-compose -f docker-compose.dev.yml logs api_gateway
docker-compose -f docker-compose.dev.yml logs search_service
docker-compose -f docker-compose.dev.yml logs ner_service

# Режим хакатона
docker-compose -f docker-compose.hackathon.yml logs ner_service
```

### Метрики
- Время выполнения запросов
- Количество запросов
- Точность NER
- Использование индексов БД

## Производительность

### Время ответа
- **Простой запрос**: ~150ms
- **Сложный запрос**: ~600ms
- **Пропускная способность**: ~100 запросов/сек

### Оптимизация
- Индексы в БД
- Асинхронная обработка
- Пул соединений
- Кэширование (планируется)

## Безопасность

### Текущие меры
- Параметризованные SQL запросы
- Валидация входных данных
- Изоляция в Docker сети

### Планируемые улучшения
- Аутентификация
- Rate limiting
- HTTPS
- Логирование безопасности

## Поддержка

### Отладка
1. Проверить логи сервисов
2. Протестировать каждый сервис отдельно
3. Проверить подключение к БД
4. Валидировать входные данные

### Частые проблемы
- **500 Internal Server Error**: Проверить логи API Gateway
- **503 Service Unavailable**: Проверить доступность сервисов
- **Пустые результаты**: Проверить данные в БД
- **Медленные запросы**: Проверить индексы БД

## Лицензия

Проект разработан для демонстрации архитектуры микросервисов с использованием ML.
