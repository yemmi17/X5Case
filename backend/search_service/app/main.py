# Главный файл с эндпоинтами

from typing import List
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Session

from . import crud
from .database import engine
from .schemas import ProductCreate, ProductRead, ProductUpdate

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI(title="Search Service")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Search Service"}

# 1. Эндпоинт для СОЗДАНИЯ продукта
@app.post("/api/v1/products/", response_model=ProductRead)
def create_product(*, session: Session = Depends(get_session), product: ProductCreate):
    """
    Создать новый продукт.
    """
    return crud.create_product(session=session, product_in=product)

# 2. Эндпоинт для ПОИСКА продуктов
@app.get("/api/v1/products/", response_model=List[ProductRead])
def read_products(
    *,
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    category: str | None = None
):
    """
    Получить список продуктов с фильтрацией по категории.
    """
    products = crud.get_products(session=session, skip=skip, limit=limit, category=category)
    return products

# 3. Эндпоинт для ПОЛУЧЕНИЯ продукта по ID
@app.get("/api/v1/products/{product_id}", response_model=ProductRead)
def read_product(*, session: Session = Depends(get_session), product_id: int):
    """
    Получить один продукт по его ID.
    """
    db_product = crud.get_product_by_id(session=session, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

# 4. (Бонус) Эндпоинт для ОБНОВЛЕНИЯ продукта
@app.patch("/api/v1/products/{product_id}", response_model=ProductRead)
def update_product(
    *,
    session: Session = Depends(get_session),
    product_id: int,
    product_in: ProductUpdate,
):
    """
    Частично обновить продукт по его ID.
    """
    db_product = crud.get_product_by_id(session=session, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = crud.update_product(session=session, db_product=db_product, product_in=product_in)
    return updated_product

# 5. (Бонус) Эндпоинт для УДАЛЕНИЯ продукта
@app.delete("/api/v1/products/{product_id}")
def delete_product(*, session: Session = Depends(get_session), product_id: int):
    """
    Удалить продукт по его ID.
    """
    product = crud.get_product_by_id(session=session, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    crud.delete_product(session=session, product_id=product_id)
    return {"ok": True}