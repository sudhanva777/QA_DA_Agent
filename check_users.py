import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise RuntimeError("DATABASE_URL not found")

conn = psycopg2.connect(database_url)
cur = conn.cursor()

cur.execute("""
    SELECT
        column_name,
        data_type,
        is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
    ORDER BY ordinal_position;
""")

print("USERS TABLE SCHEMA:")
print("-" * 50)

for column_name, data_type, nullable in cur.fetchall():
    print(
        f"{column_name:20} "
        f"{data_type:20} "
        f"nullable={nullable}"
    )

cur.close()
conn.close()