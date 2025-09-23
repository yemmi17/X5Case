# Файл, отвечающий за формироване JSON-файла

from typing import List, Dict
from schemas import ResponseEntity
import spacy

nlp = spacy.load("model")

def get_model_prediction(text: str) -> List[Dict]:
    doc = nlp(text)
    predictions = []
    for ent in doc.ents:
        predictions.append({'start': ent.start_char, 'end': ent.end_char, 'entity': ent.label_})
    return predictions

def extract_entities_for_backend(text: str) -> List[ResponseEntity]:
    """
    Главная функция: вызывает модель и форматирует результат в виде простого списка
    """
    predictions = get_model_prediction(text)
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