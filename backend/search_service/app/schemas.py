# Модели для API (Pydantic/SQLModel)

from typing import Optional, List
from sqlmodel import SQLModel

# ---------------------------------------------------------------------------
# Схемы, которые вы уже определили. Они остаются почти без изменений.
# ---------------------------------------------------------------------------

# Схема для получения данных при создании продукта
class ProductBase(SQLModel):
    name: str
    price: float
    old_price: Optional[float] = None
    image_url: str
    rating: float
    reviews_count: int
    category: str
    brand: Optional[str] = None # <-- Важно добавить brand для фильтрации
    volume: Optional[str] = None # <-- Важно добавить volume для фильтрации
    percentage: Optional[str] = None # <-- Важно добавить percentage для фильтрации
    in_stock: bool

# Схема для отправки данных клиенту (включает ID)
# Будет использоваться в списке товаров
class ProductRead(ProductBase):
    id: int

# Схема для частичного обновления продукта
# Все поля опциональны
class ProductUpdate(SQLModel):
    name: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    volume: Optional[str] = None
    percentage: Optional[str] = None
    in_stock: Optional[bool] = None

# Схема для создания продукта (используется в эндпоинте POST)
class ProductCreate(ProductBase):
    pass

# Схема для пагинированного ответа, которую ждет api_gateway
class PaginatedProductResponse(SQLModel):
    items: List[ProductRead]  # <-- Список будет состоять из объектов ProductRead
    total: int
    page: int
    size: int
    pages: int