import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")      
AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

if DATABASE_URL and DATABASE_URL.startswith("libsql://"):
    host = DATABASE_URL.removeprefix("libsql://")

    engine = create_engine(
        f"sqlite+libsql://{host}?secure=true",
        connect_args={"auth_token": AUTH_TOKEN},
        echo=True,
    )
else:
    engine = create_engine(
        "sqlite:///./app/database/planning_poker.db",
        connect_args={"check_same_thread": False},
        echo=True,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
