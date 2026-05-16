# 🚀 Production Deployment Setup - Vercel & Render

## Status: ✅ Production Ready

Your project is now configured to run on:
- **Frontend**: https://mr-ankish.vercel.app (Vercel)
- **Backend**: https://mr-ankish.onrender.com (Render)

---

## 📋 Changes Made

### 1. Frontend Configuration (FRONTEND/)

#### `src/services/api.js` - API Base URL
```javascript
// Now uses environment variables for dynamic API URL
const API_BASE = import.meta.env.VITE_API_URL || "/api";
```

#### `.env.example` - Frontend Environment Variables
```bash
# Production: Use deployed Render backend
VITE_API_URL=https://mr-ankish.onrender.com

# Development: Use local proxy (leave empty or use "/api")
# VITE_API_URL=/api
```

#### `.env.production` - Production Environment
```bash
VITE_API_URL=https://mr-ankish.onrender.com
```

**Key Features:**
- ✅ Automatic environment-based API switching
- ✅ Token-based authentication (stored in localStorage)
- ✅ CORS credentials enabled for cross-origin requests
- ✅ Automatic redirect to login on 401 (unauthorized)

---

### 2. Backend Configuration (BACKEND/)

#### `app.py` - CORS Setup
```python
ALLOWED_ORIGINS = [
    "https://mr-ankish.vercel.app",  # Production Vercel
    "http://localhost:5173",         # Dev Vite frontend
    "http://127.0.0.1:5173",        # Dev Vite (IP)
]
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS, "supports_credentials": True}})
```

**Security Features:**
- ✅ Restricted to specific origins (not `*`)
- ✅ Credentials/cookies support enabled
- ✅ Development URLs included for local testing

---

## 🔧 How to Deploy

### Option 1: From GitHub (Recommended)

**Frontend (Vercel):**
```bash
# Already deployed at: https://mr-ankish.vercel.app
# Environment Variable on Vercel Dashboard:
# VITE_API_URL = https://mr-ankish.onrender.com
```

**Backend (Render):**
```bash
# Already deployed at: https://mr-ankish.onrender.com
# Environment Variables on Render Dashboard:
MONGO_URI=<your-mongodb-uri>
SECRET_KEY=<your-secret-key>
ADMIN_USER=<admin-email>
ADMIN_PASS=<admin-password>
```

### Option 2: Manual Redeploy

**Push Latest Code to GitHub:**
```bash
git add .
git commit -m "Production setup: Connect Vercel frontend to Render backend"
git push origin main
```

**Vercel will automatically:**
1. Detect changes on GitHub
2. Build the frontend
3. Deploy to https://mr-ankish.vercel.app

**Render will automatically:**
1. Detect changes on GitHub
2. Rebuild the Flask backend
3. Deploy to https://mr-ankish.onrender.com

---

## ✅ Testing the Connection

### 1. Test Frontend is Loading
```
Visit: https://mr-ankish.vercel.app
- Should load without errors
- Check browser console for network errors
```

### 2. Test Backend Connectivity
```javascript
// Open browser console on https://mr-ankish.vercel.app and run:
fetch('https://mr-ankish.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend Status:', d))
  .catch(e => console.error('Connection Error:', e))
```

### 3. Test Admin Login
```
1. Go to: https://mr-ankish.vercel.app/admin/login
2. Enter credentials from your .env file
3. Should redirect to admin dashboard
4. Verify no CORS errors in browser console
```

### 4. Test Public Data Fetch
```javascript
// In browser console:
fetch('https://mr-ankish.onrender.com/api/projects')
  .then(r => r.json())
  .then(d => console.log('Projects:', d))
  .catch(e => console.error('Error:', e))
```

---

## 🔐 Security Checklist

- [x] CORS restricted to known origins (not `*`)
- [x] JWT tokens used for admin authentication
- [x] Credentials enabled for token-based auth
- [x] Error messages updated (removed localhost references)
- [x] Production URLs in .env.production
- [x] DONT_TOUCH folder added to .gitignore
- [x] Environment variables documented

---

## 🚨 Troubleshooting

### Issue: CORS Error on Frontend
```
Error: Access to fetch at 'https://mr-ankish.onrender.com/...' from origin 
'https://mr-ankish.vercel.app' has been blocked by CORS policy
```

**Solution:**
- ✅ Already fixed in `app.py` with proper CORS config
- Ensure Render backend is running
- Check browser console for exact error

### Issue: "Backend API is unreachable"
- Verify Render backend is running: https://mr-ankish.onrender.com/api/health
- Check MONGO_URI is correct on Render
- Check all required environment variables are set

### Issue: Login Fails
- Verify ADMIN_USER and ADMIN_PASS are set on Render
- Check that credentials are correct
- Look for error message in browser console

### Issue: Images Not Uploading
- Verify Cloudinary credentials are set (if using them)
- Check file size limits
- Test in browser console:
  ```javascript
  fetch('https://mr-ankish.onrender.com/api/admin/upload', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
    body: formData
  })
  ```

---

## 📁 Files Modified

- ✅ `FRONTEND/src/services/api.js` - Environment-based API URL
- ✅ `FRONTEND/.env.example` - Example env vars
- ✅ `FRONTEND/.env.production` - Production env vars
- ✅ `BACKEND/app.py` - CORS configuration
- ✅ `.gitignore` - Added DONT_TOUCH folder

---

## 🚀 Next Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Production setup: Vercel + Render integration"
   git push origin main
   ```

2. **Wait for Auto-Deployments:**
   - Vercel: 2-5 minutes
   - Render: 3-10 minutes

3. **Test Everything:**
   - Visit frontend URL
   - Check admin login
   - Verify API calls work
   - Test all major features

4. **Monitor Logs:**
   - Vercel: Dashboard → Deployments → Logs
   - Render: Dashboard → Logs

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Render backend logs
3. Verify all environment variables are set
4. Ensure backend is not in "sleep" mode (Render free tier)

---

**Status: Ready for Production! 🎉**
