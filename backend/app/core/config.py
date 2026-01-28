from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    vote_options: List[str] = ["1", "2", "3", "5", "8", "13", "?"]
    game_id_length: int = 8

settings = Settings()
