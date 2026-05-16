from flask import Blueprint, jsonify, current_app
from datetime import datetime, timedelta, timezone

from models.db import get_db
from models.serializers import (
    serialize_about,
    serialize_achievement,
    serialize_contact_settings,
    serialize_content_creator,
    serialize_experience,
    serialize_home,
    serialize_site_settings,
    serialize_skill,
)
from utils.youtube import fetch_youtube_data

cms_public_bp = Blueprint("cms_public", __name__)


@cms_public_bp.get("/home")
def public_home():
    db = get_db()
    doc = db.homes.find_one(sort=[("_id", 1)])
    return jsonify({"item": serialize_home(doc)})


@cms_public_bp.get("/about")
def public_about():
    db = get_db()
    doc = db.abouts.find_one(sort=[("_id", 1)])
    return jsonify({"item": serialize_about(doc)})


@cms_public_bp.get("/skills")
def public_skills():
    db = get_db()
    cursor = db.skills.find().sort([("order", 1), ("created_at", -1)])
    return jsonify([serialize_skill(d) for d in cursor])


@cms_public_bp.get("/experience")
def public_experience():
    db = get_db()
    cursor = db.experience.find().sort("created_at", -1)
    return jsonify([serialize_experience(d) for d in cursor])


@cms_public_bp.get("/achievements")
def public_achievements():
    db = get_db()
    cursor = db.blog.find().sort([("date", -1), ("created_at", -1)])
    return jsonify([serialize_achievement(d) for d in cursor])


@cms_public_bp.get("/content-creator")
def public_content_creator():
    db = get_db()
    doc = db.content_creators.find_one({"_id": "singleton"})
    
    if not doc:
        doc = db.content_creators.find_one()

    return jsonify(serialize_content_creator(doc))


@cms_public_bp.get("/site-settings")
def public_site_settings():
    db = get_db()
    doc = db.site_settings.find_one({"_id": "main"})
    if not doc:
        return jsonify(serialize_site_settings(None))
    return jsonify(serialize_site_settings(doc))


@cms_public_bp.get("/contact-settings")
def public_contact_settings():
    db = get_db()
    doc = db.contact_settings.find_one({"_id": "main"})
    return jsonify(serialize_contact_settings(doc or {}))
