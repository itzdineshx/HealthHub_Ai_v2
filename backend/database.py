"""
Database configuration and connection setup
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment variable
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set. Please configure it in your .env file.")

# Create database engine
try:
    if SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
        # Test connection with a short timeout (3 seconds) to detect offline states quickly
        test_engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"connect_timeout": 3})
        with test_engine.connect() as conn:
            pass
        engine = test_engine
        print("[DATABASE] Connected successfully to remote PostgreSQL.")
    else:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
except Exception as e:
    print(f"[DATABASE] Remote connection failed ({e}). Falling back to local SQLite database.")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./placeholder.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for DB models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
