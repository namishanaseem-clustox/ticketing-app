from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import games

app = FastAPI(
    title="Agile Ticket Sizing Platform", 
    description="Planning Poker for Agile Teams",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
