import re
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request  # pyright: ignore[reportMissingImports]

from models.db import get_db
from utils.mail import send_contact_email

contact_bp = Blueprint("contact", __name__)

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@contact_bp.post("/contact")
def save_contact():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required."}), 400
    if not _EMAIL_RE.match(email):
        return jsonify({"error": "Invalid email address."}), 400

    db = get_db()
    doc = {
        "name": name,
        "email": email,
        "message": message,
        "created_at": datetime.now(timezone.utc),
    }
    db.contacts.insert_one(doc)

    send_contact_email(name=name, email=email, message=message)

    return jsonify({"message": "Thanks! Your message was received."}), 201
