# Файл, отвечающий за формироване JSON-файла

from typing import List
from .schemas import ParsedOutput, EntityIndex, EntityString, ModelPredictionInput

# Функция, имитирующая поведение модели
def get_model_prediction_stub(text: str) -> List[Dict]:
    """
    ЗАГЛУШКА МОДЕЛИ
    """
    print(f"Заглушка получила текст: '{text}'")
    predictions = []
    
    # Имитация поиска сущностей по ключевым словам
    if "сыр" in text.lower():
        predictions.append({'start': 0, 'end': 3, 'entity': 'B-TYPE', 'text': 'сыр'})
    if "hochland" in text.lower():
        predictions.append({'start': 4, 'end': 12, 'entity': 'B-BRAND', 'text': 'Hochland'})
    if "100г" in text:
        predictions.append({'start': 13, 'end': 17, 'entity': 'B-VOLUME', 'text': '100г'})
    
    print(f"Заглушка вернула предсказания: {predictions}")
    return predictions

def format_predictions(text: str, predictions: List[ModelPredictionInput]) -> ParsedOutput:
    """
    Принимает текст и готовые предсказания модели, возвращает JSON в двух требуемых форматах
    """
    predictions = get_model_prediction_stub(text)

    entities_by_index = []
    entities_by_string = []

    for ent in predictions:
        # Формат кейса
        entities_by_index.append(
            EntityIndex(
                start_index=ent.start,
                end_index=ent.end,
                entity=ent.entity
            )
        )
        # Формат со строкой и сущностью
        entities_by_string.append(
            EntityString(
                entity_string=ent.text,
                entity_type=ent.entity
            )
        )
        
    # Упаковка в ParsedOutput для пересылки на бэк
    return ParsedOutput(
        input=text,
        entities_by_index=entities_by_index,
        entities_by_string=entities_by_string
    )