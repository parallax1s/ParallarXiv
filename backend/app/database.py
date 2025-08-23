import json
import os
import sqlite3
from typing import Any, Dict, Optional

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
