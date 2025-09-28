# Главный файл с эндпоинтами

from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Session

from . import crud
from .database import engine
from .schemas import PaginatedProductResponse

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI(title="Search Service")

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
    skip = (page - 1) * size
    filters = {"category": category, "brand": brand, "volume": volume, "percentage": percentage}
    products, total = crud.get_products(session=session, skip=skip, limit=size, **filters)
    
    return PaginatedProductResponse(
        items=products,
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )