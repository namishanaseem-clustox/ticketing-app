from sqlalchemy import Column, String, ForeignKey
from app.database.db import Base
from sqlalchemy.orm import relationship

class VoteDB(Base):
    __tablename__ = "votes"

    id = Column(String, primary_key=True)
    game_id = Column(String, ForeignKey("games.id"))
    player_name = Column(String, nullable=False)
    value = Column(String, nullable=False)
    game = relationship("GameDB", back_populates="votes")