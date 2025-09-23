from fastapi import FastAPI
from schemas import TextInput, Response
from logic import extract_entities_for_backend
import uvicorn

app = FastAPI(title="ML Entity Extraction Service")

@app.post("/extract_entities", response_model=Response)
def extract_entities_endpoint(input_data: TextInput):
    """Принимает текст и возвращает массив сущностей"""
    return extract_entities_for_backend(input_data.text)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
