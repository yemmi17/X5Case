from fastapi import FastAPI
from .schemas import TextInput, ParsedOutput
from .logic import extract_and_format_entities
import uvicorn

app = FastAPI(title="ML Entity Extraction Service")

@app.post("/extract_entities", response_model=ParsedOutput)
def extract_entities_endpoint(input_data: TextInput):
    """
    Принимает текст от api_gateway, извлекает сущности и возвращает их.
    """
    return extract_and_format_entities(input_data.text)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
