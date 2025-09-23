# Файл, отвечающий за формироване JSON-файла

from typing import List, Dict
from .schemas import ParsedOutput, EntityIndex, EntityString

def get_model_prediction_stub(text: str) -> List[Dict]:
    """ЗАГЛУШКА МОДЕЛИ"""
    print(f"Заглушка получила текст: '{text}'")
    predictions = []
    if "сыр" in text.lower():
        start_index = text.lower().find("сыр")
        predictions.append({'start': start_index, 'end': start_index + 3, 'entity': 'B-TYPE', 'text': text[start_index:start_index+3]})
    if "hochland" in text.lower():
        start_index = text.lower().find("hochland")
        predictions.append({'start': start_index, 'end': start_index + 8, 'entity': 'B-BRAND', 'text': text[start_index:start_index+8]})
    if "100г" in text:
        start_index = text.find("100г")
        predictions.append({'start': start_index, 'end': start_index + 4, 'entity': 'B-VOLUME', 'text': '100г'})
    print(f"Заглушка вернула предсказания: {predictions}")
    return predictions

def extract_and_format_entities(text: str) -> ParsedOutput:
    """
    Принимает текст, вызывает заглушку модели и форматирует результат.
    """
    predictions = get_model_prediction_stub(text)
    entities_by_index = []
    entities_by_string = []

    for ent in predictions:
        entities_by_index.append(
            EntityIndex(start_index=ent['start'], end_index=ent['end'], entity=ent['entity'])
        )
        entities_by_string.append(
            EntityString(entity_string=ent['text'], entity_type=ent['entity'])
        )
    return ParsedOutput(
        input=text,
        entities_by_index=entities_by_index,
        entities_by_string=entities_by_string
    )