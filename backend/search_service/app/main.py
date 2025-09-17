# Главный файл с эндпоинтами

from fastapi import FastAPI

app = FastAPI(title="Search Service")

@app.get("/")
def read_root():
    return {"message": "Hello from Search Service"}

@app.get("/api/v1/products")
def search_products(category: str | None = None, brand: str | None = None):
    # Здесь будет логика поиска в БД
    return {
        "params": {"category": category, "brand": brand},
        "results": [] # Пока возвращаем пустой список
    }