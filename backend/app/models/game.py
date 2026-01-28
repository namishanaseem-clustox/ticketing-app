from typing import Dict
import uuid

class Game:
    def __init__(self, id: str):
        self.id = id
        self.status = "voting"  # "voting" | "revealed"
        self.votes: Dict[str, str] = {}  # {player_id: vote_value}
    
    def vote_count(self) -> int:
        return len(self.votes)
    
    def is_revealed(self) -> bool:
        return self.status == "revealed"
