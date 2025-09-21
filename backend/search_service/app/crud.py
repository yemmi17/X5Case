# Логика работы с БД (создать, прочитать, ...)

from typing import List, Optional
from sqlmodel import Session, select

from .models import Product
from .schemas import ProductCreate, ProductUpdate


def create_product(*, session: Session, product_in: ProductCreate) -> Product:
    """Создает новый продукт в базе данных."""
    # Создаем объект модели Product на основе данных из схемы ProductCreate
    db_product = Product.model_validate(product_in)
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product


def get_product_by_id(*, session: Session, product_id: int) -> Optional[Product]:
    """Получает продукт по его ID."""
    return session.get(Product, product_id)


# TODO: Пока метод фильтрует только по категориям
def get_products(
    *, session: Session, skip: int = 0, limit: int = 100, category: Optional[str] = None
) -> List[Product]:
    """Получает список продуктов с возможностью фильтрации по категории."""
    statement = select(Product).offset(skip).limit(limit)
    if category:
        statement = statement.where(Product.category == category)
    
    products = session.exec(statement).all()
    return products


def update_product(
    *, session: Session, db_product: Product, product_in: ProductUpdate
) -> Product:
    """Обновляет данные существующего продукта."""
    product_data = product_in.model_dump(exclude_unset=True)
    for key, value in product_data.items():
        setattr(db_product, key, value)
    
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product


def delete_product(*, session: Session, product_id: int):
    """Удаляет продукт по ID."""
    product = session.get(Product, product_id)
    if product:
        session.delete(product)
        session.commit()
        return True
    return False