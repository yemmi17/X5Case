# Файл, отвечающий за формироване JSON-файла

from typing import List, Dict
from schemas import ResponseEntity

def get_model_prediction_stub(text: str) -> List[Dict]:
    """ЗАГЛУШКА МОДЕЛИ"""
    predictions = []

    if "сыр" in text.lower():
        start = text.lower().find("сыр")
        predictions.append({'start': start, 'end': start + 3, 'entity': 'B-TYPE', 'text': text[start:start+3]})
    if "hochland" in text.lower():
        start = text.lower().find("hochland")
        predictions.append({'start': start, 'end': start + 8, 'entity': 'B-BRAND', 'text': text[start:start+8]})
    if "100г" in text:
        start = text.find("100г")
        predictions.append({'start': start, 'end': start + 4, 'entity': 'B-VOLUME', 'text': '100г'})
    print(f"Заглушка вернула предсказания: {predictions}")
    return predictions

def extract_entities_for_backend(text: str) -> List[ResponseEntity]:
    """
    Главная функция: вызывает модель и форматирует результат в виде простого списка
    """
    predictions = get_model_prediction_stub(text)
    response_list = []

    for ent in predictions:
        response_list.append(
            ResponseEntity(
                start_index=ent['start'],
                end_index=ent['end'],
                entity=ent['entity']
            )
        )
    return response_list