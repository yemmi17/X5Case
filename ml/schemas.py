# Файл, который описывает структуру и проверяет входящих и исходящих данных
# Автоматически проверяет (валидирует) все входящие и исходящие данные

from pydantic import BaseModel
from typing import List, Dict, Any

# Вариации входящих данных
class ModelPredictionInput(BaseModel):
    """
    Модель предсказание одной сущности (формат, возвращаемый моделью)
    """
    start: int
    end: int
    entity: str
    text: str

class TextInputWithPredictions(BaseModel):
    """
    Модель входящего запроса от бэка (текст и сырые предсказания модели)
    """
    text: str
    predictions: List[ModelPredictionInput]


# Вариации исходящих данных
class EntityIndex(BaseModel):
    """Модель для сущности с индексами (формат кейса)"""
    start_index: int
    end_index: int
    entity: str

class EntityString(BaseModel):
    """Модель для сущности со строкой (формат спешиал фор Серега)"""
    entity_string: str
    entity: str

class ParsedOutput(BaseModel):
    """Модель для итогового ответа API"""
    input: str
    entities_by_index: List[EntityIndex]
    entities_by_string: List[EntityString]