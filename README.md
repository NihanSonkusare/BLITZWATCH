# BLITZWATCH

> AI-powered corporate training platform. Transforms dry PDFs into cinematic, gamified video episodes starring your own employees.

## Project Structure

```
BLITZWATCH/
├── frontend/        # Next.js 14 (App Router) — Employee Theater + HR Studio
├── backend/         # FastAPI + Celery — AI pipeline & API
├── design_dock.md   # Master UI/UX Design Specification
├── prd.md           # Product Requirements Document
└── tech_stack.md    # Full technology stack reference
```

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker (for local Supabase + Redis)

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local  # fill in Supabase URL + anon key
npm run dev                        # http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate             # Windows
pip install -r requirements.txt
cp .env.example .env               # fill in secrets
uvicorn app.main:app --reload      # http://localhost:8000
```

## Environment Strategy

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| `development` | localhost:3000 | localhost:8000 | Supabase local (Docker) |
| `staging` | Vercel Preview URL | Railway staging | Supabase staging project |
| `production` | app.blitzwatch.io | Railway prod | Supabase production project |

> ⚠️ **Never commit `.env` or `.env.local` files.** Use `.env.example` and `.env.local.example` as templates.
