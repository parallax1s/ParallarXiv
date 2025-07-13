from fastapi import FastAPI
import socketio

sio = socketio.AsyncServer(async_mode="asgi")
app = FastAPI()


@sio.event
async def connect(sid, environ):
    print(f"Socket connected: {sid}")


app.mount("/ws", socketio.ASGIApp(sio))


@app.get("/health")
async def health():
    return {"status": "ok"}
