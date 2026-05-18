# Frontend-Backend Integration Guide
Complete setup for connecting React frontend (Vercel) with Python backend (Render)

## Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- Git
- MongoDB Atlas account (free tier available)
- Vercel account (for frontend)
- Render account (for backend)

---

## Part 1: Frontend Setup (React + Vite)

### 1.1 Development Setup

```bash
# Clone repository
git clone https://github.com/Ankish0285/MR-ANKISH.git
cd MR-ANKISH/FRONTEND

# Install dependencies
npm install

# Create .env.local file for development
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000
VITE_ENV=development
EOF

# Start development server
npm run dev
```

This will:
- Start frontend on `http://localhost:5173`
- Proxy API calls to `http://localhost:5000` (Flask backend)

### 1.2 Environment Variables

**Development (.env.local)**
```env
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

**Production (.env.production)**
```env
VITE_API_URL=https://mr-ankish.onrender.com
VITE_ENV=production
```

### 1.3 API Integration Options

#### Option A: Using Axios (Already Configured)

```javascript
import API from './services/api';

// Automatically uses VITE_API_URL from environment
const projects = await API.get('/projects');
const home = await API.get('/home');
```

#### Option B: Using Fetch API (Alternative)

```javascript
import * as ApiService from './services/api-fetch';

// Same API calls, uses native Fetch instead of axios
const projects = await ApiService.fetchProjects();
const home = await ApiService.fetchHomePublic();
```

### 1.4 Deploying Frontend to Vercel

```bash
# Connect to Vercel
npm i -g vercel
vercel

# Set environment variables in Vercel dashboard
# Project Settings > Environment Variables
# VITE_API_URL=https://mr-ankish.onrender.com
# VITE_ENV=production

# Deploy
vercel --prod
```

---

## Part 2: Backend Setup (Flask)

### 2.1 Development Setup

```bash
cd MR-ANKISH/BACKEND

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your MongoDB credentials
cat > ../.env << EOF
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/?appName=portfolio
MONGO_DB_NAME=portfolio
SECRET_KEY=your-super-secret-key-change-this-in-production
ADMIN_USER=admin@example.com
ADMIN_PASS=securepassword
ALLOWED_ORIGINS=https://mr-ankish.vercel.app,http://localhost:5173,http://localhost:3000
EOF

# Run development server
python app.py
```

This starts Flask on `http://localhost:5000`

### 2.2 Environment Variables (.env)

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/?appName=portfolio
MONGO_DB_NAME=portfolio

# Flask Security
SECRET_KEY=use-a-long-random-string-in-production

# Admin Credentials
ADMIN_USER=admin@example.com
ADMIN_PASS=changeme123

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://mr-ankish.vercel.app,http://localhost:5173

# Optional: Email Configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# CONTACT_TO_EMAIL=admin@example.com

# Optional: Cloudinary for Image Uploads
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
```

### 2.3 CORS Configuration Explained

The Flask app (app.py) has CORS configured correctly:

```python
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

# Add Vercel frontend if not present
if "https://mr-ankish.vercel.app" not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append("https://mr-ankish.vercel.app")

# Configure CORS
CORS(
    app,
    origins=ALLOWED_ORIGINS,
    supports_credentials=True
)
```

**What this means:**
- Only requests from ALLOWED_ORIGINS can access your API
- Credentials (cookies, auth tokens) are included in cross-origin requests
- All HTTP methods and headers are allowed

### 2.4 Deploying Backend to Render

1. **Push code to GitHub** (already done if using this repo)

2. **Connect Render to GitHub**
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub account
   - Select your repository

3. **Configure Render Service**
   ```
   Name: mr-ankish-api
   Environment: Python 3
   Build Command: pip install -r BACKEND/requirements.txt
   Start Command: cd BACKEND && python app.py
   ```

4. **Add Environment Variables** in Render Dashboard
   - MONGO_URI
   - MONGO_DB_NAME
   - SECRET_KEY (generate a strong one)
   - ADMIN_USER
   - ADMIN_PASS
   - ALLOWED_ORIGINS=https://mr-ankish.vercel.app

5. **Deploy** - Render automatically deploys on git push

### 2.5 FastAPI Alternative

If you prefer FastAPI over Flask, use `fastapi_example.py`:

```bash
# Install FastAPI dependencies
pip install fastapi uvicorn

# Run FastAPI server
uvicorn fastapi_example:app --reload --port 5000

# For production on Render, change Start Command to:
# cd BACKEND && uvicorn fastapi_example:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## Part 3: Testing the Connection

### 3.1 Local Testing (Both Frontend and Backend Running Locally)

```bash
# Terminal 1: Frontend
cd FRONTEND
npm run dev
# Runs on http://localhost:5173

# Terminal 2: Backend
cd BACKEND
python app.py
# Runs on http://localhost:5000

# Test in browser
# Visit http://localhost:5173
# Check browser console for API calls
```

### 3.2 Check Backend Health

```bash
# Direct API test
curl http://localhost:5000/api/health

# Response should show:
# {
#   "status": "ok",
#   "env": "development",
#   "database_target": "portfolio",
#   "mongo": "connected",
#   "collections": [...]
# }
```

### 3.3 Frontend Checking API Configuration

Add this to your browser console while on the site:

```javascript
// Check environment
console.log('API URL:', import.meta.env.VITE_API_URL);

// Test API connection
fetch(import.meta.env.VITE_API_URL + '/api/health')
  .then(r => r.json())
  .then(data => console.log('Backend healthy:', data))
  .catch(e => console.error('Backend error:', e));
```

---

## Part 4: Project Structure

```
MR-ANKISH/
├── FRONTEND/                          # React + Vite
│   ├── src/
│   │   ├── services/
│   │   │   ├── api.js                # Axios API client (production)
│   │   │   └── api-fetch.js          # Fetch API client (alternative)
│   │   ├── components/               # React components
│   │   ├── pages/                    # Page components
│   │   └── App.jsx                   # Main app component
│   ├── .env.local                    # Local development env (git ignored)
│   ├── .env.production               # Production env (git ignored)
│   ├── .env.example                  # Template for environment variables
│   ├── vite.config.js                # Vite configuration with API proxy
│   └── package.json                  # Frontend dependencies
│
├── BACKEND/                           # Flask + MongoDB
│   ├── app.py                        # Main Flask application
│   ├── fastapi_example.py            # Alternative FastAPI implementation
│   ├── routes/                       # API route blueprints
│   │   ├── admin.py
│   │   ├── cms_public.py
│   │   ├── contact.py
│   │   └── projects.py
│   ├── models/
│   │   ├── db.py                     # MongoDB connection
│   │   └── ...                       # Data models
│   ├── utils/                        # Utility functions
│   ├── .env                          # Configuration (git ignored)
│   ├── .env.example                  # Template
│   └── requirements.txt              # Python dependencies
│
├── .env                              # Root .env (shared between frontend/backend)
├── .env.example                      # Example configuration
└── README.md                         # Documentation
```

---

## Part 5: Common Errors & Fixes

### Error 1: CORS Error - "Access to XMLHttpRequest blocked"

**Problem:** Frontend cannot reach backend API

**Causes:**
1. Backend is not running
2. ALLOWED_ORIGINS not configured correctly
3. Wrong API URL in frontend .env

**Fix:**
```bash
# Check if backend is running
curl http://localhost:5000/

# Check CORS configuration
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  http://localhost:5000/api/projects

# Verify frontend .env
cat FRONTEND/.env.local
# Should show: VITE_API_URL=http://localhost:5000 (dev)
#          or: VITE_API_URL=https://mr-ankish.onrender.com (prod)

# Restart both servers
```

### Error 2: 404 - "API not found"

**Problem:** Frontend can connect but API endpoints return 404

**Cause:** API route doesn't exist or has wrong path

**Fix:**
```bash
# Check available endpoints
curl http://localhost:5000/api/health

# Check Flask routes
python -c "from BACKEND.app import app; 
for rule in app.url_map.iter_rules(): 
    print(rule)"
```

### Error 3: MongoDB Connection Error

**Problem:** Backend shows "mongo": "disconnected"

**Causes:**
1. Invalid MONGO_URI in .env
2. MongoDB Atlas IP whitelist
3. Database doesn't exist

**Fix:**
```bash
# Test MongoDB connection directly
python -c "from pymongo import MongoClient; 
client = MongoClient('YOUR_MONGO_URI'); 
print(client.admin.command('ping'))"

# In MongoDB Atlas:
# 1. Go to Security > Network Access
# 2. Add IP address 0.0.0.0/0 (or your specific IP)
# 3. Or use "Allow access from anywhere"

# Create database if needed:
# 1. Go to MongoDB Atlas Dashboard
# 2. Create new database or collection
```

### Error 4: Token/Authentication Errors

**Problem:** Admin endpoints return 401 Unauthorized

**Cause:** Missing or invalid JWT token

**Fix:**
```javascript
// Check if token is stored
console.log(localStorage.getItem('admin_token'));

// Clear token and login again
localStorage.removeItem('admin_token');

// Verify token in headers
// Open DevTools > Network
// Check if "Authorization: Bearer TOKEN" header is sent

// Check SECRET_KEY is set in backend
curl http://localhost:5000/api/health
# Should show: "secret_set": true
```

### Error 5: Render Backend Keeps Timing Out

**Problem:** Backend deployment on Render frequently goes to sleep

**Cause:** Render free tier has inactivity limits

**Solution:**
1. **Upgrade Render plan** (recommended for production)
2. **Use uptime monitor:**
   ```bash
   # Add cron job to ping backend every 30 minutes
   # Use services like cron-job.org or UptimeRobot
   ```
3. **Database-as-a-Service:** Use MongoDB Atlas (free tier works)

---

## Part 6: Deployment Checklist

### Frontend (Vercel)
- [ ] Push code to GitHub
- [ ] Connect Vercel to GitHub repository
- [ ] Set environment variables:
  - `VITE_API_URL=https://mr-ankish.onrender.com`
  - `VITE_ENV=production`
- [ ] Deploy and test
- [ ] Check that API calls work in browser console

### Backend (Render)
- [ ] Push code to GitHub
- [ ] Connect Render to GitHub
- [ ] Configure:
  - Build Command: `pip install -r BACKEND/requirements.txt`
  - Start Command: `cd BACKEND && python app.py`
- [ ] Set environment variables:
  - `MONGO_URI` (MongoDB Atlas connection string)
  - `MONGO_DB_NAME` (usually "portfolio")
  - `SECRET_KEY` (generate random string)
  - `ADMIN_USER` (admin email)
  - `ADMIN_PASS` (admin password)
  - `ALLOWED_ORIGINS=https://mr-ankish.vercel.app`
- [ ] Deploy and test: `curl https://mr-ankish.onrender.com/api/health`
- [ ] Check MongoDB connection

### After Deployment
- [ ] Test frontend from Vercel URL
- [ ] Verify API calls work in production
- [ ] Check browser console for errors
- [ ] Test login functionality
- [ ] Test contact form submission
- [ ] Test file uploads (if applicable)

---

## Part 7: Useful Commands

```bash
# Frontend
npm run dev              # Start development server
npm run build           # Build for production
npm run dev:web         # Frontend only (without backend)

# Backend
python app.py           # Start Flask server
curl http://localhost:5000/api/health  # Check backend health

# Environment
export VITE_API_URL=https://mr-ankish.onrender.com  # Override env

# Git
git add .
git commit -m "Your message"
git push origin main    # Deploy to Render/Vercel
```

---

## Part 8: Advanced Configuration

### Custom Domain
- **Frontend:** Add custom domain in Vercel Dashboard
- **Backend:** Add custom domain in Render Dashboard
- **Update ALLOWED_ORIGINS** with new custom domain

### SSL/HTTPS
- Vercel & Render provide automatic SSL
- Always use HTTPS in production

### Rate Limiting
Add to Flask backend for security:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route("/api/contact", methods=["POST"])
@limiter.limit("5 per hour")
def submit_contact():
    # Contact endpoint
    pass
```

---

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Flask CORS Documentation](https://flask-cors.readthedocs.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

## Summary

Your application is now ready for:
✅ Local development
✅ Production deployment
✅ Cross-origin requests
✅ Secure authentication
✅ Database persistence
✅ File uploads
✅ Email notifications (optional)

Both frontend and backend are configured to work seamlessly together!
