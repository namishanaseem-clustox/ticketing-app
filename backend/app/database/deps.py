from app.database.db import SessionLocal

def get_db():

    db = SessionLocal()
    try:
        #sends value but keeps function state alive
        yield db
    finally:
        db.close()