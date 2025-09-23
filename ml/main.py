import spacy

from fastapi import FastAPI
from .schemas import TextInputWithPredictions, ParsedOutput
from .logic import format_predictions
import uvicorn

# Апишка взаимосвязи с бэком
# Задача: принять запрос, обработать и отправить ответ обратно
app = FastAPI(title="ML Entity Extraction Service")

@app.post("/extract_entities", response_model=ParsedOutput)
def extract_entities_endpoint(input_data: TextInput):
    """
    Принимает текст от api_gateway, извлекает сущности с помощью
    модели (сейчас - заглушки) и возвращает их в двух форматах.
    """
    return extract_and_format_entities(input_data.text)

# Этот блок позволяет запускать сервер напрямую из этого файла для теста
if __name__ == "__main__":
    print("Запуск ML-сервиса для тестирования на http://127.0.0.1:8001")
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
