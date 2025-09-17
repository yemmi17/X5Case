import httpx
from fastapi import FastAPI
from pydantic_settings import BaseSettings

# Класс для загрузки переменных из .env файла
class Settings(BaseSettings):
    ner_service_url: str
    search_service_url: str

settings = Settings()
app = FastAPI(title="API Gateway")

@app.get("/api/v1/search")
async def search(q: str):
    async with httpx.AsyncClient() as client:
        # Шаг 1: Идем в NER сервис по URL из настроек
        ner_response = await client.post(f"{settings.ner_service_url}/extract_entities", json={"text": q})
        ner_response.raise_for_status() # Проверка на ошибки
        entities = ner_response.json()

        # Шаг 2: Идем в Search сервис
        search_response = await client.get(f"{settings.search_service_url}/api/v1/products", params=entities)
        search_response.raise_for_status() # Проверка на ошибки
        products = search_response.json()

    return products