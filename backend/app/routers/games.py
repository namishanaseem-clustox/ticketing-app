from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.deps import get_db
from app.schemas.game import VoteRequest, GameResponse, CreateGameRequest
from app.services.game_service import GameService
from app.database.models.vote import VoteDB
from app.core.config import settings
from typing import Any


router = APIRouter(prefix="/games", tags=["games"])

@router.post("/", response_model=dict)
def create_game(request: CreateGameRequest, db:Session = Depends(get_db)):
    
    """Create new planning poker game"""
    game = GameService.create_game(db=db,name=request.name)
    return {"id": game.id, "name": game.name, "creator_id": game.creator_id}

@router.get("/options", response_model=dict)
def get_vote_options():
    return {"options": settings.vote_options}

@router.get("/{game_id}", response_model=GameResponse)
def get_game(game_id: str, db: Session = Depends(get_db)):

    """Get game state (votes hidden until revealed)"""
    game = GameService.get_game(db, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    curr_vote_count = len(game.votes)

    stats_data = None
    votes_data = None
    if game.status == "revealed":
        stats_data = GameService._calculate_stats(game.votes)
        
        votes_data = {vote.player_name: vote.value for vote in game.votes}
    

    return GameResponse(
        id=game.id,
        name=game.name,
        creator_id= game.creator_id,
        status=game.status,
        vote_count=curr_vote_count,
        votes=votes_data,
        stats=stats_data
    )

@router.post("/{game_id}/vote")
def vote(game_id: str, vote: VoteRequest, db: Session = Depends(get_db)):
    """Submit anonymous vote"""
    success = GameService.submit_vote(db, game_id, vote.player_name, vote.value)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid vote or game revealed")
    return {"status": "success"}

@router.post("/{game_id}/reveal")
def reveal(game_id: str, db: Session = Depends(get_db)):
    """Reveal all votes + calculate stats"""
    stats = GameService.reveal_game(db, game_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Game not found")
    return stats

@router.post("/{game_id}/reset")
def reset_game(game_id: str, db: Session = Depends(get_db)):
    success = GameService.reset_game(db, game_id)

    if not success:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"status": "success"}