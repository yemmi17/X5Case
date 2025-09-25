# Модели таблиц БД (SQLModel)

from typing import Optional
from sqlmodel import Field, SQLModel

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)  # index=True ускоряет поиск по имени
    price: float
    old_price: Optional[float] = None
    image_url: str  # В БД лучше хранить URL картинки, а не саму картинку
    rating: float
    reviews_count: int
    category: str = Field(index=True) # index=True ускоряет фильтрацию по категории
    in_stock: bool