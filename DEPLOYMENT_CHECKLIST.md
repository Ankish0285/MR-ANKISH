# 🎯 Deployment Checklist

## Pre-Deployment ✅

- [x] Frontend API URL configured with environment variables
- [x] Backend CORS configured for production
- [x] Token-based auth working with credentials
- [x] Error messages updated (no localhost references)
- [x] Environment variables documented
- [x] Production .env files created

## Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Production setup: Vercel + Render integration (CORS, env vars, auth)"
git push origin main --force
```

### Step 2: Vercel Auto-Deploy
- Vercel will automatically detect changes
- Frontend builds and deploys to: https://mr-ankish.vercel.app
- **Set Env Variable on Vercel Dashboard:**
  ```
  VITE_API_URL = https://mr-ankish.onrender.com
  ```

### Step 3: Render Auto-Deploy
- Render will automatically detect changes
- Backend rebuilds and deploys to: https://mr-ankish.onrender.com
- **Verify Env Variables on Render Dashboard:**
  ```
  MONGO_URI = <your-uri>
  SECRET_KEY = <your-secret>
  ADMIN_USER = <admin-email>
  ADMIN_PASS = <admin-password>
  ```

## Post-Deployment Testing

### Test 1: Frontend Loads
```bash
curl https://mr-ankish.vercel.app
# Should return HTML (no errors)
```

### Test 2: Backend API Responds
```bash
curl https://mr-ankish.onrender.com/api/health
# Should return JSON: {"status": "ok", "mongo": "connected"}
```

### Test 3: CORS Works
```javascript
// On https://mr-ankish.vercel.app console:
fetch('https://mr-ankish.onrender.com/api/projects')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
# Should show projects (no CORS error)
```

### Test 4: Admin Login Works
```
1. Navigate to: https://mr-ankish.vercel.app/admin/login
2. Enter admin credentials
3. Should login successfully
4. No CORS errors in console
```

### Test 5: Public Features Work
- [ ] View projects/portfolio
- [ ] View skills
- [ ] View experience
- [ ] View achievements
- [ ] Send contact form
- [ ] View other sections

### Test 6: Admin Features Work
- [ ] Login to admin panel
- [ ] View messages
- [ ] Upload images
- [ ] Edit project/skills/experience/etc
- [ ] See changes on public site immediately

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Check `app.py` CORS config includes `https://mr-ankish.vercel.app` |
| Backend Unreachable | Verify Render backend is running (check logs) |
| Login Fails | Check ADMIN_USER, ADMIN_PASS on Render dashboard |
| Images Not Uploading | Check Cloudinary config or file size |
| Changes Not Appearing | Hard refresh (Ctrl+Shift+R) or clear cache |

## Status: 🎉 Ready to Deploy!

All configurations are set. Just run the git commands above to deploy.
