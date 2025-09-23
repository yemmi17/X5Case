import spacy

from fastapi import FastAPI
from .schemas import TextInputWithPredictions, ParsedOutput
from .logic import format_predictions

# Апишка взаимосвязи с бэком
# Задача: принять запрос, обработать и отправить ответ обратно
app = FastAPI(title="ML service")

@app.post("/format_entities", response_model=ParsedOutput)
def create_formatted_entities(input_data: TextInputWithPredictions):
    """
    Принимает текст и предсказания модели, возвращает сущности, отформатированные двумя способами
    """
    return format_predictions(input_data.text, input_data.predictions)

def main():
    print("Hello from x5case!")
    
    # Проверяем, включен ли GPU
    if spacy.prefer_gpu():
        print("GPU is enabled!")
    else:
        print("GPU is NOT enabled!")

if __name__ == "__main__":
    main()
