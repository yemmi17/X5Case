from fastapi import FastAPI, Body
from fastapi.concurrency import run_in_threadpool
from app.schemas import TextInput, Response
from app.logic import extract_entities_for_backend
import uvicorn

app = FastAPI(title="ML Entity Extraction Service")

# Превращаем эндпоинт в асинхронный (async def)
@app.post("/api/predict", response_model=Response)
async def extract_entities_endpoint(input_data: TextInput = Body(...)):
    """Принимает текст и возвращает массив сущностей"""

    if not input_data.text:
        return Response(entities=[])

    # Вызываем тяжелую функцию в отдельном потоке
    result = await run_in_threadpool(extract_entities_for_backend, input_data.text)
    return result