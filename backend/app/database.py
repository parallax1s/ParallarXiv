import json
import os
from typing import Any, Dict, Optional

POSTGRES_URL = os.environ.get("POSTGRES_URL")

if POSTGRES_URL:
    import psycopg
    from psycopg.rows import dict_row
    from psycopg.types.json import Json

    def init_db() -> None:
        """Initialise the Postgres database and ensure the papers table exists."""
        with psycopg.connect(POSTGRES_URL, sslmode="require") as conn:
            conn.execute(
                "CREATE TABLE IF NOT EXISTS papers (id TEXT PRIMARY KEY, data JSONB NOT NULL)"
            )
            conn.commit()

    def get_paper(paper_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a cached paper by its ID."""
        with psycopg.connect(
            POSTGRES_URL, sslmode="require", row_factory=dict_row
        ) as conn:
            cur = conn.execute("SELECT data FROM papers WHERE id=%s", (paper_id,))
            row = cur.fetchone()
        if row:
            return row["data"]
        return None

    def save_paper(paper_id: str, data: Dict[str, Any]) -> None:
        """Store paper information in the cache."""
        with psycopg.connect(POSTGRES_URL, sslmode="require") as conn:
            conn.execute(
                "INSERT INTO papers (id, data) VALUES (%s, %s) "
                "ON CONFLICT (id) DO UPDATE SET data=EXCLUDED.data",
                (paper_id, Json(data)),
            )
            conn.commit()

else:
    import sqlite3

    DB_PATH = os.environ.get("PAPER_DB_PATH", "papers.db")

    def init_db() -> None:
        """Initialise the SQLite database and ensure the papers table exists."""
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "CREATE TABLE IF NOT EXISTS papers (id TEXT PRIMARY KEY, data TEXT NOT NULL)"
            )

    def get_paper(paper_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a cached paper by its ID."""
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.execute("SELECT data FROM papers WHERE id=?", (paper_id,))
            row = cur.fetchone()
        if row:
            return json.loads(row[0])
        return None

    def save_paper(paper_id: str, data: Dict[str, Any]) -> None:
        """Store paper information in the cache."""
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO papers (id, data) VALUES (?, ?)",
                (paper_id, json.dumps(data)),
            )
            conn.commit()
