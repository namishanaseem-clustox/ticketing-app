from sqlalchemy import Column, String
from app.database.db import Base
from sqlalchemy.orm import relationship

class GameDB(Base):
    __tablename__ = "games"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    creator_id = Column(String, nullable=False)
    status = Column(String, default="voting")
    votes = relationship("VoteDB", back_populates="game")