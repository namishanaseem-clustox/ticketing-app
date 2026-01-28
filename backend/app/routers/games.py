from fastapi import APIRouter, HTTPException
from app.schemas.game import VoteRequest, GameResponse
from app.services.game_service import GameService
from typing import Any

router = APIRouter(prefix="/games", tags=["games"])

@router.post("/", response_model=dict)
def create_game():
    """Create new planning poker game"""
    game_id = GameService.create_game()
    return {"id": game_id, "url": f"/game/{game_id}"}

@router.get("/{game_id}", response_model=GameResponse)
def get_game(game_id: str):
    """Get game state (votes hidden until revealed)"""
    game = GameService.get_game(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return GameResponse(
        id=game.id,
        status=game.status,
        vote_count=game.vote_count(),
        votes=game.votes if game.is_revealed() else None
    )

@router.post("/{game_id}/vote")
def vote(game_id: str, vote: VoteRequest):
    """Submit anonymous vote"""
    success = GameService.submit_vote(game_id, vote.player_id, vote.value)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid vote or game revealed")
    return {"status": "success"}

@router.post("/{game_id}/reveal")
def reveal(game_id: str):
    """Reveal all votes + calculate stats"""
    stats = GameService.reveal_game(game_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Game not found")
    return stats
