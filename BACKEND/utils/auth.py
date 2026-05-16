import os
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import current_app, has_app_context, jsonify, request

ADMIN_ROLE = "admin"
JWT_ALG = "HS256"
JWT_DAYS = 7


def _secret_key() -> str:
    if has_app_context():
        sk = current_app.config.get("SECRET_KEY")
        if sk is not None and str(sk).strip():
            return str(sk).strip()
    return (os.getenv("SECRET_KEY") or "").strip()


def create_admin_jwt() -> str:
    sk = _secret_key()
    if not sk:
        raise RuntimeError("SECRET_KEY is missing. Add SECRET_KEY to your .env file.")
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "admin",
        "role": ADMIN_ROLE,
        "iat": now,
        "exp": now + timedelta(days=JWT_DAYS),
    }
    token = jwt.encode(payload, sk, algorithm=JWT_ALG)
    return token if isinstance(token, str) else token.decode("utf-8")


def verify_admin_jwt(token: str) -> bool:
    if not token or not token.strip():
        return False
    sk = _secret_key()
    if not sk:
        return False
    try:
        payload = jwt.decode(token.strip(), sk, algorithms=[JWT_ALG])
        return payload.get("role") == ADMIN_ROLE
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False


def require_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "Unauthorized"}), 401
        tok = auth[7:].strip()
        if not verify_admin_jwt(tok):
            return jsonify({"error": "Invalid or expired token"}), 401
        return fn(*args, **kwargs)

    return wrapper
