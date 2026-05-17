from flask import Blueprint, jsonify

from models.db import get_db
from models.serializers import serialize_project

projects_bp = Blueprint("projects", __name__)


@projects_bp.route("/projects", methods=["GET", "OPTIONS"])
def list_projects():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    q = {"$or": [{"visible": True}, {"visible": {"$exists": False}}]}
    cursor = db.projects.find(q).sort("created_at", -1)
    return jsonify([serialize_project(doc) for doc in cursor])
