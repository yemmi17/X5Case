# Search Service - Документация

## Обзор

Search Service отвечает за поиск и фильтрацию товаров в базе данных PostgreSQL.

## Технологии

- **FastAPI** - веб-фреймворк
- **SQLModel** - ORM для работы с базой данных
- **PostgreSQL** - реляционная база данных
- **Alembic** - миграции базы данных
- **Poetry** - менеджер пакетов Python

## Эндпоинты

### GET /

Основной эндпоинт для поиска товаров с фильтрацией.

#### Параметры запроса
- `page` (int, опциональный, по умолчанию 1) - номер страницы
- `size` (int, опциональный, по умолчанию 10) - количество товаров на странице
- `category` (string, опциональный) - фильтр по категории
- `brand` (string, опциональный) - фильтр по бренду
- `volume` (string, опциональный) - фильтр по объему
- `percentage` (string, опциональный) - фильтр по проценту

#### Пример запроса
```bash
curl -X GET "http://localhost:8002/?brand=Coca-Cola&volume=1.5л&page=1&size=10"
```

#### Ответ
```json
{
  "items": [
    {
      "id": 38,
      "name": "Coca-Cola Zero",
      "price": 150.0,
      "old_price": null,
      "image_url": "https://dobryanka-rus.ru/storage/goods/234159_c9h2S.jpg",
      "rating": 4.9,
      "reviews_count": 180,
      "category": "напитки",
      "brand": "Coca-Cola",
      "volume": "1.5л",
      "percentage": null,
      "in_stock": true
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10,
  "pages": 1
}
```

## Модель данных

### Product (SQLModel)
```python
class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    price: float
    old_price: Optional[float] = None
    image_url: str
    rating: float
    reviews_count: int
    category: str = Field(index=True)
    brand: Optional[str] = Field(default=None, index=True)
    volume: Optional[str] = Field(default=None, index=True)
    percentage: Optional[str] = Field(default=None, index=True)
    in_stock: bool
```

### Схемы API (Pydantic)

#### ProductRead
```python
class ProductRead(ProductBase):
    id: int
```

#### PaginatedProductResponse
```python
class PaginatedProductResponse(SQLModel):
    items: List[ProductRead]
    total: int
    page: int
    size: int
    pages: int
```

## Логика поиска

### 1. Получение параметров
```python
@app.get("/", response_model=PaginatedProductResponse)
def read_products(
    session: Session = Depends(get_session),
    page: int = 1,
    size: int = 10,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    volume: Optional[str] = None,
    percentage: Optional[str] = None,
):
```

### 2. Построение запроса
```python
def get_products(session: Session, skip: int = 0, limit: int = 10, **filters):
    statement = select(Product)
    
    # Применяем фильтры
    for key, value in filters.items():
        if value is not None:
            if key in ['brand', 'category']:  # Поиск без учета регистра
                statement = statement.where(getattr(Product, key).ilike(value))
            else:
                statement = statement.where(getattr(Product, key) == value)
```

### 3. Подсчет общего количества
```python
    # Считаем общее количество до применения пагинации
    count_statement = select(func.count(Product.id))
    for key, value in filters.items():
        if value is not None:
            if key in ['brand', 'category']:
                count_statement = count_statement.where(getattr(Product, key).ilike(value))
            else:
                count_statement = count_statement.where(getattr(Product, key) == value)
    total_count = session.exec(count_statement).one()
```

### 4. Применение пагинации
```python
    # Применяем пагинацию
    products = session.exec(statement.offset(skip).limit(limit)).all()
    
    return products, total_count
```

## База данных

### Структура таблицы product
```sql
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    price FLOAT NOT NULL,
    old_price FLOAT,
    image_url VARCHAR NOT NULL,
    rating FLOAT NOT NULL,
    reviews_count INTEGER NOT NULL,
    category VARCHAR NOT NULL,
    brand VARCHAR,
    volume VARCHAR,
    percentage VARCHAR,
    in_stock BOOLEAN NOT NULL
);
```

### Индексы
```sql
CREATE INDEX ix_product_name ON product (name);
CREATE INDEX ix_product_category ON product (category);
CREATE INDEX ix_product_brand ON product (brand);
CREATE INDEX ix_product_volume ON product (volume);
CREATE INDEX ix_product_percentage ON product (percentage);
```

## Фильтрация

### Поддерживаемые фильтры

#### Точное совпадение
- `volume` - точное совпадение объема
- `percentage` - точное совпадение процента

#### Поиск без учета регистра
- `brand` - поиск бренда (ILIKE)
- `category` - поиск категории (ILIKE)

### Примеры фильтрации

#### По бренду
```bash
curl -X GET "http://localhost:8002/?brand=coca-cola"
# Найдет: Coca-Cola, COCA-COLA, coca-cola
```

#### По категории
```bash
curl -X GET "http://localhost:8002/?category=напитки"
# Найдет: напитки, НАПИТКИ, Напитки
```

#### По объему
```bash
curl -X GET "http://localhost:8002/?volume=1.5л"
# Найдет только точное совпадение: 1.5л
```

#### Комбинированная фильтрация
```bash
curl -X GET "http://localhost:8002/?brand=coca-cola&volume=1.5л&category=напитки"
```

## Пагинация

### Параметры
- `page` - номер страницы (начиная с 1)
- `size` - количество товаров на странице (по умолчанию 10)

### Расчет
```python
skip = (page - 1) * size
pages = (total + size - 1) // size
```

### Пример
```json
{
  "total": 25,
  "page": 2,
  "size": 10,
  "pages": 3
}
```

## Миграции

### Создание миграции
```bash
docker-compose -f docker-compose.dev.yml exec search_service \
  poetry run alembic revision --autogenerate -m "description"
```

### Применение миграции
```bash
docker-compose -f docker-compose.dev.yml exec search_service \
  poetry run alembic upgrade head
```

### Откат миграции
```bash
docker-compose -f docker-compose.dev.yml exec search_service \
  poetry run alembic downgrade -1
```

## Заполнение данными

### Скрипт seed.py
```python
def seed_data():
    with Session(engine) as session:
        # Очистка старых данных
        statement = select(Product)
        results = session.exec(statement).all()
        for product in results:
            session.delete(product)
        session.commit()
        
        # Добавление новых данных
        for product_data in PRODUCTS_TO_SEED:
            product = Product.model_validate(product_data)
            session.add(product)
        session.commit()
```

### Запуск заполнения
```bash
docker-compose -f docker-compose.dev.yml exec search_service \
  poetry run python scripts/seed.py
```

## Производительность

### Оптимизация запросов
- Индексы на часто используемые поля
- ILIKE для поиска без учета регистра
- Пагинация для больших результатов

### Метрики
- Время выполнения запроса: ~10-50ms
- Пропускная способность: ~1000 запросов/сек
- Использование памяти: ~100MB

## Мониторинг

### Логирование
- SQL запросы (echo=True)
- Время выполнения
- Количество результатов

### Метрики
- Количество запросов
- Время ответа
- Использование индексов
- Размер базы данных

## Конфигурация

### Подключение к БД
```python
class DBSettings(BaseSettings):
    database_url: str

settings = DBSettings()
engine = create_engine(settings.database_url, echo=True)
```

### Переменные окружения
```env
DATABASE_URL="postgresql://myuser:mypassword@db:5432/ner_db"
```

## Обработка ошибок

### Ошибки подключения
```python
except OperationalError:
    print("Ошибка: Не удалось подключиться к базе данных.")
```

### Ошибки валидации
```python
except ValidationError as e:
    raise HTTPException(status_code=422, detail=str(e))
```

## Безопасность

### SQL Injection
- Использование параметризованных запросов
- Валидация входных данных
- ORM защита

### Доступ к данным
- Нет аутентификации (внутренний сервис)
- Ограничение доступа через Docker network
