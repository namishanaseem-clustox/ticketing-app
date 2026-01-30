from app.models.game import Game
from app.core.config import settings
from typing import Dict, Any, Optional
import uuid

games: Dict[str, Game] = {}

class GameService:
    @staticmethod
    def create_game(name: str) -> str:
        game_id = str(uuid.uuid4())[:settings.game_id_length]
        creator_id = str(uuid.uuid4())
        game = Game(game_id,name, creator_id)
        games[game_id] = game
        return game
    
    @staticmethod
    def get_game(game_id: str) -> Optional[Game]:
        
        #gets the game instance from dict with that id
        return games.get(game_id)
    
    @staticmethod
    def submit_vote(game_id: str, player_name: str, value: str) -> bool:
        game = GameService.get_game(game_id)
        if not game or game.is_revealed():
            return False
        # Validate vote
        if value not in settings.vote_options:
            return False
        game.votes[player_name] = value
        return True
    
    @staticmethod
    def reveal_game(game_id: str) -> Optional[Dict[str, Any]]:
        game = GameService.get_game(game_id)
        if not game:
            return None
        
        game.status = "revealed"
        
        # Calculate stats (ignore "?")
        numeric_votes = [int(v) for v in game.votes.values() if v != "?"]
        if numeric_votes:
            stats = {
                "votes": game.votes,
                "min": min(numeric_votes),
                "max": max(numeric_votes),
                "avg": round(sum(numeric_votes) / len(numeric_votes), 1)
            }
        else:
            stats = {"votes": game.votes, "min": None, "max": None, "avg": None}
        
        return stats
