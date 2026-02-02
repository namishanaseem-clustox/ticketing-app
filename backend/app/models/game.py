from typing import Dict

class Game:
    def __init__(self, id: str, name: str, creator_id: str):
        self.id = id
        self.name = name
        self.creator_id = creator_id
        self.status = "voting"  # "voting" | "revealed"
        self.votes: Dict[str, str] = {}  # {player_id: vote_value}
    
    def vote_count(self) -> int:
        return len(self.votes)
    
    def is_revealed(self) -> bool:
        return self.status == "revealed"
