from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Mock NER Service")

# Модель для входящего запроса (чтобы Swagger знал, что принимать)
class TextIn(BaseModel):
    text: str

@app.post("/extract_entities")
def extract_entities_mock(text_in: TextIn):
    """
    Это эндпоинт-заглушка.
    Он всегда возвращает один и тот же результат,
    имитируя работу реального ML-сервиса.
    """
    print(f"Mock NER Service получил текст: {text_in.text}")
    return {
        "category": "молочные продукты",
        "brand": "домик в деревне",
        "percentage": "3.2%",
        "volume": "1л"
    }