import httpx
from fastapi import FastAPI, HTTPException
from pydantic_settings import BaseSettings

# Класс для загрузки переменных из .env файла
class Settings(BaseSettings):
    ner_service_url: str
    search_service_url: str

settings = Settings()
app = FastAPI(title="API Gateway")

# --- Основной эндпоинт поиска ---
@app.get("/api/v1/search")
async def search(q: str):
    """
    Основной эндпоинт для сквозного поиска.
    1. Принимает текстовый запрос `q`.
    2. Отправляет его в NER-сервис для извлечения сущностей.
    3. Использует извлеченные сущности для фильтрации в Search-сервисе.
    4. Возвращает найденные товары.
    """
    try:
        # --- Шаг 1: Идем в NER-сервис ---
        async with httpx.AsyncClient() as client:
            ner_response = await client.post(
                f"{settings.ner_service_url}/extract_entities", 
                json={"text": q},
                timeout=5.0  # Устанавливаем таймаут, чтобы не ждать вечно
            )
            # Проверяем, что NER-сервис ответил успешно (кодом 2xx)
            ner_response.raise_for_status()
            entities = ner_response.json()

        # --- Шаг 2: Формируем параметры для сервиса поиска ---
        # Убираем пустые значения, чтобы не передавать их в запрос
        search_params = {k: v for k, v in entities.items() if v}
        
        # --- Шаг 3: Идем в Search-сервис с извлеченными параметрами ---
        async with httpx.AsyncClient() as client:
            search_response = await client.get(
                f"{settings.search_service_url}/api/v1/products/",
                params=search_params,
                timeout=5.0
            )
            search_response.raise_for_status()
            products = search_response.json()

        return products

    # --- Шаг 4: Обработка возможных ошибок ---
    except httpx.RequestError as exc:
        # Ошибка сети (например, сервис недоступен)
        raise HTTPException(
            status_code=503, 
            detail=f"Ошибка при обращении к внутреннему сервису: {exc.request.url}"
        )
    except httpx.HTTPStatusError as exc:
        # Сервис ответил ошибкой (например, 404 или 500)
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"Внутренний сервис ответил ошибкой: {exc.response.text}"
        )