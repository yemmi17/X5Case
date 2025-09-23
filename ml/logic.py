# Файл, отвечающий за формироване JSON-файла

from typing import List
from .schemas import ParsedOutput, EntityIndex, EntityString, ModelPredictionInput

def format_predictions(text: str, predictions: List[ModelPredictionInput]) -> ParsedOutput:
    """
    Принимает текст и готовые предсказания модели, возвращает JSON в двух требуемых форматах
    """
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