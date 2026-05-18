# Troubleshooting & Common Issues

## Table of Contents
1. [CORS & Connection Issues](#cors--connection-issues)
2. [Database Issues](#database-issues)
3. [Authentication Issues](#authentication-issues)
4. [Deployment Issues](#deployment-issues)
5. [Performance Issues](#performance-issues)
6. [Environment & Configuration](#environment--configuration)

---

## CORS & Connection Issues

### ❌ Error: "Access to XMLHttpRequest has been blocked by CORS policy"

**When it happens:** Frontend cannot communicate with backend API

**Root Causes:**
1. Backend is not running
2. Wrong API URL in frontend environment variables
3. Backend URL not in ALLOWED_ORIGINS
4. CORS headers not properly configured
5. Frontend making requests before backend is ready

**Solution Steps:**

```bash
# 1. Verify backend is running
curl http://localhost:5000/
# Should return: {"status": "success", "message": "..."}

# 2. Check frontend environment variable
cat FRONTEND/.env.local
# Should show correct API URL

# 3. Verify CORS configuration in backend
curl http://localhost:5000/api/health
# Response should include: "cors_allowed": [...]

# 4. Check that your frontend URL is in ALLOWED_ORIGINS
echo $ALLOWED_ORIGINS
# Should include your frontend URL (e.g., https://mr-ankish.vercel.app)

# 5. Inspect the actual request in browser
# Open DevTools > Network > refresh page
# Click failing API request
# Check "Response Headers" for: Access-Control-Allow-Origin
```

**Fix:**

```python
# In BACKEND/app.py, verify CORS configuration:
ALLOWED_ORIGINS = [
    "https://mr-ankish.vercel.app",      # Production frontend
    "http://localhost:5173",              # Local frontend
    "http://localhost:3000",              # Alternative local port
]

CORS(
    app,
    origins=ALLOWED_ORIGINS,
    supports_credentials=True,            # Important for auth
    allow_headers=["*"],
    allow_methods=["*"]
)
```

```bash
# Update .env file:
ALLOWED_ORIGINS=https://mr-ankish.vercel.app,http://localhost:5173,http://localhost:3000
```

---

### ❌ Error: "Failed to fetch" or "Network error"

**When it happens:** Frontend tries to connect but gets no response

**Root Causes:**
1. Backend is sleeping (Render free tier)
2. Backend crashed or restarted
3. Firewall blocking connection
4. Backend port is wrong

**Solution:**

```bash
# Check if backend is alive
curl https://mr-ankish.onrender.com/api/health

# For Render free tier, backend goes to sleep after 15 min inactivity
# Add monitoring to keep it awake:

# Option 1: Use UptimeRobot (free)
# 1. Go to https://uptimerobot.com
# 2. Create new monitor
# 3. URL: https://mr-ankish.onrender.com/api/health
# 4. Interval: 5 minutes
# 5. Save

# Option 2: Add automated pings in frontend
// In FRONTEND/src/App.jsx or a hook:
useEffect(() => {
  // Ping backend every 10 minutes to keep it awake
  const interval = setInterval(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/health')
      .catch(e => console.log('Backend keep-alive ping'));
  }, 10 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);

# Option 3: Upgrade to Render paid plan
# - Prevents automatic sleep
# - Better performance for production
```

---

### ❌ Error: "401 Unauthorized" when calling protected endpoints

**When it happens:** Admin endpoints return 401 even with correct credentials

**Root Causes:**
1. Token not stored in localStorage
2. Token format wrong (missing "Bearer " prefix)
3. SECRET_KEY mismatch
4. Token expired

**Solution:**

```javascript
// Verify token is stored
console.log(localStorage.getItem('admin_token'));

// Clear and re-login
localStorage.removeItem('admin_token');

// Check request headers in DevTools
// Network tab > Click API request > Request Headers
// Should show: Authorization: Bearer YOUR_TOKEN

// Verify SECRET_KEY is set and same on backend
// Check: curl http://localhost:5000/api/health
// Should show: "secret_set": true
```

```python
# In BACKEND/.env, ensure SECRET_KEY is set:
SECRET_KEY=your-very-long-secret-key-here-change-in-production
```

---

## Database Issues

### ❌ Error: "MongoDB connection failed"

**When it happens:** Backend shows "mongo": "disconnected"

**Root Causes:**
1. Invalid MONGO_URI
2. MongoDB Atlas IP not whitelisted
3. Username/password wrong
4. Network timeout

**Solution:**

```bash
# 1. Test MongoDB URI directly
python -c "
from pymongo import MongoClient
uri = 'YOUR_MONGO_URI_HERE'
try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print('✓ MongoDB connected successfully')
except Exception as e:
    print(f'✗ Connection failed: {e}')
"

# 2. Fix MONGO_URI format
# Should be: mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/?appName=portfolio
# NOT: mongodb+srv://cluster.mongodb.net
# Include @ symbol and everything after cluster name

# 3. In MongoDB Atlas:
# - Go to Security > Network Access
# - Click "Add IP Address"
# - Choose "Allow access from anywhere" (0.0.0.0/0) OR
# - Add your specific server IP (find it in Render logs)

# 4. Verify credentials
# - Go to Security > Database Access
# - Check that your username/password is correct
# - Make sure user is assigned proper role

# 5. Check database exists
# - Go to Databases
# - Create new database if needed
# - Name it what you put in MONGO_DB_NAME (.env)
```

**Frontend Test:**

```javascript
// In browser console, test database connection:
fetch(import.meta.env.VITE_API_URL + '/api/health')
  .then(r => r.json())
  .then(data => {
    console.log('Backend health:', data);
    console.log('MongoDB status:', data.mongo);
    console.log('Collections:', data.collections);
  });
```

---

### ❌ Error: "Collection not found" or returning empty data

**When it happens:** API returns [] or null instead of data

**Root Causes:**
1. MongoDB database is empty
2. Wrong database name
3. Wrong collection names
4. Data hasn't been created yet

**Solution:**

```bash
# 1. Check which databases exist:
python -c "
from pymongo import MongoClient
client = MongoClient('YOUR_MONGO_URI')
dbs = client.list_database_names()
print('Available databases:', dbs)
"

# 2. Check collections in your database:
python -c "
from pymongo import MongoClient
client = MongoClient('YOUR_MONGO_URI')
db = client['portfolio']  # Your MONGO_DB_NAME
collections = db.list_collection_names()
print('Collections:', collections)
for col in collections:
    count = db[col].count_documents({})
    print(f'  {col}: {count} documents')
"

# 3. Create sample data:
python -c "
from pymongo import MongoClient
client = MongoClient('YOUR_MONGO_URI')
db = client['portfolio']

# Insert sample project
db.projects.insert_one({
    'title': 'Sample Project',
    'description': 'This is a test project',
    'link': 'https://example.com',
    'tech': ['React', 'Python']
})
print('✓ Sample data inserted')
"

# 4. Verify using MongoDB Atlas UI:
# - Go to Databases > Collections
# - Select your database
# - Click on collection
# - View documents
```

---

## Authentication Issues

### ❌ Error: "Invalid credentials" when logging in

**When it happens:** Admin login fails even with correct username/password

**Root Causes:**
1. ADMIN_USER or ADMIN_PASS not set in .env
2. Typo in credentials
3. Backend using different .env file

**Solution:**

```bash
# 1. Verify .env file is in right location:
ls -la BACKEND/.env     # Should exist
cat BACKEND/.env | grep ADMIN

# 2. Check if credentials are being loaded:
curl http://localhost:5000/api/health | grep admin_config
# Should show: "user_set": true, "pass_set": true

# 3. Update credentials and restart backend:
cat > ../.env << EOF
ADMIN_USER=admin@example.com
ADMIN_PASS=your_secure_password_here
EOF

# Restart Flask:
python BACKEND/app.py
```

---

### ❌ Error: "Token expired" after login

**When it happens:** Login works but user is logged out after a while

**Root Causes:**
1. Token expiration is too short
2. Clock sync issues between servers

**Solution:**

```python
# In BACKEND/routes/admin.py, adjust token expiration:
def create_token(username):
    token = jwt.encode(
        {'sub': username, 'exp': datetime.utcnow() + timedelta(days=30)},  # 30 days
        os.getenv('SECRET_KEY'),
        algorithm='HS256'
    )
    return token
```

```javascript
// In FRONTEND/src/services/api.js, handle token refresh:
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, clear and redirect to login
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Deployment Issues

### ❌ Vercel Deployment: "Cannot find module" or "VITE_API_URL undefined"

**When it happens:** Build fails or frontend can't find API URL

**Root Causes:**
1. Environment variables not set in Vercel
2. Missing .env.production file
3. Cache issues

**Solution:**

```bash
# 1. In Vercel Dashboard:
# Project Settings > Environment Variables
# Add: VITE_API_URL = https://mr-ankish.onrender.com
#      VITE_ENV = production

# 2. Redeploy:
git push origin main  # Trigger redeploy

# 3. Check build logs in Vercel Dashboard:
# Deployments tab > Click deployment > View Logs
# Look for errors

# 4. Clear cache:
# Settings > Git > Redeploy
```

---

### ❌ Render Deployment: "Build fails" or "Cannot import module"

**When it happens:** Render build fails with Python errors

**Root Causes:**
1. Missing Python dependencies
2. Wrong Start Command
3. Python version mismatch

**Solution:**

```bash
# 1. Verify requirements.txt includes all dependencies:
pip freeze > BACKEND/requirements.txt

# 2. Check Python version is >= 3.9:
# In Render Dashboard > Settings > Runtime
# Select Python 3.9 or higher

# 3. Verify Build & Start Commands:
# Build Command: pip install -r BACKEND/requirements.txt
# Start Command: cd BACKEND && python app.py

# 4. Check build logs:
# Render Dashboard > Services > mr-ankish-api > Logs
# Look for missing modules or syntax errors
```

---

### ❌ Render Deployment: "Crashed" or keeps restarting

**When it happens:** Backend crashes shortly after starting

**Root Causes:**
1. Missing environment variables
2. Database connection error
3. Syntax error in code
4. Port conflict

**Solution:**

```bash
# 1. Check Render logs:
# Render Dashboard > Services > Logs
# Look for error messages

# 2. Verify environment variables are set:
# Render Dashboard > Environment
# Check all required variables are present:
# - MONGO_URI
# - MONGO_DB_NAME
# - SECRET_KEY
# - ADMIN_USER
# - ADMIN_PASS

# 3. Test locally before deploying:
source venv/bin/activate
export $(cat .env | xargs)
python BACKEND/app.py

# 4. Check for syntax errors:
python -m py_compile BACKEND/app.py
```

---

## Performance Issues

### ❌ Slow API responses or timeouts

**When it happens:** API calls take 30+ seconds or timeout

**Root Causes:**
1. MongoDB queries are slow
2. Large data transfers
3. Render free tier is limited
4. Cold start on serverless

**Solution:**

```python
# Add query optimization in Flask:
from flask import jsonify
import time

@app.before_request
def log_request_time():
    request.start_time = time.time()

@app.after_request
def log_response_time(response):
    if hasattr(request, 'start_time'):
        elapsed = time.time() - request.start_time
        if elapsed > 1:  # Log slow requests
            print(f"Slow request: {request.path} took {elapsed:.2f}s")
    return response

# Add indexing to MongoDB for frequently queried fields:
db.projects.create_index([('created_at', -1)])
db.projects.create_index([('tags', 1)])
```

```python
# Add caching for frequently accessed data:
from flask import cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.get('/api/projects')
@cache.cached(timeout=300)  # Cache for 5 minutes
def get_projects():
    return fetch_projects()
```

---

## Environment & Configuration

### ❌ Error: "Environment variable not found"

**Solution:**

```bash
# 1. Check .env file exists in correct location:
ls -la .env              # Root directory
ls -la BACKEND/.env      # Backup location

# 2. Verify syntax:
cat .env | grep -E '^[^#].*='  # Show non-comment lines

# 3. Windows users - use correct encoding:
# Save file as UTF-8 without BOM
# Use: Notepad++ > Encoding > Encode in UTF-8 without BOM

# 4. Reload environment:
source .env              # Linux/Mac
set /p line < .env       # Windows

# 5. Restart application to reload variables:
# Stop and start Flask/Render service
```

---

### ❌ Secret Key issues

**Problem:** "SECRET_KEY not set" warning

**Solution:**

```bash
# Generate a strong secret key:
python -c "import secrets; print(secrets.token_hex(32))"
# Output example: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6

# Add to .env:
echo "SECRET_KEY=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" >> .env

# Verify:
grep SECRET_KEY .env
```

---

## Quick Reference Checklist

Before deploying to production:

- [ ] MongoDB URI is correct and IP is whitelisted
- [ ] SECRET_KEY is a long random string (not "dev-key")
- [ ] ADMIN_USER and ADMIN_PASS are changed from defaults
- [ ] ALLOWED_ORIGINS includes your frontend URL
- [ ] VITE_API_URL is set correctly in frontend
- [ ] Both frontend and backend build successfully locally
- [ ] CORS headers are being sent from backend
- [ ] Token authentication works for admin endpoints
- [ ] All required environment variables are set on Render/Vercel
- [ ] Database has required collections
- [ ] Health check endpoint returns {"status": "ok", "mongo": "connected"}

---

## Getting Help

If you still have issues:

1. **Check logs:**
   - Frontend: Browser DevTools Console
   - Backend: Terminal output or Render/Railway logs
   - Network: DevTools Network tab

2. **Test endpoints:**
   ```bash
   # Backend health
   curl https://mr-ankish.onrender.com/api/health
   
   # Frontend check
   Visit https://mr-ankish.vercel.app and check console
   ```

3. **Common curl tests:**
   ```bash
   # Test CORS
   curl -H "Origin: https://mr-ankish.vercel.app" \
        -H "Access-Control-Request-Method: GET" \
        https://mr-ankish.onrender.com/api/projects
   
   # Test with auth token
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://mr-ankish.onrender.com/api/admin/home
   ```

4. **Debug environment variables:**
   ```python
   # Add this to BACKEND/app.py temporarily:
   print("API_URL:", os.getenv('VITE_API_URL'))
   print("ALLOWED_ORIGINS:", os.getenv('ALLOWED_ORIGINS'))
   print("MONGO_URI:", os.getenv('MONGO_URI')[:30] + "...")
   ```

