import logging
import os
import ssl
from typing import Optional

import certifi
from pymongo import MongoClient  # pyright: ignore[reportMissingImports]

log = logging.getLogger(__name__)


def _friendly_mongo_message(raw: str) -> str:
    low = raw.lower()
    if "bad auth" in low or "authentication failed" in low:
        return (
            "MongoDB Atlas ne login reject kiya — username ya password galat hai. "
            "Atlas → Database Access → apne user (jaise my_radha) par Edit → password reset karo, "
            "phir .env mein MONGO_URI update karo. Password mein @ ho to URI mein %40 likho."
        )
    if "timed out" in low or "timeout" in low:
        return (
            "MongoDB tak connect nahi ho paya (timeout). Atlas → Network Access → IP allowlist check karo."
        )
    return f"MongoDB error: {raw}"


_client: Optional[MongoClient] = None
_db = None
_mongo_error: Optional[str] = None


class DatabaseUnavailable(Exception):
    """MongoDB missing, unreachable, or not initialized."""


def mongo_status() -> dict:
    """For /api/health — never raises."""
    if _db is not None:
        return {"ok": True, "detail": None}
    return {"ok": False, "detail": _mongo_error or "Database not initialized"}


def init_db() -> None:
    """Connect to MongoDB if possible. Never raises — Flask stays up for /api/health."""
    global _client, _db, _mongo_error
    _client = None
    _db = None
    _mongo_error = None

    uri = (os.getenv("MONGO_URI") or "").strip()
    if not uri:
        _mongo_error = "MONGO_URI is not set. Add it to .env at the project root (folder that contains BACKEND)."
        log.warning("%s", _mongo_error)
        return
    
    # Debug: Print URI length and masked version
    masked = uri[:15] + "..." + uri[-15:] if len(uri) > 30 else "too short"
    log.info("Connecting to URI: %s (length: %d)", masked, len(uri))

    db_name = (os.getenv("MONGO_DB_NAME") or "portfolio").strip() or "portfolio"
    try:
        client = MongoClient(
            uri, 
            serverSelectionTimeoutMS=20000, 
            connectTimeoutMS=20000,
            tls=True,
            tlsInsecure=True
        )
        log.info("Pinging MongoDB...")
        client.admin.command("ping")
        log.info("MongoDB ping successful.")
        db = client[db_name]
        db.contacts.create_index([("created_at", -1)])
        db.projects.create_index([("created_at", -1)])
        db.skills.create_index([("order", 1), ("created_at", -1)])
        db.experience.create_index([("created_at", -1)])
        db.blog.create_index([("date", -1), ("created_at", -1)])
        _client = client
        _db = db
        log.info("MongoDB connected: db=%s", db_name)
    except Exception as e:
        raw = str(e)
        _mongo_error = _friendly_mongo_message(raw)
        log.warning("MongoDB init failed: %s", raw)
        _client = None
        _db = None


def get_db():
    if _db is None:
        raise DatabaseUnavailable(_mongo_error or "Database is not available. Check MONGO_URI and network.")
    return _db
