import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise RuntimeError("DATABASE_URL not found")

conn = psycopg2.connect(database_url)

print("POSTGRES CONNECTION: OK")

cur = conn.cursor()

cur.execute("""
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
""")

tables = cur.fetchall()

print("\nPUBLIC TABLES:")
for table in tables:
    print(f" - {table[0]}")

cur.close()
conn.close()