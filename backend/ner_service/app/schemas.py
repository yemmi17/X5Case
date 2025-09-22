# ner_service/app/schemas.py
from pydantic import BaseModel, Field
from typing import List

class NERRequest(BaseModel):
    input: str

class NERResponseItem(BaseModel):
    start_index: int
    end_index: int
    entity: str

# Тип для ответа - список таких элементов
NERResponse = List[NERResponseItem]