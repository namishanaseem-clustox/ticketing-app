from pydantic import BaseModel
from typing import Dict, Optional

class VoteRequest(BaseModel):
    player_name: str
    value: str

class CreateGameRequest(BaseModel):
    name: str

class GameResponse(BaseModel):
    id: str
    name: str
    status: str
    vote_count: int
    votes: Optional[Dict[str, str]] = None  # Hidden until revealed
