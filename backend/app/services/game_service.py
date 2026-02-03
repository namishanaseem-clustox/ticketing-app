from sqlalchemy.orm import Session
from app.database.models.game import GameDB
from app.database.models.vote import VoteDB
from app.core.config import settings
from typing import Dict, Any, Optional, List
import uuid

class GameService:
    @staticmethod
    def create_game(db: Session, name: str):
        game_id = str(uuid.uuid4())[:settings.game_id_length]
        new_creator_id = str(uuid.uuid4())

        db_game = GameDB(
            id=game_id,
            name=name,
            creator_id=new_creator_id,
            status="voting"
        )

        db.add(db_game)
        db.commit()

        db.refresh(db_game)

        return db_game
    
    @staticmethod
    def _calculate_stats(votes: List[VoteDB]) -> dict:
        numeric_votes = [int(v.value) for v in votes if v.value.isdigit()]

        if not numeric_votes:
            return {"min": None, "max": None, "avg": None}
        
        return {
            "min": min(numeric_votes),
            "max": max(numeric_votes),
            "avg": round(sum(numeric_votes)/len(numeric_votes),1)
        }
    
    @staticmethod
    def get_game(db: Session, game_id: str) -> Optional[GameDB]:
        game = db.query(GameDB).filter(GameDB.id==game_id).first()
        if not game:
            None
        
        return game
    
    @staticmethod
    def submit_vote(db: Session, game_id: str, player_name: str, value: str) -> bool:
        game = GameService.get_game(db,game_id)
        if not game or game.status == "revealed":
            return False
        
        '''db query to check if vote exists already'''
        existing_vote = db.query(VoteDB).filter(
            VoteDB.game_id == game_id,
            VoteDB.player_name == player_name
        ).first()

        if existing_vote:
            existing_vote.value = value
        else:
            new_vote = VoteDB(
                id=str(uuid.uuid4()),
                game_id=game_id,
                player_name=player_name,
                value=value
            )
            db.add(new_vote)
        
        db.commit()
        return True
    
    @staticmethod
    def reveal_game(db: Session, game_id: str) -> Optional[Dict[str, Any]]:
        game = GameService.get_game(db, game_id)
        if not game:
            return None
        
        game.status = "revealed"
        db.commit()
        db.refresh(game)

        stats = GameService._calculate_stats(game.votes)

        stats["votes"] = {v.player_name: v.value for v in game.votes}
        
        return stats
