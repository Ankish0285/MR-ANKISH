# MR ANKISH

Frontend (`client/`) and backend (`server/`) with SQLite. Vite dev server proxies `/api` to the Python app.

## Layout

- `client/` — React + Vite
- `server/` — Flask app and `server/database/` (SQLite file `site.db` is created on first run)
- `.env` — optional secrets and mail settings at the project root

**Note:** `client/index.html` must sit next to `vite.config.js`. Static files go in `client/public/`.

## Prerequisites

- Node.js 18+
- Python 3.10+

## Backend

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

API base: `http://127.0.0.1:5000` — `GET /api/projects`, `POST /api/contact`, `GET /api/health`.

## Frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment

Edit `.env` for `SECRET_KEY` and optional SMTP (`MAIL_SERVER`, `MAIL_USERNAME`, etc.). If mail is not configured, contact messages are still stored in the database.

## Production build

```bash
cd client
npm run build
```

Serve `client/dist/` and run the backend behind your host or reverse proxy as you prefer.
