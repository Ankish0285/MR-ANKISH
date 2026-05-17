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
# Disable strict slashes to prevent 405 on trailing slash mismatch
app.url_map.strict_slashes = False

_secret = (os.getenv("SECRET_KEY") or "").strip()
if not _secret:
    _secret = "dev-only-set-SECRET_KEY-in-dotenv"
app.config["SECRET_KEY"] = _secret

# Configure CORS for production and development
_origins = os.getenv("ALLOWED_ORIGINS", "https://mr-ankish.vercel.app").split(",")
ALLOWED_ORIGINS = [o.strip() for o in _origins if o.strip()]

CORS(app, resources={
    r"/api/*": {
        "origins": ALLOWED_ORIGINS,
        "supports_credentials": True,
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
})

app.register_blueprint(projects_bp, url_prefix="/api")
app.register_blueprint(cms_public_bp, url_prefix="/api")
app.register_blueprint(contact_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api/admin")

init_db()


@app.errorhandler(Exception)
def _api_json_errors(exc):
    """Return JSON (not HTML) for API routes so the React app can show the real error."""
    import traceback
    
    status_code = 500
    message = "Internal server error"
    detail = None

    if isinstance(exc, DatabaseUnavailable):
        status_code = 503
        message = str(exc)
    elif isinstance(exc, HTTPException):
        status_code = exc.code
        message = exc.description or exc.name
    else:
        app.logger.error("Unhandled API error:\n%s", traceback.format_exc())
        if app.debug:
            detail = str(exc)

    if request.path.startswith("/api"):
        payload = {"error": message, "success": False}
        if detail:
            payload["detail"] = detail
        return jsonify(payload), status_code
    
    raise exc


@app.route("/")
def home():
    return {
        "status": "success",
        "message": "MR ANKISH Backend Running Successfully"
    }


@app.get("/api/health")
def health():
    m = mongo_status()
    body = {"status": "ok"}
    if not m["ok"]:
        body["mongo"] = "disconnected"
        body["mongo_detail"] = m["detail"]
    else:
        body["mongo"] = "connected"
        body["database"] = os.getenv("MONGO_DB_NAME", "portfolio")
    return body


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
