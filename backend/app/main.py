from fastapi import FastAPI
import socketio
import httpx

from .database import init_db, get_paper, save_paper

sio = socketio.AsyncServer(async_mode="asgi")
app = FastAPI()
app.mount("/ws", socketio.ASGIApp(sio))

init_db()


@sio.event
async def connect(sid, environ):
    print(f"Socket connected: {sid}")


@app.get("/health")
async def health():
    return {"status": "ok"}


async def fetch_paper_info(paper_id: str) -> dict:
    """Fetch paper details including references from Semantic Scholar."""
    fields = (
        "title,abstract,authors.name,year,referenceCount,citationCount,"
        "references.paperId,references.title"
    )
    url = f"https://api.semanticscholar.org/graph/v1/paper/arXiv:{paper_id}"
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params={"fields": fields})
        resp.raise_for_status()
        return resp.json()


@app.get("/paper/{paper_id}")
async def get_paper_info(paper_id: str):
    """Return information about a paper, caching results in a database."""
    cached = get_paper(paper_id)
    if cached:
        print(f"Paper {paper_id} served from database cache instead of arXiv")
        return cached
    data = await fetch_paper_info(paper_id)
    save_paper(paper_id, data)
    return data
