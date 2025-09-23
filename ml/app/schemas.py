# Файл, который описывает структуру и проверяет входящих и исходящих данных
# Автоматически проверяет (валидирует) все входящие и исходящие данные

from pydantic import BaseModel
from typing import List

# Входящие данные от api_gateway
class TextInput(BaseModel):
    text: str

# --- Исходящие данные ---
class EntityIndex(BaseModel):
    start_index: int
    end_index: int
    entity: str

class EntityString(BaseModel):
    entity_string: str
    entity_type: str

class ParsedOutput(BaseModel):
    input: str
    entities_by_index: List[EntityIndex]
    entities_by_string: List[EntityString]