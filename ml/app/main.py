from fastapi import FastAPI
from app.schemas import TextInput, Response
from app.logic import extract_entities_for_backend
import uvicorn

app = FastAPI(title="ML Entity Extraction Service")

@app.post("/extract_entities", response_model=Response)
def extract_entities_endpoint(input_data: TextInput):
    """Принимает текст и возвращает массив сущностей"""
    return extract_entities_for_backend(input_data.text)
