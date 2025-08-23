import importlib
from fastapi.testclient import TestClient

from app import main, database


def test_paper_cached(tmp_path, monkeypatch):
    db_path = tmp_path / "papers.db"
    monkeypatch.setenv("PAPER_DB_PATH", str(db_path))
    importlib.reload(database)
    importlib.reload(main)

    client = TestClient(main.app)
    calls = {"n": 0}

    async def fake_fetch(paper_id: str):
        calls["n"] += 1
        return {"paperId": paper_id, "references": []}

    monkeypatch.setattr(main, "fetch_paper_info", fake_fetch)

    resp1 = client.get("/paper/abc123")
    assert resp1.status_code == 200
    assert resp1.json()["paperId"] == "abc123"
    assert calls["n"] == 1

    resp2 = client.get("/paper/abc123")
    assert resp2.status_code == 200
    assert calls["n"] == 1
