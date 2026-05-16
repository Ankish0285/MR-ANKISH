import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from models.db import DatabaseUnavailable, init_db, mongo_status
from routes.admin import admin_bp
from routes.cms_public import cms_public_bp
from routes.contact import contact_bp
from routes.projects import projects_bp

ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent

# utf-8-sig strips BOM on Windows so SECRET_KEY / ADMIN_* load correctly
def _load_env_files() -> None:
    for env_path in (ROOT / ".env", BACKEND_DIR / ".env"):
        if not env_path.is_file():
            continue
        try:
            load_dotenv(env_path, encoding="utf-8-sig")
        except TypeError:
            load_dotenv(env_path)


_load_env_files()

app = Flask(__name__)
_secret = (os.getenv("SECRET_KEY") or "").strip()
if not _secret:
    _secret = "dev-only-set-SECRET_KEY-in-dotenv"
app.config["SECRET_KEY"] = _secret

# Configure CORS for production and development
# Production: Only allow Vercel frontend
# Development: Allow localhost
ALLOWED_ORIGINS = [
    "https://mr-ankish.vercel.app",  # Production Vercel frontend
    "http://localhost:5173",  # Dev Vite frontend
    "http://127.0.0.1:5173",  # Dev Vite frontend (localhost IP)
]
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS, "supports_credentials": True}})

app.register_blueprint(projects_bp, url_prefix="/api")
app.register_blueprint(cms_public_bp, url_prefix="/api")
app.register_blueprint(contact_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api/admin")

init_db()


@app.errorhandler(Exception)
def _api_json_errors(exc):
    """Return JSON (not HTML) for API routes so the React app can show the real error."""
    if isinstance(exc, DatabaseUnavailable):
        if request.path.startswith("/api"):
            return jsonify({"error": str(exc)}), 503
        raise exc
    if isinstance(exc, HTTPException):
        if request.path.startswith("/api"):
            return jsonify({"error": exc.description or exc.name}), exc.code
        raise exc
    if request.path.startswith("/api"):
        import traceback

        detail = traceback.format_exc()
        app.logger.error("Unhandled API error:\n%s", detail)
        payload = {"error": "Internal server error"}
        if app.debug:
            payload["detail"] = str(exc)
        return jsonify(payload), 500
    raise exc


@app.get("/api/health")
def health():
    m = mongo_status()
    body = {"status": "ok"}
    if not m["ok"]:
        body["mongo"] = "disconnected"
        body["mongo_detail"] = m["detail"]
    else:
        body["mongo"] = "connected"
    return body


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
