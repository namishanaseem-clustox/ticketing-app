from pydantic import BaseModel
from typing import Dict, Optional

class VoteRequest(BaseModel):
    player_name: str
    value: str

class CreateGameRequest(BaseModel):
    name: str

class GameStats(BaseModel):
    min: Optional[float]
    max: Optional[float]
    avg: Optional[float]

class GameResponse(BaseModel):
    id: str
    name: str
    creator_id: str
    status: str
    vote_count: int
    votes: Optional[Dict[str, str]] = None  
    stats: Optional[GameStats] = None

    '''allows SQLAlchemy to read Pydantic models'''
    class Config:
        from_attributes = True