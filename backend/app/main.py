import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import games

from app.database.db import engine, Base
from app.database.models.game import GameDB
from app.database.models.vote import VoteDB

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Agile Ticket Sizing Platform", 
    description="Planning Poker for Agile Teams",
    version="1.0.0"
)

origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(games.router)

@app.get("/")
def root():
    return {
        "message": "Agile Poker Backend", 
        "docs": "/docs",
        "create_game": "POST /games"
    }
