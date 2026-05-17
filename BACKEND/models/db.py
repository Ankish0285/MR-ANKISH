import logging
import os
from typing import Optional

import certifi
from pymongo import MongoClient

log = logging.getLogger(__name__)


def _friendly_mongo_message(raw: str) -> str:
    """
    Converts raw MongoDB error strings into user-friendly Hindi/English messages.
    """
    low = raw.lower()
    if "bad auth" in low or "authentication failed" in low:
        return (
            "MongoDB Atlas ne login reject kiya - username ya password galat hai. "
            "Atlas -> Database Access -> apne user (jaise my_radha) par Edit -> password reset karo, "
            "phir .env mein MONGO_URI update karo. Password mein @ ho to URI mein %40 likho."
        )
    if "timed out" in low or "timeout" in low:
        return (
            "MongoDB tak connect nahi ho paya (timeout). Atlas -> Network Access -> IP allowlist check karo."
        )
    return f"MongoDB error: {raw}"


_client: Optional[MongoClient] = None
_db = None
_mongo_error: Optional[str] = None


class DatabaseUnavailable(Exception):
    """Exception raised when MongoDB is missing, unreachable, or not initialized."""


def mongo_status() -> dict:
    """
    Returns the current status of the MongoDB connection for health check APIs.
    """
    if _db is not None:
        return {"ok": True, "detail": None}
    return {"ok": False, "detail": _mongo_error or "Database not initialized"}


def init_db() -> None:
    """
    Initializes the MongoDB connection using the URI from environment variables.
    This function is production-ready and compatible with Render deployment.
    """
    global _client, _db, _mongo_error
    _client = None
    _db = None
    _mongo_error = None

    # Load URI and DB Name from environment variables
    uri = (os.getenv("MONGO_URI") or "").strip()
    db_name = (os.getenv("MONGO_DB_NAME") or "portfolio").strip()

    if not uri:
        _mongo_error = "MONGO_URI is not set in environment variables."
        log.warning(_mongo_error)
        return

    try:
        # Production-ready MongoClient initialization
        # Uses certifi for TLS/SSL certificates and sets appropriate timeouts
        client = MongoClient(
            uri,
            serverSelectionTimeoutMS=10000,  # 10 seconds to find server
            connectTimeoutMS=10000,         # 10 seconds to connect
            socketTimeoutMS=10000,
            tls=True,
            tlsCAFile=certifi.where(),
            retryWrites=True,
        )

        # Ping the database to verify the connection
        log.info("Attempting to connect to MongoDB...")
        client.admin.command("ping")
        log.info("MongoDB connection verified with ping.")

        db = client[db_name]

        # Create necessary indexes for performance
        db.contacts.create_index([("created_at", -1)])
        db.projects.create_index([("created_at", -1)])
        db.skills.create_index([("order", 1), ("created_at", -1)])
        db.experience.create_index([("created_at", -1)])
        db.blog.create_index([("date", -1), ("created_at", -1)])

        _client = client
        _db = db
        log.info("Successfully connected to MongoDB database: %s", db_name)

    except Exception as e:
        raw_error = str(e)
        _mongo_error = _friendly_mongo_message(raw_error)
        log.error("MongoDB initialization failed: %s", raw_error)
        _client = None
        _db = None


def get_db():
    """
    Returns the database instance. Raises DatabaseUnavailable if not connected.
    """
    if _db is None:
        raise DatabaseUnavailable(
            _mongo_error or "Database is not available. Please check MONGO_URI and network settings."
        )
    return _db
