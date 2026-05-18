# Quick Start - 5 Minutes

Get your app running locally in 5 minutes!

## Prerequisites
- Node.js 18+
- Python 3.9+
- Git

## Step 1: Clone & Navigate (1 min)

```bash
git clone https://github.com/Ankish0285/MR-ANKISH.git
cd MR-ANKISH
```

## Step 2: Run Setup Script (2 min)

**On Linux/Mac:**
```bash
bash setup.sh
```

**On Windows:**
```bash
setup.bat
```

This will:
- ✅ Check dependencies
- ✅ Create `.env` file
- ✅ Install frontend dependencies
- ✅ Create Python virtual environment
- ✅ Install backend dependencies

## Step 3: Configure Environment (1 min)

Edit `.env` file with your MongoDB credentials:

```env
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/?appName=portfolio
MONGO_DB_NAME=portfolio
SECRET_KEY=your-secret-key-here
ADMIN_USER=admin@example.com
ADMIN_PASS=your-password
ALLOWED_ORIGINS=https://mr-ankish.vercel.app,http://localhost:5173
```

**Get MongoDB URL:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Click "Connect" → copy connection string
4. Replace USER and PASS in the URL

## Step 4: Start Servers (1 min)

**Terminal 1 - Frontend:**
```bash
cd FRONTEND
npm run dev
```
Opens on http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd BACKEND
source venv/bin/activate     # On Windows: venv\Scripts\activate
python app.py
```
Runs on http://localhost:5000

## Done! ✅

Your app is running locally!
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin: http://localhost:5173/admin/login

---

## Test It Works

### In Browser Console:
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d));
```

### Test Admin Login:
1. Go to http://localhost:5173/admin
2. Enter credentials from `.env`
3. Should login successfully

---

## Next Steps

- 📖 Read **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)** for detailed setup
- 🔌 Check **[API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md)** to learn API usage
- 🏗️ See **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** to understand the architecture
- 🚀 Follow **[DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md)** before going live

---

## Common Issues

### ❌ "Cannot connect to API"
- Check if backend is running: `curl http://localhost:5000/`
- Check `.env.local` in FRONTEND has correct URL
- Check ALLOWED_ORIGINS in `.env` includes `http://localhost:5173`

### ❌ "MongoDB connection failed"
- Check MONGO_URI is correct in `.env`
- Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)
- Check database name is correct

### ❌ "Port already in use"
- Change port in scripts or kill process using the port
- Frontend default: 5173
- Backend default: 5000

---

## Troubleshooting

See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for detailed solutions.

---

## Deployment

### Deploy to Vercel (Frontend)
```bash
npm i -g vercel
vercel --prod
```

### Deploy to Render (Backend)
1. Connect Render to GitHub
2. Set environment variables
3. Deploy

See **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)** for detailed steps.

---

Happy coding! 🚀
