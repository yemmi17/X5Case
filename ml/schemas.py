# Файл, который описывает структуру хранения данных
# Автоматически проверяет (валидирует) все входящие и исходящие данные

from pydantic import BaseModel
from typing import List

class TextInput(BaseModel):
    """Модель для входящего текстового запроса"""
    text: str

class EntityIndex(BaseModel):
    """Модель для сущности с индексами (формат хакатона)"""
    start_index: int
    end_index: int
    entity: str

class EntityString(BaseModel):
    """Модель для сущности со строкой (формат с со строкой и типом сущности)"""
    entity_string: str
    entity_type: str

class ParsedOutput(BaseModel):
    """Модель для итогового ответа API"""
    input: str
    entities_by_index: List[EntityIndex]
    entities_by_string: List[EntityString]