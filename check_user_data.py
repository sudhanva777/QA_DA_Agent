import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cur = conn.cursor()

cur.execute("""
    SELECT
        id,
        name,
        email,
        is_active,
        created_at,
        updated_at
    FROM users
    ORDER BY created_at DESC;
""")

rows = cur.fetchall()

print("USERS IN NEON:")
print("-" * 80)

for row in rows:
    print(row)

print("-" * 80)
print(f"TOTAL USERS: {len(rows)}")

cur.close()
conn.close()