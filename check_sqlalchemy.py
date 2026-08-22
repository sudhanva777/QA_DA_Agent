from src.db.postgresql import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        value = result.scalar()

        print(f"SQLAlchemy query result: {value}")
        print("SQLALCHEMY CONNECTION: OK")

except Exception as e:
    print("SQLALCHEMY CONNECTION: FAILED")
    print(type(e).__name__)
    print(e)