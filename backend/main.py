from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router
from database import init_db
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database
    await init_db()
    yield

app = FastAPI(title="Chunav Saathi API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(chat_router, prefix="/api")

from collections import defaultdict
from time import time
from fastapi import Request
from fastapi.responses import JSONResponse

request_counts = defaultdict(list)

def is_rate_limited(client_ip: str, limit: int = 20, window: int = 60) -> bool:
    now = time()
    request_counts[client_ip] = [t for t in request_counts[client_ip] if now - t < window]
    if len(request_counts[client_ip]) >= limit:
        return True
    request_counts[client_ip].append(now)
    return False

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    if is_rate_limited(client_ip):
        return JSONResponse(
            status_code=429,
            content={"error": "Too many requests. Please wait a moment."}
        )
    return await call_next(request)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

@app.get("/")
async def root():
    return {"message": "Chunav Saathi API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
