# Настройка подключения к БД

from sqlmodel import create_engine
from pydantic_settings import BaseSettings

class DBSettings(BaseSettings):
    database_url: str

settings = DBSettings()

# Создаем "движок" для подключения к БД.
# connect_args нужен для SQLite, для PostgreSQL его можно убрать, но он не мешает.
engine = create_engine(settings.database_url, echo=True, connect_args={})