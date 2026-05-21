from flask import Blueprint, jsonify, current_app, request, redirect, Response
import requests
from datetime import datetime, timedelta, timezone

from models.db import get_db
from models.serializers import (
    serialize_about,
    serialize_achievement,
    serialize_contact_settings,
    serialize_content_creator,
    serialize_experience,
    serialize_home,
    serialize_project,
    serialize_site_settings,
    serialize_skill,
)
from utils.youtube import fetch_youtube_data

cms_public_bp = Blueprint("cms_public", __name__)


@cms_public_bp.route("/home", methods=["GET", "OPTIONS"])
def public_home():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    doc = db.homes.find_one(sort=[("_id", 1)])
    return jsonify({"item": serialize_home(doc)})


@cms_public_bp.route("/about", methods=["GET", "OPTIONS"])
def public_about():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    doc = db.abouts.find_one(sort=[("_id", 1)])
    return jsonify({"item": serialize_about(doc)})


@cms_public_bp.route("/skills", methods=["GET", "OPTIONS"])
def public_skills():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    cursor = db.skills.find().sort([("order", 1), ("created_at", -1)])
    return jsonify([serialize_skill(d) for d in cursor])


@cms_public_bp.route("/projects", methods=["GET", "OPTIONS"])
def public_projects():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    cursor = db.projects.find({"visible": {"$ne": False}}).sort("created_at", -1)
    # Returning direct array to match mapId logic in frontend
    return jsonify([serialize_project(d) for d in cursor])


@cms_public_bp.route("/experience", methods=["GET", "OPTIONS"])
def public_experience():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    cursor = db.experience.find().sort("created_at", -1)
    return jsonify([serialize_experience(d) for d in cursor])


@cms_public_bp.route("/achievements", methods=["GET", "OPTIONS"])
def public_achievements():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    cursor = db.blog.find().sort([("date", -1), ("created_at", -1)])
    return jsonify([serialize_achievement(d) for d in cursor])


@cms_public_bp.route("/content-creator", methods=["GET", "OPTIONS"])
def public_content_creator():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    doc = db.content_creators.find_one({"_id": "singleton"})
    
    if not doc:
        doc = db.content_creators.find_one()

    return jsonify(serialize_content_creator(doc))


@cms_public_bp.route("/site-settings", methods=["GET", "OPTIONS"])
def public_site_settings():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    doc = db.site_settings.find_one({"_id": "main"})
    if not doc:
        return jsonify(serialize_site_settings(None))
    return jsonify(serialize_site_settings(doc))


@cms_public_bp.route("/contact-settings", methods=["GET", "OPTIONS"])
def public_contact_settings():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    db = get_db()
    doc = db.contact_settings.find_one({"_id": "main"})
    return jsonify(serialize_contact_settings(doc or {}))


@cms_public_bp.route("/resume/view")
def view_resume():
    db = get_db()
    doc = db.abouts.find_one(sort=[("_id", 1)])
    if not doc or not doc.get("resume_link"):
        return jsonify({"error": "Resume link not found"}), 404
    
    url = doc["resume_link"]
    
    try:
        # Proxy the request to Cloudinary to keep the user on our domain
        resp = requests.get(url, stream=True, timeout=15)
        resp.raise_for_status()
        
        def generate():
            for chunk in resp.iter_content(chunk_size=8192):
                yield chunk

        return Response(
            generate(),
            mimetype='application/pdf',
            headers={
                "Content-Disposition": "inline; filename=resume.pdf",
                "Cache-Control": "public, max-age=3600",
                "Content-Length": resp.headers.get('Content-Length')
            }
        )
    except Exception as e:
        print(f"Proxy Error: {e}")
        # Fallback to redirect if proxy fails
        return redirect(url)


@cms_public_bp.route("/resume/download")
def download_resume():
    db = get_db()
    doc = db.abouts.find_one(sort=[("_id", 1)])
    if not doc or not doc.get("resume_link"):
        return jsonify({"error": "Resume link not found"}), 404
    
    url = doc["resume_link"]
    
    try:
        # Proxy the request to Cloudinary for direct download
        resp = requests.get(url, stream=True, timeout=15)
        resp.raise_for_status()
        
        def generate():
            for chunk in resp.iter_content(chunk_size=8192):
                yield chunk

        return Response(
            generate(),
            mimetype='application/pdf',
            headers={
                "Content-Disposition": "attachment; filename=resume.pdf",
                "Cache-Control": "no-cache",
                "Content-Length": resp.headers.get('Content-Length')
            }
        )
    except Exception as e:
        print(f"Proxy Error: {e}")
        # Fallback to direct download URL if proxy fails
        if "cloudinary.com" in url and "/upload/" in url and "fl_attachment" not in url:
            url = url.replace("/upload/", "/upload/fl_attachment/")
        return redirect(url)
