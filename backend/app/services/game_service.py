from sqlalchemy.orm import Session
from app.database.models.game import GameDB
from app.database.models.vote import VoteDB
from app.core.config import settings
from typing import Dict, Any, Optional
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
    def get_game(db: Session, game_id: str) -> Optional[GameDB]:
        
        return db.query(GameDB).filter(GameDB.id==game_id).first()
    
    @staticmethod
    def submit_vote(db: Session, game_id: str, player_name: str, value: str) -> bool:
        game = GameService.get_game(db,game_id)
        if not game or game.status == "revealed":
            return False
        
        #db query to check if vote exists already
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
        
        votes_dict = {}
        numeric_votes = []

        for vote in game.votes:
            votes_dict[vote.player_name] = vote.value

            if vote.value.isdigit():
                numeric_votes.append(int(vote.value))

        if numeric_votes:
            stats = {
                "votes": votes_dict,
                "min": min(numeric_votes),
                "max": max(numeric_votes),
                "avg": round(sum(numeric_votes) / len(numeric_votes), 1)
            }
        else:
            stats = {
                "votes": votes_dict,
                "min": None,
                "max": None, 
                "avg": None
            }
        
        return stats
