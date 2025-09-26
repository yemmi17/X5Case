import httpx
from fastapi import FastAPI, HTTPException
from pydantic_settings import BaseSettings
from .services import parse_ner_response

# Класс для загрузки переменных из .env файла
class Settings(BaseSettings):
    ner_service_url: str
    search_service_url: str

settings = Settings()
# Добавляем /api/predict к URL NER сервиса
ner_service_base_url = settings.ner_service_url
if not ner_service_base_url.endswith('/api/predict'):
    ner_service_base_url = ner_service_base_url.rstrip('/') + '/api/predict'
app = FastAPI(title="API Gateway")

# --- Основной эндпоинт поиска ---
@app.get("/api/v1/search")
async def search(
    q: str,
    page: int = 1,
    size: int = 10
):
    async with httpx.AsyncClient() as client:
        # 1. Получаем сущности от ML-сервиса
        try:
            ner_response = await client.post(ner_service_base_url, json={"text": q}, timeout=10.0)
            ner_response.raise_for_status()
            ner_data = ner_response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"NER service is unavailable: {e}")

        # 2. Парсим BIO-теги в словарь
        parsed_entities = parse_ner_response(ner_data, q)
        
        # 3. Ищем товары, передавая сущности как фильтры
        search_params = parsed_entities.copy()
        # Маппинг сущностей на параметры поиска
        if 'type' in search_params:
            search_params['category'] = search_params.pop('type')
        search_params['page'] = page
        search_params['size'] = size
        
        try:
            search_response = await client.get(settings.search_service_url, params=search_params, timeout=10.0)
            search_response.raise_for_status()
            products_data = search_response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Search service is unavailable: {e}")

    # 4. Собираем финальный ответ для фронтенда
    # Создаем сущности для ответа фронтенду
    frontend_entities = [{"entity": key.upper(), "value": value} for key, value in parsed_entities.items()]

    return {
        "entities": frontend_entities,
        "products": products_data
    }