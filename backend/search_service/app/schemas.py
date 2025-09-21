# Модели для API (Pydantic/SQLModel)

from typing import Optional
from sqlmodel import SQLModel

# Схема для получения данных при создании продукта
# Все поля обязательны, кроме тех, что имеют Optional или значение по умолчанию
class ProductCreate(SQLModel):
    name: str
    price: float
    old_price: Optional[float] = None
    image_url: str
    rating: float
    reviews_count: int
    category: str
    in_stock: bool

# Схема для отправки данных клиенту (включает ID)
class ProductRead(ProductCreate):
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
    in_stock: Optional[bool] = None