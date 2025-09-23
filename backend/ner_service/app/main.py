from fastapi import FastAPI, Body, Depends
from fastapi.concurrency import run_in_threadpool # <--- ВАЖНО 
from . import schemas
from .mock_model import extract_entities_mock

app = FastAPI()

@app.post("/api/predict", response_model=schemas.NERResponse)
async def predict(payload: schemas.NERRequest = Body(...)):
    # Пока просто возвращаем пустой список, если пустой input
    if not payload.input:
        return []

    # TODO: Здесь будет логика вызова модели
    
    # run_in_threadpool передает выполнение тяжелой задачи в отдельный поток.
    # Основной поток (event loop), который принимает и отдает запросы, остается свободным
    result = await run_in_threadpool(extract_entities_mock, payload.input)

    return result