# Project Structure & Architecture

Complete guide to understanding the project layout, file organization, and data flow.

## Directory Structure

```
MR-ANKISH/
│
├── FRONTEND/                          # React + Vite Frontend
│   ├── public/                        # Static files
│   ├── src/
│   │   ├── assets/                    # Images, icons, etc.
│   │   ├── components/                # Reusable React components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── pages/                     # Full page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── sections/                  # Section components
│   │   │   ├── HeroSection.jsx
│   │   │   ├── SkillsSection.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.js                # Axios API client ⭐ MAIN API SERVICE
│   │   │   ├── api-fetch.js          # Fetch API alternative
│   │   │   └── ...
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useAPI.js
│   │   │   └── useMutation.js
│   │   ├── context/                   # React Context API
│   │   ├── data/                      # Static data
│   │   ├── constants.js               # Global constants
│   │   ├── App.jsx                    # Main App component
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Global styles
│   ├── .env.local                     # Local dev env (git ignored) ⭐ CREATE THIS
│   ├── .env.production                # Production env (git ignored) ⭐ CREATE THIS
│   ├── .env.example                   # Template for developers
│   ├── vite.config.js                 # Vite configuration with API proxy
│   ├── jsconfig.json                  # JavaScript config
│   ├── package.json                   # Dependencies (axios, react-router, etc.)
│   ├── package-lock.json              # Lock file
│   └── vercel.json                    # Vercel deployment config
│
├── BACKEND/                           # Flask + MongoDB Backend
│   ├── app.py                         # Main Flask app ⭐ ENTRY POINT
│   ├── fastapi_example.py             # Alternative FastAPI implementation
│   ├── routes/
│   │   ├── admin.py                   # Admin endpoints (/api/admin/*)
│   │   ├── cms_public.py              # Public CMS endpoints
│   │   ├── contact.py                 # Contact form endpoint
│   │   ├── projects.py                # Projects endpoint
│   │   └── __init__.py
│   ├── models/
│   │   ├── db.py                      # MongoDB connection ⭐ DATABASE
│   │   └── __init__.py
│   ├── utils/
│   │   ├── auth.py                    # JWT authentication
│   │   ├── mail.py                    # Email utilities
│   │   └── decorators.py              # Custom decorators
│   ├── database/
│   │   └── ...                        # Database schema/migrations
│   ├── .env                           # Config (git ignored, filled from .env.example) ⭐ CONFIGURE THIS
│   ├── .env.example                   # Template for developers
│   ├── requirements.txt               # Python dependencies
│   │   ├── Flask==3.0.0
│   │   ├── flask-cors==4.0.0
│   │   ├── pymongo==4.6.0
│   │   └── ... (see file for all)
│   └── render.yaml                    # Render deployment config
│
├── .env                               # Root env file (contains BACKEND config)
├── .env.example                       # Example configuration
├── .gitignore                         # Git ignore rules
├── README.md                          # Project README
├── COMPLETE_INTEGRATION_GUIDE.md      # ⭐ COMPLETE SETUP GUIDE
├── API_USAGE_GUIDE.md                 # ⭐ HOW TO USE API IN FRONTEND
├── TROUBLESHOOTING.md                 # ⭐ COMMON ISSUES & FIXES
├── DEPLOYMENT_CHECKLIST.md            # Deployment steps
└── QUICK_DEPLOY.md                    # Quick start guide
```

---

## Key Files & Their Purpose

### Frontend Key Files

#### `FRONTEND/src/services/api.js` ⭐ MAIN API SERVICE
- **Purpose:** Axios HTTP client for API calls
- **Features:**
  - Automatically includes JWT token in requests
  - Error handling
  - Base URL from environment variables
  - Request/response interceptors
- **Usage:**
  ```javascript
  import API from '@/services/api';
  const projects = await API.get('/projects');
  ```

#### `FRONTEND/.env.local` (Create this)
- **Purpose:** Local development environment
- **Content:**
  ```env
  VITE_API_URL=http://localhost:5000
  VITE_ENV=development
  ```

#### `FRONTEND/.env.production` (Create this)
- **Purpose:** Production environment (Vercel)
- **Content:**
  ```env
  VITE_API_URL=https://mr-ankish.onrender.com
  VITE_ENV=production
  ```

#### `FRONTEND/vite.config.js`
- **Purpose:** Vite build configuration
- **Important:** Contains API proxy for local development
- **Proxy:** Routes `/api` requests to `http://127.0.0.1:5000`

---

### Backend Key Files

#### `BACKEND/app.py` ⭐ MAIN FLASK APP
- **Purpose:** Flask application entry point
- **Features:**
  - CORS configuration
  - Error handling
  - Route registration
  - Database initialization
- **Key Configuration:**
  ```python
  ALLOWED_ORIGINS = [
      "https://mr-ankish.vercel.app",
      "http://localhost:5173",
  ]
  
  CORS(app, origins=ALLOWED_ORIGINS, supports_credentials=True)
  ```

#### `BACKEND/models/db.py` ⭐ DATABASE CONNECTION
- **Purpose:** MongoDB connection management
- **Provides:**
  - `mongo_client` - MongoDB connection
  - `_db` - Database instance
  - Connection error handling
- **Usage:**
  ```python
  from models.db import _db
  projects = _db.projects.find({})
  ```

#### `BACKEND/.env` (Create from .env.example)
- **Purpose:** Configuration for backend
- **Required Variables:**
  ```env
  MONGO_URI=mongodb+srv://...
  MONGO_DB_NAME=portfolio
  SECRET_KEY=your-secret-key
  ADMIN_USER=admin@example.com
  ADMIN_PASS=password
  ALLOWED_ORIGINS=https://mr-ankish.vercel.app
  ```

#### `BACKEND/requirements.txt`
- **Purpose:** Python dependencies
- **Key packages:**
  - `Flask` - Web framework
  - `flask-cors` - CORS support
  - `pymongo` - MongoDB driver
  - `PyJWT` - JWT authentication
  - `python-dotenv` - Environment variables

---

## Data Flow Architecture

### Public Data Flow (No Authentication)

```
Browser
  ↓
Frontend (React)
  ↓
API Service (api.js or api-fetch.js)
  ↓
HTTP GET /api/projects
  ↓
Backend (Flask)
  ↓
Routes (routes/cms_public.py)
  ↓
Database (MongoDB)
  ↓
Return JSON
  ↓
Frontend receives data
  ↓
React Component renders
```

### Admin/Protected Data Flow (With Authentication)

```
Browser
  ↓
Admin Login Page
  ↓
Submit username/password
  ↓
API POST /api/admin/login
  ↓
Backend validates credentials
  ↓
Generate JWT token
  ↓
Return token to frontend
  ↓
Frontend stores token in localStorage
  ↓
API Service auto-adds Authorization header
  ↓
Subsequent requests include token
  ↓
Backend verifies token
  ↓
Route handler processes request
  ↓
Database operation
  ↓
Return result
```

---

## API Endpoints Structure

### Public Endpoints (No Auth Required)

```
GET  /api/projects               → Get all projects
GET  /api/skills                 → Get all skills
GET  /api/home                   → Get home section
GET  /api/about                  → Get about section
GET  /api/experience             → Get experience
GET  /api/achievements           → Get achievements
GET  /api/content-creator        → Get content creator info
GET  /api/site-settings          → Get site settings
GET  /api/health                 → Health check
POST /api/contact                → Submit contact form
```

### Admin Endpoints (Require JWT Token)

```
POST /api/admin/login                        → Login & get token
POST /api/admin/upload                       → Upload image

GET  /api/admin/home                         → Get home (admin view)
POST /api/admin/home                         → Create home
PUT  /api/admin/home/{id}                    → Update home
DEL  /api/admin/home/{id}                    → Delete home

GET  /api/admin/projects                     → Get projects (admin)
POST /api/admin/projects                     → Create project
PUT  /api/admin/projects/{id}                → Update project
DEL  /api/admin/projects/{id}                → Delete project

GET  /api/admin/skills                       → Get skills (admin)
POST /api/admin/skills                       → Create skill
PUT  /api/admin/skills/{id}                  → Update skill
DEL  /api/admin/skills/{id}                  → Delete skill

... (Similar patterns for about, experience, achievements, etc.)
```

---

## Environment Variables

### Frontend Environment Variables

**Available in React:**
```javascript
import.meta.env.VITE_API_URL      // API backend URL
import.meta.env.VITE_ENV          // Environment type
```

**Note:** Only variables prefixed with `VITE_` are exposed to frontend!

### Backend Environment Variables

**Loaded from .env file:**
```python
os.getenv('MONGO_URI')             # MongoDB connection string
os.getenv('MONGO_DB_NAME')         # Database name
os.getenv('SECRET_KEY')            # JWT secret
os.getenv('ADMIN_USER')            # Admin email
os.getenv('ADMIN_PASS')            # Admin password
os.getenv('ALLOWED_ORIGINS')       # CORS origins
```

---

## Deployment Targets

### Frontend Deployment (Vercel)

```
Source: GitHub Repository
↓
Vercel automatically detects changes
↓
Run: npm install
Run: npm run build
↓
Build output: dist/
↓
Deploy to edge network
↓
Live on: https://mr-ankish.vercel.app
```

**Important:**
- Frontend environment variables set in Vercel Dashboard
- Auto-builds on git push to main branch
- Static site hosting

### Backend Deployment (Render)

```
Source: GitHub Repository (same as frontend)
↓
Render detects changes
↓
Install: pip install -r BACKEND/requirements.txt
Run: cd BACKEND && python app.py
↓
Live on: https://mr-ankish.onrender.com
↓
Running on: port 8000 (or 5000)
```

**Important:**
- Backend environment variables set in Render Dashboard
- Auto-deploys on git push to main branch
- Long-running process (web service)
- Requires MongoDB Atlas for database

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

### Backend
- **Flask 3.0+** - Web framework
- **Flask-CORS** - CORS support
- **PyMongo** - MongoDB driver
- **PyJWT** - JWT authentication
- **Python 3.9+** - Runtime

### Database
- **MongoDB** - NoSQL database
- **MongoDB Atlas** - Cloud hosting (free tier available)

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

---

## File Naming Conventions

### Frontend
- **Components:** `PascalCase` (e.g., `ProjectCard.jsx`)
- **Hooks:** `camelCase` with `use` prefix (e.g., `useAPI.js`)
- **Utilities:** `camelCase` (e.g., `dateUtils.js`)
- **Styles:** `camelCase.module.css` or use Tailwind

### Backend
- **Modules:** `snake_case` (e.g., `auth_utils.py`)
- **Classes:** `PascalCase` (e.g., `DatabaseConnection`)
- **Functions:** `snake_case` (e.g., `get_projects()`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MONGO_URI`)

---

## How to Add a New Feature

### Example: Add a new "Testimonials" section

**1. Backend Setup**

Create route in `BACKEND/routes/testimonials.py`:
```python
from flask import Blueprint, request, jsonify
from models.db import _db

testimonials_bp = Blueprint('testimonials', __name__)

@testimonials_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    items = _db.testimonials.find({})
    return {'testimonials': list(items)}

@testimonials_bp.route('/admin/testimonials', methods=['POST'])
def create_testimonial():
    data = request.json
    _db.testimonials.insert_one(data)
    return {'success': True}
```

Register in `BACKEND/app.py`:
```python
from routes.testimonials import testimonials_bp
app.register_blueprint(testimonials_bp, url_prefix='/api')
```

**2. Frontend Setup**

Add to `FRONTEND/src/services/api.js`:
```javascript
export async function fetchTestimonials() {
  const res = await API.get('/testimonials');
  return res.data.testimonials;
}
```

**3. Use in Component**

```javascript
import { fetchTestimonials } from '@/services/api';
import { useAPI } from '@/hooks/useAPI';

function TestimonialsSection() {
  const { data, loading } = useAPI(fetchTestimonials);
  
  return (
    <div>
      {data?.map(t => <TestimonialCard key={t._id} data={t} />)}
    </div>
  );
}
```

---

## Common Tasks

### Adding a new environment variable

```bash
# 1. Add to .env.example (for documentation)
VITE_NEW_VAR=example_value

# 2. Add to .env (local development)
VITE_NEW_VAR=your_actual_value

# 3. In code
const value = import.meta.env.VITE_NEW_VAR

# 4. For Vercel, add in Dashboard:
# Settings > Environment Variables > Add
```

### Running development servers

```bash
# Option 1: Run both simultaneously
cd FRONTEND
npm run dev       # Starts both frontend + backend

# Option 2: Run separately
# Terminal 1:
cd FRONTEND && npm run dev:vite

# Terminal 2:
cd BACKEND && python app.py
```

### Testing API endpoints

```bash
# Test public endpoint
curl http://localhost:5000/api/projects

# Test with token
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:5000/api/admin/projects
```

---

## Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization with WebP
- Caching API responses
- Lazy load images

### Backend
- MongoDB indexes on frequently queried fields
- Cache responses for public endpoints
- Pagination for large datasets
- Connection pooling

---

## Security Best Practices

### Frontend
- ✅ Store token in localStorage (or sessionStorage)
- ✅ Send token in Authorization header
- ✅ Validate user input before submission
- ❌ Never expose API keys in frontend code

### Backend
- ✅ Validate all inputs
- ✅ Use HTTPS in production (auto with Vercel/Render)
- ✅ Verify JWT token on protected routes
- ✅ Whitelist CORS origins (don't use "*")
- ❌ Never log sensitive data
- ❌ Never expose error details in production

---

## Summary

This project uses:
1. **React** for frontend UI
2. **Flask** for backend API
3. **MongoDB** for database
4. **JWT** for authentication
5. **CORS** for cross-origin requests
6. **Vercel** & **Render** for deployment

All components work together seamlessly through the API service layer!
