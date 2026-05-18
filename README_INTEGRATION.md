# MR ANKISH - Portfolio Website
Full-stack portfolio application with React frontend and Python backend

**Live Demo:**
- Frontend: https://mr-ankish.vercel.app
- Backend API: https://mr-ankish.onrender.com

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Git

### Local Development

```bash
# Clone repository
git clone https://github.com/Ankish0285/MR-ANKISH.git
cd MR-ANKISH

# Frontend Setup
cd FRONTEND
npm install
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm run dev
# Opens on http://localhost:5173

# In another terminal - Backend Setup
cd BACKEND
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy .env.example to .env and fill in credentials
cp .env.example ../.env

# Start backend
python app.py
# Runs on http://localhost:5000
```

Done! Frontend and backend are now connected. ✅

---

## 📋 Complete Setup Guide

For detailed step-by-step setup, see **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)**

Topics covered:
- ✅ Frontend setup (React + Vite)
- ✅ Backend setup (Flask)
- ✅ MongoDB configuration
- ✅ Environment variables
- ✅ CORS configuration
- ✅ Deployment to Vercel & Render
- ✅ Testing connections

---

## 📚 Documentation

### For Getting Started
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Quick deployment guide
- **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)** - Full setup instructions

### For Development
- **[API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md)** - How to use API in React components
  - Axios examples
  - Fetch API examples
  - React hooks for API calls
  - Authentication & error handling

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Project architecture
  - Directory structure
  - File organization
  - Data flow
  - How to add new features

### For Troubleshooting
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues & fixes
  - CORS errors
  - Database connection issues
  - Authentication problems
  - Deployment errors
  - Performance optimization

---

## 🎯 Key Features

### Frontend (React + Vite)
- ⚡ Fast development with Vite
- 🎨 Responsive design with Tailwind CSS
- 🔄 Multiple API client options (Axios & Fetch)
- 🔐 JWT authentication for admin panel
- 📱 Mobile-friendly portfolio showcase

### Backend (Flask + MongoDB)
- 🛡️ CORS properly configured
- 🔐 JWT-based authentication
- 📦 RESTful API design
- 🗄️ MongoDB integration
- 📧 Optional email notifications
- 🖼️ Image upload support

### Deployment
- 🌐 Frontend on **Vercel** (auto-deploy from git)
- 🔧 Backend on **Render** (auto-deploy from git)
- 🔒 HTTPS everywhere
- 💾 Database on **MongoDB Atlas**

---

## 📁 Project Structure

```
MR-ANKISH/
├── FRONTEND/                      # React frontend
│   ├── src/
│   │   ├── services/api.js       # API client (Axios)
│   │   ├── services/api-fetch.js # API client (Fetch alternative)
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   └── ...
│   ├── .env.local                # Local development (create this)
│   └── package.json
│
├── BACKEND/                       # Flask backend
│   ├── app.py                    # Main Flask app
│   ├── models/db.py              # MongoDB connection
│   ├── routes/                   # API routes
│   ├── .env                      # Configuration (create from .env.example)
│   └── requirements.txt
│
├── COMPLETE_INTEGRATION_GUIDE.md  # Complete setup guide ⭐ START HERE
├── API_USAGE_GUIDE.md             # How to use API
├── PROJECT_STRUCTURE.md           # Architecture guide
├── TROUBLESHOOTING.md             # Common issues
└── README.md                      # This file
```

---

## 🔌 API Integration

### Using API in React

**Option 1: Axios (Recommended - Already Configured)**
```javascript
import { fetchProjects, createAdminProject } from '@/services/api';

const projects = await fetchProjects();
const newProject = await createAdminProject({ title: 'My Project' });
```

**Option 2: Fetch API (Lightweight)**
```javascript
import { fetchProjects, createAdminProject } from '@/services/api-fetch';

const projects = await fetchProjects();
const newProject = await createAdminProject({ title: 'My Project' });
```

Both have **identical APIs** - choose based on preference!

See **[API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md)** for complete examples.

---

## 🔐 Environment Configuration

### Frontend (.env.local or .env.production)
```env
# Development
VITE_API_URL=http://localhost:5000
VITE_ENV=development

# Production (Vercel)
VITE_API_URL=https://mr-ankish.onrender.com
VITE_ENV=production
```

### Backend (.env)
```env
# MongoDB
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/?appName=portfolio
MONGO_DB_NAME=portfolio

# Flask Security
SECRET_KEY=your-secret-key-here

# Admin Credentials
ADMIN_USER=admin@example.com
ADMIN_PASS=changeme

# CORS - Allow your frontend
ALLOWED_ORIGINS=https://mr-ankish.vercel.app,http://localhost:5173
```

---

## 🚀 Deployment

### Deploy Frontend (Vercel)

1. Push to GitHub
2. Connect Vercel to GitHub repository
3. Set environment variables:
   - `VITE_API_URL=https://mr-ankish.onrender.com`
   - `VITE_ENV=production`
4. Deploy!

```bash
npm i -g vercel
vercel --prod
```

### Deploy Backend (Render)

1. Connect Render to GitHub repository
2. Configure:
   - **Build Command:** `pip install -r BACKEND/requirements.txt`
   - **Start Command:** `cd BACKEND && python app.py`
3. Set environment variables:
   - All variables from `.env.example`
4. Deploy!

See **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)** for detailed steps.

---

## 🧪 Testing

### Test Local Development
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check API calls work in frontend
# Browser > DevTools > Console
fetch('http://localhost:5000/api/projects')
  .then(r => r.json())
  .then(d => console.log('Projects:', d))
```

### Test Production
```bash
# Check backend is running on Render
curl https://mr-ankish.onrender.com/api/health

# Visit frontend on Vercel
# Open browser console and check for API errors
```

See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for common issues.

---

## 🐛 Common Issues & Solutions

### CORS Error: "Access to XMLHttpRequest blocked"
- Make sure backend is running on correct port
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check `.env` file is loaded correctly

### MongoDB Connection Error
- Verify `MONGO_URI` is correct (includes username & password)
- Check IP whitelist in MongoDB Atlas
- Ensure database exists

### 401 Unauthorized on Admin Endpoints
- Clear localStorage and login again
- Verify `SECRET_KEY` is set in backend `.env`
- Check token is stored: `localStorage.getItem('admin_token')`

### Backend crashes on Render
- Check Render logs for errors
- Verify all environment variables are set
- Ensure `MONGO_URI` is correct

See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for detailed fixes.

---

## 📖 How to Use

### For Beginners
1. Read **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)** first
2. Set up local development following the guide
3. Test the API using the examples
4. Read **[API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md)** to learn how to use API in components

### For Developers
1. Understand the architecture in **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**
2. Learn API usage in **[API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md)**
3. Use **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** when needed
4. Deploy using guides in **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)**

### For Production
1. Follow deployment checklist in **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)**
2. Monitor health endpoint: `/api/health`
3. Set up uptime monitoring to keep backend from sleeping
4. Use strong secrets in production

---

## 🏗️ Architecture

### How It Works

```
User visits https://mr-ankish.vercel.app
        ↓
React frontend loads
        ↓
Frontend calls backend API (https://mr-ankish.onrender.com)
        ↓
Flask receives request
        ↓
Flask validates CORS (checks if origin is allowed)
        ↓
Flask queries MongoDB
        ↓
Returns JSON response
        ↓
React displays data to user
```

### Authentication Flow

```
User logs in
        ↓
POST /admin/login with credentials
        ↓
Backend verifies credentials
        ↓
Generate JWT token
        ↓
Return token to frontend
        ↓
Frontend stores token in localStorage
        ↓
Token automatically added to admin API calls
        ↓
Backend verifies token
        ↓
Allow/deny access
```

---

## 🔒 Security Notes

✅ **What's Secure:**
- CORS limits who can access your API
- JWT tokens authenticate admin users
- HTTPS everywhere (Vercel & Render)
- Credentials not in frontend code

❌ **What to Change for Production:**
- Change `SECRET_KEY` to a long random string
- Change `ADMIN_USER` and `ADMIN_PASS`
- Don't commit `.env` file
- Use environment variables for secrets
- Enable HTTPS only (auto on Vercel/Render)

---

## 📦 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | User interface |
| API Client | Axios / Fetch API | HTTP requests |
| Styling | Tailwind CSS | UI design |
| Navigation | React Router | Page routing |
| Animations | Framer Motion | Smooth animations |
| Backend | Flask | REST API server |
| Database | MongoDB | Data storage |
| Auth | JWT | Secure authentication |
| Hosting | Vercel + Render | Deployment |

---

## 🤝 Contributing

To add new features:

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make changes to frontend and backend
3. Test locally
4. Commit and push: `git push origin feature/my-feature`
5. Create pull request

---

## 📞 Support

If you encounter issues:

1. Check **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** first
2. Review **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)**
3. Check browser console for errors
4. Check backend logs: Render > Logs
5. Verify `.env` files are set correctly

---

## 📝 License

This project is open source. Feel free to use it for learning and development.

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Vite Documentation](https://vitejs.dev)
- [Vercel Deployment](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)

---

## ✨ Summary

You now have a complete, production-ready full-stack application:

✅ **Frontend:** React on Vercel  
✅ **Backend:** Flask on Render  
✅ **Database:** MongoDB Atlas  
✅ **Authentication:** JWT tokens  
✅ **CORS:** Properly configured  
✅ **Documentation:** Complete guides  
✅ **Examples:** Fetch & Axios  

Start building! 🚀

---

## 📌 Quick Links

| Document | Purpose |
|----------|---------|
| [COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md) | Complete setup & deployment |
| [API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md) | How to use API in React |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Architecture & file structure |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues & fixes |
| [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) | Fast deployment guide |

---

**Last Updated:** May 2026  
**Version:** 1.0.0
