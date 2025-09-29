# Логика работы с БД (создать, прочитать, ...)

from sqlmodel import Session, select, func
from .models import Product

def get_products(session: Session, skip: int = 0, limit: int = 10, **filters):
    statement = select(Product)
    
    # Применяем фильтры
    for key, value in filters.items():
        if value is not None:
            if key in ['brand', 'category']:  # Для бренда и категории делаем поиск без учета регистра
                statement = statement.where(getattr(Product, key).ilike(value))
            else:
                statement = statement.where(getattr(Product, key) == value)
            
    # Считаем общее количество до применения пагинации
    count_statement = select(func.count(Product.id))
    for key, value in filters.items():
        if value is not None:
            if key in ['brand', 'category']:  # Для бренда и категории делаем поиск без учета регистра
                count_statement = count_statement.where(getattr(Product, key).ilike(value))
            else:
                count_statement = count_statement.where(getattr(Product, key) == value)
    total_count = session.exec(count_statement).one()

    # Применяем пагинацию
    products = session.exec(statement.offset(skip).limit(limit)).all()
    
    return products, total_count

def get_popular_products(session: Session, skip: int = 0, limit: int = 10):
    """Получает товары, отсортированные по убыванию рейтинга."""
    statement = select(Product).order_by(Product.rating.desc())
    
    # Считаем общее количество
    total_count = session.exec(select(func.count()).select_from(statement.subquery())).one()

    # Применяем пагинацию
    products = session.exec(statement.offset(skip).limit(limit)).all()
    
    return products, total_count