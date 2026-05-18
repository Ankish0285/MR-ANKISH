# Deployment Verification Checklist

Complete this checklist before deploying to production to ensure everything works correctly.

---

## Part 1: Local Development Testing

### Frontend
- [ ] `npm install` completed without errors
- [ ] `.env.local` exists and has `VITE_API_URL=http://localhost:5000`
- [ ] `npm run dev` starts without errors
- [ ] Frontend accessible on http://localhost:5173
- [ ] Console shows no JavaScript errors
- [ ] Styles load correctly (Tailwind CSS applied)
- [ ] All pages load correctly (home, about, projects, contact, admin)

### Backend
- [ ] Python 3.9+ installed
- [ ] `pip install -r requirements.txt` completed
- [ ] `.env` file exists with all required variables:
  - [ ] `MONGO_URI` is filled (valid MongoDB connection)
  - [ ] `MONGO_DB_NAME` is set (usually "portfolio")
  - [ ] `SECRET_KEY` is a long random string (NOT "dev-key")
  - [ ] `ADMIN_USER` and `ADMIN_PASS` are set
  - [ ] `ALLOWED_ORIGINS` includes `http://localhost:5173`
- [ ] `python app.py` starts without errors
- [ ] Backend accessible on http://localhost:5000
- [ ] No Python traceback errors on startup

### Database
- [ ] MongoDB Atlas account exists and is active
- [ ] Connection string is valid (includes username and password)
- [ ] IP address is whitelisted in MongoDB Atlas (0.0.0.0/0 or specific IP)
- [ ] Database exists in MongoDB Atlas
- [ ] Can connect with: `curl http://localhost:5000/api/health`
- [ ] Response shows: `"mongo": "connected"`

---

## Part 2: API Connection Testing

### Health Check
```bash
# In terminal, run:
curl http://localhost:5000/api/health

# Should return JSON with:
# "status": "ok"
# "mongo": "connected"
# "cors_allowed": [...]
# "admin_config": {...}
```
- [ ] Health check endpoint responds
- [ ] MongoDB is connected
- [ ] CORS origins are configured
- [ ] Admin config is set

### Public Endpoints
```bash
# Test each endpoint:
curl http://localhost:5000/api/projects
curl http://localhost:5000/api/skills
curl http://localhost:5000/api/home
```
- [ ] GET /api/projects returns data
- [ ] GET /api/skills returns data
- [ ] GET /api/home returns data
- [ ] All responses are valid JSON

### Frontend API Integration
In browser console (http://localhost:5173), run:
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d));
```
- [ ] Request succeeds (no CORS error)
- [ ] Response received
- [ ] Data is correct

---

## Part 3: Authentication Testing

### Login Flow
1. Visit http://localhost:5173/admin/login
2. Enter credentials from `.env`:
   - Username: `ADMIN_USER` value
   - Password: `ADMIN_PASS` value
3. Click Login

- [ ] Login succeeds (no error message)
- [ ] Redirected to admin dashboard
- [ ] Token stored in localStorage:
  ```javascript
  console.log(localStorage.getItem('admin_token'));
  // Should show a long string starting with "eyJ"
  ```

### Protected Endpoints (with token)
In browser console:
```javascript
const token = localStorage.getItem('admin_token');
fetch('http://localhost:5000/api/admin/projects', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(d => console.log(d));
```
- [ ] Protected endpoint accessible with token
- [ ] Returns admin data
- [ ] No 401 Unauthorized error

### Logout
1. Click Logout in admin panel
2. Token should be removed:
   ```javascript
   console.log(localStorage.getItem('admin_token'));
   // Should return: null
   ```
- [ ] Token cleared from localStorage
- [ ] Redirected to login page
- [ ] Cannot access admin pages

---

## Part 4: CORS Testing

### Browser CORS Headers
In browser Network tab (DevTools):
1. Make any API request
2. Check Response Headers
3. Look for: `Access-Control-Allow-Origin`

- [ ] Header present: `Access-Control-Allow-Origin: http://localhost:5173`
- [ ] Header value matches frontend URL
- [ ] Requests succeed without CORS errors

### curl CORS Test
```bash
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  http://localhost:5000/api/projects
```
- [ ] Request succeeds
- [ ] CORS headers present in response

---

## Part 5: Production Environment Setup (Vercel)

### Frontend Configuration
- [ ] GitHub repository is public (or Vercel has access)
- [ ] Connected Vercel account to GitHub
- [ ] Project created on Vercel
- [ ] Environment variables added in Vercel Dashboard:
  - [ ] `VITE_API_URL=https://mr-ankish.onrender.com`
  - [ ] `VITE_ENV=production`
- [ ] Build runs successfully: `npm run build`
- [ ] Build output is in `dist/` folder
- [ ] `.env.production` file exists (with production values)
- [ ] `.env.local` is in `.gitignore` (not committed to git)

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```
- [ ] Vercel deployment succeeds
- [ ] Site accessible on Vercel URL
- [ ] Environment variables set correctly
- [ ] Deployment logs show no errors

---

## Part 6: Production Environment Setup (Render)

### Backend Configuration
- [ ] GitHub repository updated with latest code
- [ ] Render account created
- [ ] Connected Render to GitHub
- [ ] Web Service created
- [ ] Settings configured:
  - [ ] Runtime: Python 3.10 (or higher)
  - [ ] Build Command: `pip install -r BACKEND/requirements.txt`
  - [ ] Start Command: `cd BACKEND && python app.py`
- [ ] Environment variables added in Render Dashboard:
  - [ ] `MONGO_URI` (from MongoDB Atlas)
  - [ ] `MONGO_DB_NAME` (usually "portfolio")
  - [ ] `SECRET_KEY` (long random string)
  - [ ] `ADMIN_USER` (admin email)
  - [ ] `ADMIN_PASS` (secure password)
  - [ ] `ALLOWED_ORIGINS=https://mr-ankish.vercel.app`
  - [ ] `FLASK_ENV=production`

### Render Deployment
- [ ] Backend service deployed on Render
- [ ] Deployment succeeds (check Render dashboard)
- [ ] Service URL assigned (e.g., `https://mr-ankish-api.onrender.com`)
- [ ] Health check passes:
  ```bash
  curl https://mr-ankish-api.onrender.com/api/health
  ```
- [ ] Logs show successful startup:
  - [ ] "Connected to MongoDB"
  - [ ] "Running on 0.0.0.0:PORT"
  - [ ] No errors in logs

---

## Part 7: Production Testing

### Vercel Frontend
- [ ] Visit Vercel URL in browser
- [ ] Frontend loads without errors
- [ ] Check console for any errors
- [ ] All pages accessible
- [ ] Styling is correct

### Render Backend
```bash
# Health check
curl https://mr-ankish.onrender.com/api/health

# Should return (with production values):
# {
#   "status": "ok",
#   "mongo": "connected",
#   "cors_allowed": ["https://mr-ankish.vercel.app", ...],
#   ...
# }
```
- [ ] Health endpoint responds
- [ ] MongoDB connected
- [ ] CORS allows Vercel frontend

### Frontend to Backend Communication
1. Visit Vercel frontend URL
2. Open browser console (F12 > Console)
3. Test API call:
   ```javascript
   fetch(import.meta.env.VITE_API_URL + '/api/projects')
     .then(r => r.json())
     .then(d => console.log('Projects:', d));
   ```
- [ ] Request succeeds (no CORS error)
- [ ] Data received and logged
- [ ] No 503/504 errors (backend unavailable)

### Admin Panel (Production)
1. Visit `https://mr-ankish.vercel.app/admin/login`
2. Login with Render backend credentials
3. Submit a test form or create test data

- [ ] Login succeeds
- [ ] Admin operations work (create/update/delete)
- [ ] Data persists in MongoDB
- [ ] No errors in console

---

## Part 8: Data Persistence

### Test Database Operations
1. Create test project in admin panel
2. Refresh the page
3. Project still visible

- [ ] Data saved to MongoDB
- [ ] Data persists after refresh
- [ ] Data visible in MongoDB Atlas

### Verify MongoDB Collections
In MongoDB Atlas:
1. Go to Collections
2. Check for:
   - [ ] projects
   - [ ] skills
   - [ ] home
   - [ ] about
   - [ ] experience
   - [ ] achievements
   - [ ] contact_messages (if contact form used)

---

## Part 9: Monitoring & Alerting

### Uptime Monitoring
Set up service to keep backend awake (Render free tier sleeps after 15 min):

Option 1: UptimeRobot (Free)
- [ ] Created UptimeRobot account
- [ ] Added monitor for: `https://mr-ankish.onrender.com/api/health`
- [ ] Set interval to 5 minutes
- [ ] Enabled email alerts

Option 2: Frontend Keep-Alive
- [ ] Added ping logic to keep backend awake
- [ ] Tested that it works

### Error Logging
- [ ] Check Render logs regularly
- [ ] Subscribe to Render notifications
- [ ] Set up error alerts (if using services like Sentry)

---

## Part 10: Security Verification

### Secrets & Credentials
- [ ] No `.env` file committed to git
- [ ] `.env` in `.gitignore`
- [ ] No secrets in code comments
- [ ] No secrets in frontend code
- [ ] Production `SECRET_KEY` is random (not "dev-key")
- [ ] Admin credentials changed from defaults

### HTTPS & CORS
- [ ] Both Vercel and Render use HTTPS
- [ ] ALLOWED_ORIGINS only includes legitimate domains
- [ ] No wildcard `*` in CORS origins
- [ ] Production frontend URL in ALLOWED_ORIGINS

### Token Security
- [ ] JWT tokens stored in localStorage (or sessionStorage)
- [ ] Tokens sent in `Authorization` header (not in URL)
- [ ] Tokens expire after reasonable time
- [ ] Logout clears tokens

---

## Part 11: Performance Check

### Frontend Performance
```javascript
// In browser console:
window.performance.getEntriesByType('navigation')[0].loadEventEnd
```
- [ ] Page loads in under 3 seconds
- [ ] No console errors
- [ ] Smooth animations (60fps)

### Backend Performance
```bash
# Check API response time:
time curl https://mr-ankish.onrender.com/api/health
```
- [ ] API responds in under 500ms
- [ ] No timeout errors
- [ ] Proper error responses (not 500s)

### Database Performance
- [ ] Queries complete in reasonable time
- [ ] No "timed out" errors
- [ ] MongoDB indexes present

---

## Final Sign-Off

- [ ] All tests passed
- [ ] Frontend working on Vercel
- [ ] Backend working on Render
- [ ] Database connected
- [ ] Authentication working
- [ ] API calls successful
- [ ] CORS configured correctly
- [ ] Monitoring set up
- [ ] Security verified
- [ ] Ready for production!

---

## Troubleshooting During Verification

If any test fails:

1. Check **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for solutions
2. Review **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)** for setup details
3. Check logs:
   - Browser console (F12)
   - Render logs (Services > Logs)
   - Vercel logs (Deployments > Logs)
4. Verify environment variables are correct
5. Ensure `.env` file exists and is loaded
6. Restart services if needed

---

## Post-Deployment Monitoring

After going live:

- [ ] Monitor Render logs daily
- [ ] Check MongoDB Atlas storage usage
- [ ] Review error logs weekly
- [ ] Keep dependencies updated
- [ ] Monitor uptime (UptimeRobot or similar)
- [ ] Test API calls regularly
- [ ] Backup MongoDB data regularly

---

**Status:** 
- [ ] All checks passed - Ready for production! 🎉
- [ ] Issues found - See TROUBLESHOOTING.md and review failing items

**Date Completed:** ___________  
**Completed By:** ___________

