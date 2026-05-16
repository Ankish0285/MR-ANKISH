import os
from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, current_app, jsonify, request

from models.db import get_db
from models.serializers import (
    CONTACT_SETTING_KEYS,
    DEFAULT_VISIBILITY,
    serialize_about,
    serialize_achievement,
    serialize_contact,
    serialize_contact_settings,
    serialize_content_creator,
    serialize_experience,
    serialize_home,
    serialize_project,
    serialize_site_settings,
    serialize_skill,
)
from utils.auth import create_admin_jwt, require_admin
from utils.youtube import fetch_youtube_data

admin_bp = Blueprint("admin", __name__)

SKILL_LEVELS = frozenset({"Beginner", "Intermediate", "Advanced"})


def _oid(s):
    try:
        return ObjectId(s)
    except InvalidId:
        return None


def _normalize_tech_stack(v):
    if v is None:
        return ""
    if isinstance(v, list):
        return ",".join(str(x).strip() for x in v if str(x).strip())
    return str(v).strip()


# --- Auth ---


@admin_bp.post("/login")
def admin_login():
    try:
        data = request.get_json(silent=True) or {}
        username = (data.get("username") or "").strip()
        password = (data.get("password") or "").strip()
        expected_u = (os.getenv("ADMIN_USER") or "").strip()
        expected_p = (os.getenv("ADMIN_PASS") or "").strip()
        if not expected_u or not expected_p:
            return (
                jsonify(
                    {
                        "error": "Admin credentials not configured. Set ADMIN_USER and ADMIN_PASS in .env",
                    }
                ),
                503,
            )
        if username != expected_u or password != expected_p:
            return jsonify({"error": "Invalid username or password"}), 401
        token = create_admin_jwt()
        return jsonify({"ok": True, "token": token})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 503
    except Exception:
        current_app.logger.exception("POST /api/admin/login")
        return jsonify({"error": "Login failed due to a server error. Check Flask logs."}), 500


# --- Contact messages ---


@admin_bp.get("/messages")
@require_admin
def list_messages():
    db = get_db()
    cursor = db.contacts.find().sort("created_at", -1)
    return jsonify([serialize_contact(doc) for doc in cursor])


@admin_bp.delete("/message/<mid>")
@require_admin
def delete_message(mid):
    oid = _oid(mid)
    if oid is None:
        return jsonify({"error": "Invalid message id"}), 400
    db = get_db()
    result = db.contacts.delete_one({"_id": oid})
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})


# --- Home (singleton) ---


@admin_bp.get("/home")
@require_admin
def admin_get_home():
    db = get_db()
    doc = db.homes.find_one(sort=[("_id", 1)])
    return jsonify({"item": serialize_home(doc)})


@admin_bp.post("/home")
@require_admin
def admin_post_home():
    db = get_db()
    if db.homes.find_one():
        return jsonify({"error": "Home already exists. Use PUT /api/admin/home/<id>."}), 409
    data = request.get_json(silent=True) or {}
    doc = {
        "name": (data.get("name") or "").strip(),
        "title": (data.get("title") or "").strip(),
        "bio": (data.get("bio") or "").strip(),
        "profile_image": (data.get("profile_image") or "").strip() or None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    r = db.homes.insert_one(doc)
    doc["_id"] = r.inserted_id
    return jsonify(serialize_home(doc)), 201


@admin_bp.put("/home/<hid>")
@require_admin
def admin_put_home(hid):
    oid = _oid(hid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    data = request.get_json(silent=True) or {}
    db = get_db()
    update = {
        "name": (data.get("name") or "").strip(),
        "title": (data.get("title") or "").strip(),
        "bio": (data.get("bio") or "").strip(),
        "profile_image": (data.get("profile_image") or "").strip() or None,
        "updated_at": datetime.now(timezone.utc),
    }
    r = db.homes.update_one({"_id": oid}, {"$set": update})
    if r.matched_count == 0:
        return jsonify({"error": "Not found"}), 404
    doc = db.homes.find_one({"_id": oid})
    return jsonify(serialize_home(doc))


@admin_bp.delete("/home/<hid>")
@require_admin
def admin_delete_home(hid):
    oid = _oid(hid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    db = get_db()
    r = db.homes.delete_one({"_id": oid})
    if r.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})


# --- About (singleton) ---


@admin_bp.get("/about")
@require_admin
def admin_get_about():
    db = get_db()
    doc = db.abouts.find_one(sort=[("_id", 1)])
    return jsonify({"item": serialize_about(doc)})


@admin_bp.post("/about")
@require_admin
def admin_post_about():
    db = get_db()
    if db.abouts.find_one():
        return jsonify({"error": "About already exists. Use PUT /api/admin/about/<id>."}), 409
    data = request.get_json(silent=True) or {}
    doc = {
        "description": (data.get("description") or "").strip(),
        "resume_link": (data.get("resume_link") or "").strip() or None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    r = db.abouts.insert_one(doc)
    doc["_id"] = r.inserted_id
    return jsonify(serialize_about(doc)), 201


@admin_bp.put("/about/<aid>")
@require_admin
def admin_put_about(aid):
    oid = _oid(aid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    data = request.get_json(silent=True) or {}
    db = get_db()
    update = {
        "description": (data.get("description") or "").strip(),
        "resume_link": (data.get("resume_link") or "").strip() or None,
        "updated_at": datetime.now(timezone.utc),
    }
    r = db.abouts.update_one({"_id": oid}, {"$set": update})
    if r.matched_count == 0:
        return jsonify({"error": "Not found"}), 404
    doc = db.abouts.find_one({"_id": oid})
    return jsonify(serialize_about(doc))


@admin_bp.delete("/about/<aid>")
@require_admin
def admin_delete_about(aid):
    oid = _oid(aid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    db = get_db()
    r = db.abouts.delete_one({"_id": oid})
    if r.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})


# --- Skills ---


@admin_bp.get("/skills")
@require_admin
def admin_list_skills():
    db = get_db()
    cursor = db.skills.find().sort([("order", 1), ("created_at", -1)])
    return jsonify([serialize_skill(d) for d in cursor])


@admin_bp.post("/skills")
@require_admin
def admin_post_skill():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Skill name is required"}), 400
    level = (data.get("level") or "Intermediate").strip()
    if level not in SKILL_LEVELS:
        level = "Intermediate"
    db = get_db()
    order = int(db.skills.count_documents({}))
    doc = {
        "name": name,
        "level": level,
        "order": order,
        "created_at": datetime.now(timezone.utc),
    }
    r = db.skills.insert_one(doc)
    doc["_id"] = r.inserted_id
    return jsonify(serialize_skill(doc)), 201


@admin_bp.put("/skills/<sid>")
@require_admin
def admin_put_skill(sid):
    oid = _oid(sid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    data = request.get_json(silent=True) or {}
    level = (data.get("level") or "Intermediate").strip()
    if level not in SKILL_LEVELS:
        level = "Intermediate"
    db = get_db()
    update = {
        "name": (data.get("name") or "").strip(),
        "level": level,
    }
    if not update["name"]:
        return jsonify({"error": "Skill name is required"}), 400
    r = db.skills.update_one({"_id": oid}, {"$set": update})
    if r.matched_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify(serialize_skill(db.skills.find_one({"_id": oid})))


@admin_bp.delete("/skills/<sid>")
@require_admin
def admin_delete_skill(sid):
    oid = _oid(sid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    db = get_db()
    r = db.skills.delete_one({"_id": oid})
    if r.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})


# --- Experience ---


@admin_bp.get("/experience")
@require_admin
def admin_list_experience():
    db = get_db()
    cursor = db.experience.find().sort("created_at", -1)
    return jsonify([serialize_experience(d) for d in cursor])


@admin_bp.post("/experience")
@require_admin
def admin_post_experience():
    data = request.get_json(silent=True) or {}
    company = (data.get("company_name") or "").strip()
    role = (data.get("role") or "").strip()
    if not company or not role:
        return jsonify({"error": "company_name and role are required"}), 400
    doc = {
        "company_name": company,
        "role": role,
        "start_date": (data.get("start_date") or "").strip(),
        "end_date": (data.get("end_date") or "").strip(),
        "is_present": bool(data.get("is_present")),
        "duration": (data.get("duration") or "").strip(),
        "description": (data.get("description") or "").strip(),
        "created_at": datetime.now(timezone.utc),
    }
    db = get_db()
    r = db.experience.insert_one(doc)
    doc["_id"] = r.inserted_id
    return jsonify(serialize_experience(doc)), 201


@admin_bp.put("/experience/<eid>")
@require_admin
def admin_put_experience(eid):
    oid = _oid(eid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    data = request.get_json(silent=True) or {}
    company = (data.get("company_name") or "").strip()
    role = (data.get("role") or "").strip()
    if not company or not role:
        return jsonify({"error": "company_name and role are required"}), 400
    db = get_db()
    update = {
        "company_name": company,
        "role": role,
        "start_date": (data.get("start_date") or "").strip(),
        "end_date": (data.get("end_date") or "").strip(),
        "is_present": bool(data.get("is_present")),
        "duration": (data.get("duration") or "").strip(),
        "description": (data.get("description") or "").strip(),
    }
    r = db.experience.update_one({"_id": oid}, {"$set": update})
    if r.matched_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify(serialize_experience(db.experience.find_one({"_id": oid})))


@admin_bp.delete("/experience/<eid>")
@require_admin
def admin_delete_experience(eid):
    oid = _oid(eid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    db = get_db()
    r = db.experience.delete_one({"_id": oid})
    if r.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})


def _parse_blog_date(val):
    """Expects 'YYYY-MM-DD' or None. Returns datetime object or current time."""
    if not val:
        return datetime.now(timezone.utc)
    try:
        return datetime.fromisoformat(val)
    except (ValueError, TypeError):
        return datetime.now(timezone.utc)


# --- Achievements ---

ACHIEVEMENT_CATEGORIES = frozenset({"Certificate", "Competition", "Project", "Internship", "Other"})


def _parse_blog_date(raw):
    if raw is None or raw == "":
        return datetime.now(timezone.utc)
    if isinstance(raw, str):
        try:
            return datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            return datetime.now(timezone.utc)
    return datetime.now(timezone.utc)


@admin_bp.get("/achievements")
@require_admin
def admin_list_achievements():
    db = get_db()
    cursor = db.blog.find().sort([("date", -1), ("created_at", -1)])
    return jsonify([serialize_achievement(d) for d in cursor])


@admin_bp.post("/achievements")
@require_admin
def admin_post_achievement():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400
    category = (data.get("category") or "Certificate").strip()
    if category not in ACHIEVEMENT_CATEGORIES:
        category = "Other"
    doc = {
        "title": title,
        "content": (data.get("content") or "").strip(),
        "category": category,
        "date": _parse_blog_date(data.get("date")),
        "image_url": (data.get("image_url") or "").strip() or None,
        "created_at": datetime.now(timezone.utc),
    }
    db = get_db()
    r = db.blog.insert_one(doc)
    doc["_id"] = r.inserted_id
    return jsonify(serialize_achievement(doc)), 201


@admin_bp.put("/achievements/<aid>")
@require_admin
def admin_put_achievement(aid):
    oid = _oid(aid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400
    category = (data.get("category") or "Certificate").strip()
    if category not in ACHIEVEMENT_CATEGORIES:
        category = "Other"
    db = get_db()
    update = {
        "title": title,
        "content": (data.get("content") or "").strip(),
        "category": category,
        "date": _parse_blog_date(data.get("date")),
        "image_url": (data.get("image_url") or "").strip() or None,
    }
    r = db.blog.update_one({"_id": oid}, {"$set": update})
    if r.matched_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify(serialize_achievement(db.blog.find_one({"_id": oid})))


@admin_bp.delete("/achievements/<aid>")
@require_admin
def admin_delete_achievement(aid):
    oid = _oid(aid)
    if oid is None:
        return jsonify({"error": "Invalid id"}), 400
    db = get_db()
    r = db.blog.delete_one({"_id": oid})
    if r.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})


# --- Projects (admin list + CRUD) ---


@admin_bp.get("/projects")
@require_admin
def admin_list_projects():
    db = get_db()
    cursor = db.projects.find().sort("created_at", -1)
    return jsonify([serialize_project(d, admin=True) for d in cursor])


@admin_bp.post("/project")
@require_admin
def create_project():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400
    description = (data.get("description") or "").strip()
    tech_stack = _normalize_tech_stack(data.get("tech_stack"))
    github_link = (data.get("github_link") or "").strip() or None
    live_link = (data.get("live_link") or "").strip() or None
    image_url = (data.get("image_url") or "").strip() or None
    visible = data.get("visible")
    if visible is None:
        visible = True
    else:
        visible = bool(visible)

    doc = {
        "title": title,
        "description": description,
        "tech_stack": tech_stack,
        "github_link": github_link,
        "live_link": live_link,
        "image_url": image_url,
        "visible": visible,
        "created_at": datetime.now(timezone.utc),
    }
    db = get_db()
    result = db.projects.insert_one(doc)
    doc["_id"] = result.inserted_id
    return jsonify(serialize_project(doc, admin=True)), 201


@admin_bp.put("/project/<pid>")
@require_admin
def update_project(pid):
    oid = _oid(pid)
    if oid is None:
        return jsonify({"error": "Invalid project id"}), 400
    data = request.get_json(silent=True) or {}
    db = get_db()
    existing = db.projects.find_one({"_id": oid})
    if not existing:
        return jsonify({"error": "Not found"}), 404
    title = (data.get("title") or existing.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400
    update = {
        "title": title,
        "description": (data.get("description") if "description" in data else existing.get("description") or ""),
        "tech_stack": _normalize_tech_stack(
            data.get("tech_stack") if "tech_stack" in data else existing.get("tech_stack")
        ),
        "github_link": (data.get("github_link") if "github_link" in data else existing.get("github_link")),
        "live_link": (data.get("live_link") if "live_link" in data else existing.get("live_link")),
        "image_url": (data.get("image_url") if "image_url" in data else existing.get("image_url")),
    }
    if "github_link" in data:
        update["github_link"] = (data.get("github_link") or "").strip() or None
    if "live_link" in data:
        update["live_link"] = (data.get("live_link") or "").strip() or None
    if "image_url" in data:
        update["image_url"] = (data.get("image_url") or "").strip() or None
    if "visible" in data:
        update["visible"] = bool(data.get("visible"))
    else:
        update["visible"] = existing.get("visible") is not False

    db.projects.update_one({"_id": oid}, {"$set": update})
    doc = db.projects.find_one({"_id": oid})
    return jsonify(serialize_project(doc, admin=True))


@admin_bp.delete("/project/<pid>")
@require_admin
def delete_project(pid):
    oid = _oid(pid)
    if oid is None:
        return jsonify({"error": "Invalid project id"}), 400
    db = get_db()
    result = db.projects.delete_one({"_id": oid})
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})


# --- Site settings (visibility) ---


@admin_bp.get("/site-settings")
@require_admin
def admin_get_site_settings():
    db = get_db()
    doc = db.site_settings.find_one({"_id": "main"})
    return jsonify(serialize_site_settings(doc))


@admin_bp.put("/site-settings")
@require_admin
def admin_put_site_settings():
    data = request.get_json(silent=True) or {}
    vis_in = data.get("visibility") or {}
    if not isinstance(vis_in, dict):
        return jsonify({"error": "visibility must be an object"}), 400
    merged = dict(DEFAULT_VISIBILITY)
    for k in DEFAULT_VISIBILITY:
        if k in vis_in:
            merged[k] = bool(vis_in[k])
    db = get_db()
    db.site_settings.update_one(
        {"_id": "main"},
        {"$set": {"visibility": merged, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    doc = db.site_settings.find_one({"_id": "main"})
    return jsonify(serialize_site_settings(doc))


# --- Contact page (email + social links) ---


@admin_bp.get("/contact-settings")
@require_admin
def admin_get_contact_settings():
    db = get_db()
    doc = db.contact_settings.find_one({"_id": "main"})
    return jsonify(serialize_contact_settings(doc or {}))


@admin_bp.put("/contact-settings")
@require_admin
def admin_put_contact_settings():
    data = request.get_json(silent=True) or {}
    db = get_db()
    update = {}
    for k in CONTACT_SETTING_KEYS:
        v = data.get(k)
        update[k] = (str(v).strip() if v is not None else "") or ""
    update["updated_at"] = datetime.now(timezone.utc)
    db.contact_settings.update_one({"_id": "main"}, {"$set": update}, upsert=True)
    doc = db.contact_settings.find_one({"_id": "main"})
    return jsonify(serialize_contact_settings(doc or {}))


# --- Content Creator ---


@admin_bp.get("/content-creator")
@require_admin
def admin_get_content_creator():
    db = get_db()
    doc = db.content_creators.find_one({"_id": "singleton"})
    if not doc:
        # fallback to any document if singleton id not found yet
        doc = db.content_creators.find_one()
    return jsonify(serialize_content_creator(doc))


@admin_bp.post("/content-creator")
@require_admin
def admin_post_content_creator():
    try:
        data = request.get_json(silent=True) or {}
        current_app.logger.info("Saving Content Creator data for channel: %s", data.get("channel_name"))
        
        # Basic fields
        doc = {
            "channel_name": (data.get("channel_name") or "").strip(),
            "channel_desc": (data.get("channel_desc") or "").strip(),
            "channel_logo": (data.get("channel_logo") or "").strip(),
            "channel_banner": (data.get("channel_banner") or "").strip(),
            "subscribe_url": (data.get("subscribe_url") or "").strip(),
            "stats_subscribers": (data.get("stats_subscribers") or "").strip(),
            "stats_videos": (data.get("stats_videos") or "").strip(),
            "stats_views": (data.get("stats_views") or "").strip(),
            "featured_videos": data.get("featured_videos") or [],
            "shorts": data.get("shorts") or [],
            "playlists": data.get("playlists") or [],
            "journey": data.get("journey") or [],
            "updated_at": datetime.now(timezone.utc),
        }
        db = get_db()
        # Use a stable singleton ID
        db.content_creators.update_one(
            {"_id": "singleton"}, 
            {"$set": doc}, 
            upsert=True
        )
            
        updated_doc = db.content_creators.find_one({"_id": "singleton"})
        return jsonify(serialize_content_creator(updated_doc))
    except Exception as e:
        current_app.logger.exception("Error in admin_post_content_creator")
        return jsonify({"error": str(e)}), 500


# --- Upload (Cloudinary) ---


@admin_bp.post("/upload")
@require_admin
def admin_upload():
    cloud_name = (os.getenv("CLOUDINARY_CLOUD_NAME") or "").strip()
    api_key = (os.getenv("CLOUDINARY_API_KEY") or "").strip()
    api_secret = (os.getenv("CLOUDINARY_API_SECRET") or "").strip()

    if not all([cloud_name, api_key, api_secret]):
        return (
            jsonify(
                {
                    "error": "Cloudinary credentials missing in .env. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.",
                }
            ),
            503,
        )

    if "file" not in request.files:
        return jsonify({"error": "Missing file field (multipart key: file)"}), 400
    f = request.files["file"]
    if not f or not f.filename:
        return jsonify({"error": "Empty file"}), 400

    import cloudinary
    import cloudinary.uploader

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
    )
    try:
        result = cloudinary.uploader.upload(f, folder="portfolio-cms")
        url = result.get("secure_url") or result.get("url")
        if not url:
            return jsonify({"error": "Cloudinary upload failed (no URL returned)"}), 500
        return jsonify({"url": url})
    except Exception as e:
        current_app.logger.exception("Cloudinary upload error")
        return jsonify({"error": f"Cloudinary error: {str(e)}"}), 500
