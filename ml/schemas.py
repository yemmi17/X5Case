# Файл, который описывает структуру и проверяет входящих и исходящих данных
# Автоматически проверяет (валидирует) все входящие и исходящие данные

from pydantic import BaseModel
from typing import List, Dict, Any

# Вариации входящих данных
class ModelPredictionInput(BaseModel):
class TextInput(BaseModel):
    """Модель для входящего текстового запроса от api_gateway."""
    text: str


# Вариации исходящих данных
class EntityIndex(BaseModel):
    """Модель для сущности с индексами (формат хакатона)"""
    start_index: int
    end_index: int
    entity: str

class EntityString(BaseModel):
    """Модель для сущности со строкой (формат со строкой и типом)"""
    entity_string: str
    entity_type: str

class ParsedOutput(BaseModel):
    """Модель для итогового ответа, который мы отправляем обратно."""
    input: str
    entities_by_index: List[EntityIndex]
    entities_by_string: List[EntityString]