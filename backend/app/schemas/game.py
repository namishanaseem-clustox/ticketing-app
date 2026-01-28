from pydantic import BaseModel
from typing import Dict, Optional

class VoteRequest(BaseModel):
    player_id: str
    value: str

class GameResponse(BaseModel):
    id: str
    status: str
    vote_count: int
    votes: Optional[Dict[str, str]] = None  # Hidden until revealed
