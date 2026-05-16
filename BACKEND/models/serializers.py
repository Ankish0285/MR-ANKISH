def _oid_str(doc):
    oid = doc.get("_id")
    return str(oid) if oid is not None else None


def serialize_home(doc):
    if not doc:
        return None
    return {
        "id": _oid_str(doc),
        "name": doc.get("name") or "",
        "title": doc.get("title") or "",
        "bio": doc.get("bio") or "",
        "profile_image": doc.get("profile_image") or "",
    }


def serialize_about(doc):
    if not doc:
        return None
    return {
        "id": _oid_str(doc),
        "description": doc.get("description") or "",
        "resume_link": doc.get("resume_link") or "",
    }


def serialize_skill(doc):
    return {
        "id": _oid_str(doc),
        "name": doc.get("name") or "",
        "level": doc.get("level") or "Intermediate",
    }


def serialize_experience(doc):
    return {
        "id": _oid_str(doc),
        "company_name": doc.get("company_name") or "",
        "role": doc.get("role") or "",
        "start_date": doc.get("start_date") or "",
        "end_date": doc.get("end_date") or "",
        "is_present": bool(doc.get("is_present")),
        "duration": doc.get("duration") or "",
        "description": doc.get("description") or "",
    }


def serialize_achievement(doc):
    d = doc.get("date")
    return {
        "id": _oid_str(doc),
        "title": doc.get("title") or "",
        "description": doc.get("content") or "",  # renamed 'content' to 'description' internally for UI
        "content": doc.get("content") or "",      # keep original for compatibility
        "category": doc.get("category") or "Certificate",
        "date": d.isoformat() if hasattr(d, "isoformat") else str(d or ""),
        "image_url": doc.get("image_url") or "",
    }


def serialize_project(doc, admin: bool = False):
    oid = doc.get("_id")
    out = {
        "id": str(oid) if oid is not None else None,
        "title": doc.get("title"),
        "description": doc.get("description"),
        "tech_stack": doc.get("tech_stack") or "",
        "github_url": doc.get("github_link"),
        "demo_url": doc.get("live_link"),
        "url": doc.get("live_link"),
        "image_url": doc.get("image_url"),
    }
    if admin:
        out["visible"] = doc.get("visible") is not False
    return out


def serialize_contact(doc):
    ca = doc.get("created_at")
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name") or "",
        "email": doc.get("email") or "",
        "message": doc.get("message") or "",
        "created_at": ca.isoformat() if hasattr(ca, "isoformat") else str(ca or ""),
    }


DEFAULT_VISIBILITY = {
    "hero": True,
    "about": True,
    "skills": True,
    "projects": True,
    "experience": True,
    "blog": True,
    "contact": True,
}


def serialize_content_creator(doc):
    if not doc:
        return {}
    return {
        "id": _oid_str(doc),
        "channel_name": doc.get("channel_name") or "",
        "channel_desc": doc.get("channel_desc") or "",
        "channel_logo": doc.get("channel_logo") or "",
        "channel_banner": doc.get("channel_banner") or "",
        "subscribe_url": doc.get("subscribe_url") or "",
        "stats_subscribers": doc.get("stats_subscribers") or "",
        "stats_videos": doc.get("stats_videos") or "",
        "stats_views": doc.get("stats_views") or "",
        "featured_videos": doc.get("featured_videos") or [],
        "shorts": doc.get("shorts") or [],
        "playlists": doc.get("playlists") or [],
        "journey": doc.get("journey") or [],
    }


def serialize_site_settings(doc):
    vis = dict(DEFAULT_VISIBILITY)
    if doc and isinstance(doc.get("visibility"), dict):
        vis.update({k: bool(v) for k, v in doc["visibility"].items()})
    return {"visibility": vis}


CONTACT_SETTING_KEYS = (
    "public_email",
    "blurb",
    "github_url",
    "linkedin_url",
    "twitter_url",
    "instagram_url",
    "youtube_url",
    "facebook_url",
    "extra_socials",
)


def serialize_contact_settings(doc):
    """Contact section: email, intro blurb, social URLs. Adds email_href for mailto."""
    out = {k: "" for k in CONTACT_SETTING_KEYS}
    configured = doc is not None
    if doc:
        for k in CONTACT_SETTING_KEYS:
            v = doc.get(k)
            if v is not None:
                if k == "extra_socials":
                    out[k] = v if isinstance(v, list) else []
                else:
                    out[k] = str(v).strip()
    if "extra_socials" not in out:
        out["extra_socials"] = []
    pe = out["public_email"]
    if pe and not pe.lower().startswith("mailto:"):
        out["email_href"] = f"mailto:{pe}"
    else:
        out["email_href"] = pe or ""
    out["configured"] = configured
    return out
