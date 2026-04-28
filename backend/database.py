import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Database URL for Google Cloud SQL (PostgreSQL)
# Strip whitespace to avoid errors from .env formatting
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# Fallback to local SQLite if DATABASE_URL is missing or fails
SQLITE_URL = "sqlite+aiosqlite:///./chunav_saathi.db"

def get_engine_url():
    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        return DATABASE_URL
    print("⚠️  Warning: Cloud DATABASE_URL not found or invalid. Falling back to local SQLite.")
    return SQLITE_URL

engine = create_async_engine(get_engine_url(), echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        # Import models here to ensure they are registered
        from models import Chat, Message
        await conn.run_sync(Base.metadata.create_all)
