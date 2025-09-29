import httpx
from fastapi import FastAPI, HTTPException
from pydantic_settings import BaseSettings
from fastapi.middleware.cors import CORSMiddleware
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

search_service_base_url = settings.search_service_url.rstrip('/')

app = FastAPI(title="API Gateway")

# Это список адресов, с которых разрешены запросы.
# Для разработки мы разрешаем адрес фронтенда и можно добавить другие.
origins = [
    "http://localhost",
    "http://localhost:3000", # <-- Адрес вашего фронтенда
    "http://localhost:5173",
    # "https://your-production-frontend.com", # В будущем добавите адрес боевого сайта
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Разрешить все методы (GET, POST, и т.д.)
    allow_headers=["*"], # Разрешить все заголовки
)

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
            search_response = await client.get(f"{search_service_base_url}/", params=search_params, timeout=10.0)
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


@app.get("/api/v1/products/popular")
async def get_popular_products(
    page: int = 1,
    size: int = 10
):
    """
    Проксирует запрос к search_service для получения популярных товаров.
    """
    async with httpx.AsyncClient() as client:
        try:
            search_params = {'page': page, 'size': size}
            response = await client.get(f"{search_service_base_url}/products/popular", params=search_params, timeout=10.0)
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Search service is unavailable: {e}")


@app.get("/api/v1/products/{product_id}")
async def get_product_by_id(product_id: int):
    """
    Проксирует запрос к search_service для получения одного товара по ID.
    """
    async with httpx.AsyncClient() as client:
        try:
            # Обращаемся к эндпоинту в search_service, который уже существует
            response = await client.get(f"{search_service_base_url}/products/{product_id}", timeout=10.0)
            
            # Если search_service вернул 404 (не найдено), пробрасываем эту ошибку
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Product not found")
            
            response.raise_for_status() # Проверяем на другие ошибки (500 и т.д.)
            
            return response.json()
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Search service is unavailable: {e}")