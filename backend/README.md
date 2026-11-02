# Backend — Rosestar Farm API

Express REST API that connects the Rosestar React frontend to Supabase (PostgreSQL).

## Setup

```bash
npm install
cp .env.example .env
# Fill in your Supabase credentials in .env
npm run dev
```

## Environment Variables

See `.env.example` for required variables.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Server health check |
| GET/POST | /api/batches | List / create batches |
| GET/PUT/DELETE | /api/batches/:id | Get / update / delete batch |
| GET/POST | /api/weights | Weight records |
| DELETE | /api/weights/:id | Delete weight record |
| GET/POST | /api/feeds | Feed transactions |
| DELETE | /api/feeds/:id | Delete feed record |
| GET/POST | /api/health-events | Health/vaccination events |
| PATCH | /api/health-events/:id/toggle | Toggle status |
| DELETE | /api/health-events/:id | Delete health event |
| GET/POST | /api/deaths | Mortality records |
| DELETE | /api/deaths/:id | Delete death record |
| GET/POST | /api/finances | Expenses & sales |
| DELETE | /api/finances/:id | Delete finance record |

## Deploy to Render

1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect the `roster` repository
4. Set **Root Directory** to `backend`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `node server.js`
7. Add environment variables from `.env`
