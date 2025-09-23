# Файл, который описывает структуру и проверяет входящих и исходящих данных
# Автоматически проверяет (валидирует) все входящие и исходящие данные

from pydantic import BaseModel
from typing import List

# Входящие данные
class TextInput(BaseModel):
    """Модель для входящего текстового запроса"""
    text: str

# Исходящие данные
class ResponseEntity(BaseModel):
    """Модель ответа в соответствии с ТЗ"""
    start_index: int
    end_index: int
    entity: str

Response = List[ResponseEntity]