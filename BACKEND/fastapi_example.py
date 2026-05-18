"""
FastAPI Backend Example with CORS Configuration
=====================================================

This is an example FastAPI backend that can be used instead of Flask.
It demonstrates:
- Proper CORS configuration for production deployment
- JWT authentication
- MongoDB integration
- Environment variable setup
- Error handling
- Database connection

Installation:
    pip install fastapi uvicorn python-dotenv fastapi-cors pymongo python-multipart PyJWT

Running:
    # Development
    uvicorn main:app --reload --host 0.0.0.0 --port 5000

    # Production
    uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

Environment Variables (.env):
    MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/?appName=portfolio
    MONGO_DB_NAME=portfolio
    SECRET_KEY=your-secret-key-here
    ALLOWED_ORIGINS=https://mr-ankish.vercel.app,https://mr-ankish.onrender.com
"""

import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Optional

import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

# Load environment variables
load_dotenv()

# Configuration
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://user:password@cluster.mongodb.net/?appName=portfolio"
)
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "portfolio")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ADMIN_USER = os.getenv("ADMIN_USER", "admin@example.com")
ADMIN_PASS = os.getenv("ADMIN_PASS", "changeme")
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

# Add Vercel frontend URL if not already in ALLOWED_ORIGINS
if "https://mr-ankish.vercel.app" not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append("https://mr-ankish.vercel.app")

# MongoDB Client
mongo_client: Optional[MongoClient] = None
db = None


def get_database():
    """Get MongoDB database instance"""
    global db, mongo_client
    if mongo_client is None:
        try:
            mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            # Test connection
            mongo_client.admin.command('ping')
            db = mongo_client[MONGO_DB_NAME]
        except ServerSelectionTimeoutError as e:
            raise Exception(f"MongoDB connection failed: {str(e)}")
    return db


async def init_db():
    """Initialize database connection on startup"""
    try:
        get_database()
        print(f"✓ Connected to MongoDB: {MONGO_DB_NAME}")
    except Exception as e:
        print(f"✗ MongoDB connection error: {e}")


async def shutdown_db():
    """Close database connection on shutdown"""
    global mongo_client
    if mongo_client:
        mongo_client.close()
        print("✓ MongoDB connection closed")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan"""
    # Startup
    await init_db()
    yield
    # Shutdown
    await shutdown_db()


# Initialize FastAPI app
app = FastAPI(
    title="MR ANKISH API",
    description="Portfolio backend API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== AUTHENTICATION ====================

def create_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt


def verify_token(token: str):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


async def get_current_admin(token: str = None) -> str:
    """Dependency to get current admin user"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing token",
        )
    
    # Remove 'Bearer ' prefix if present
    if token.startswith("Bearer "):
        token = token[7:]
    
    return verify_token(token)


# ==================== ROUTES ====================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "success",
        "message": "MR ANKISH FastAPI Backend Running Successfully"
    }


@app.get("/api/health")
async def health_check():
    """Detailed health check with database status"""
    try:
        db = get_database()
        collections = db.list_collection_names()
        mongo_status = "connected"
        mongo_error = None
    except Exception as e:
        mongo_status = "disconnected"
        mongo_error = str(e)
        collections = []
    
    return {
        "status": "ok",
        "env": os.getenv("FLASK_ENV", "production"),
        "database_target": MONGO_DB_NAME,
        "mongo": mongo_status,
        "mongo_error": mongo_error,
        "collections": collections,
        "cors_allowed": ALLOWED_ORIGINS,
        "admin_config": {
            "user_set": bool(ADMIN_USER),
            "pass_set": bool(ADMIN_PASS),
            "secret_set": bool(SECRET_KEY),
        }
    }


@app.post("/api/admin/login")
async def admin_login(username: str, password: str):
    """Admin login endpoint"""
    if username != ADMIN_USER or password != ADMIN_PASS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    token = create_token({"sub": username})
    return {
        "token": token,
        "user": username,
        "message": "Login successful"
    }


# ==================== PUBLIC ENDPOINTS ====================

@app.get("/api/projects")
async def get_projects():
    """Get all projects"""
    try:
        db = get_database()
        projects = list(db.projects.find({}))
        # Convert MongoDB ObjectId to string
        for project in projects:
            project["_id"] = str(project["_id"])
        return {"projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/skills")
async def get_skills():
    """Get all skills"""
    try:
        db = get_database()
        skills = list(db.skills.find({}))
        for skill in skills:
            skill["_id"] = str(skill["_id"])
        return skills
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/home")
async def get_home():
    """Get home content"""
    try:
        db = get_database()
        home = db.home.find_one({})
        if home:
            home["_id"] = str(home["_id"])
        return {"item": home}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== ERROR HANDLERS ====================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "success": False,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    import traceback
    print(traceback.format_exc())
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "success": False,
            "detail": str(exc) if os.getenv("DEBUG") else None,
        },
    )


# ==================== STARTUP MESSAGES ====================

@app.get("/startup-info")
async def startup_info():
    """Show startup configuration (remove in production)"""
    return {
        "cors_origins": ALLOWED_ORIGINS,
        "database": MONGO_DB_NAME,
        "admin_configured": bool(ADMIN_USER and ADMIN_PASS),
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
