# Модели таблиц БД (SQLModel)

from typing import Optional
from sqlmodel import Field, SQLModel

# class Product(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     name: str = Field(index=True)
#     category: str
#     brand: Optional[str] = None
#     volume: Optional[str] = None
#     percentage: Optional[float] = None

# Важно: Это пример. Тебе нужно будет создать здесь модели,
# которые соответствуют реальным данным о товарах.
# После того как ты создашь или изменишь эту модель, нужно будет создать миграцию Alembic.

