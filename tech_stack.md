# 🛠️ Tech Stack — BLITZWATCH

This document outlines every technology, framework, library, and API powering the platform. The stack is optimized for rapid AI generation, scalable video delivery, real-time UI updates, and a seamless two-sided user experience.

---

## Table of Contents
1. [Frontend](#1--frontend)
2. [Backend](#2--backend)
3. [Async Job Pipeline](#3--async-job-pipeline)
4. [Database, Auth & Storage](#4--database-auth--storage)
5. [Generative AI Pipeline](#5--generative-ai-pipeline)
6. [Video Delivery & CDN](#6--video-delivery--cdn)
7. [Motion & Animation Stack](#7--motion--animation-stack)
8. [Development & Tooling](#8--development--tooling)
9. [Monitoring & Observability](#9--monitoring--observability)
10. [Environment Strategy](#10--environment-strategy)
11. [Dependency Quick-Reference](#11--dependency-quick-reference)

---

## 1. 🎨 Frontend

The visual layer is built for speed and aesthetics — a cinematic dark-mode **Theater** for employees and a clean, data-rich **Studio** for HR.

| Concern | Choice | Why |
|---------|--------|-----|
| Framework | **Next.js 14** (App Router) | RSC, file-based routing, Vercel-native deployment, image optimization. |
| Styling | **Tailwind CSS v3** | Utility-first; pairs cleanly with shadcn/ui if needed. |
| State Management | **React Context + Hooks** | Sufficient for MVP; promotes simplicity over Redux overhead. |
| Forms | **React Hook Form** | Performant, minimal re-renders, schema validation via Zod. |
| Data Visualization | **Recharts** | Composable, React-native charting with responsive containers. |
| Real-time Updates | **Supabase Realtime** (client SDK) | Drives the live Generation Tracker without polling. |
| Icons | **Lucide React** | Clean, consistent, tree-shakable SVG icons. |
| Deployment | **Vercel** | Zero-config, preview deployments per PR, built-in analytics. |

> **Note on State Management:** If quiz state, player state, and auth state grow complex, migrate to **Zustand** (lightweight, no provider boilerplate) before reaching for Redux.

---

## 2. ⚙️ Backend

A lightweight, high-performance API responsible for routing requests, validating uploads, triggering the AI pipeline, and serving analytics queries.

| Concern | Choice | Why |
|---------|--------|-----|
| Framework | **FastAPI** (Python 3.11+) | Async-native, automatic OpenAPI docs, Pydantic validation. |
| ASGI Server | **Uvicorn** with **Gunicorn** | Production-grade process management; Gunicorn spawns Uvicorn workers. |
| Document Parsing | **pymupdf** (`fitz`) | ⚠️ Use this instead of `PyPDF2` — PyPDF2 is unmaintained and archived. pymupdf is faster, handles complex layouts, and supports OCR fallback. |
| HTTP Client | **httpx** (async) | Non-blocking external API calls to HeyGen, Anthropic, etc. Use `httpx.AsyncClient` with connection pooling. |
| Validation | **Pydantic v2** | Data models, settings management, and request body validation. |
| File Upload | **Stream directly to Supabase Storage** | Never buffer the entire file in backend memory. Use chunked multipart upload. |
| Deployment | **Railway** or **Render** | Dockerfile-based, simple scaling, environment management. |

---

## 3. 🔄 Async Job Pipeline

The AI generation process (PDF → Script → Video) is **too slow for a synchronous HTTP request** — it will take 2–10 minutes. It must run as a background job.

| Concern | Choice | Why |
|---------|--------|-----|
| Task Queue | **Celery** | Battle-tested Python task queue with retry logic, ETA, and rate limiting. |
| Message Broker | **Redis** | Low-latency, supports Celery's result backend. Also handles caching. |
| Job Status Updates | **Supabase Realtime** | Celery workers update a `pipeline_jobs` table in Supabase; the frontend subscribes to row changes and updates the Generation Tracker in real-time. |
| Redis Hosting | **Upstash Redis** (serverless) | Pay-per-request pricing; zero ops overhead for MVP. |

### Pipeline Job Flow

```
1. HR uploads PDF  →  FastAPI validates & stores file in Supabase Storage
2. FastAPI creates a `pipeline_jobs` row (status: 'queued') & enqueues Celery task
3. Celery Worker picks up task:
   a. EXTRACT:  pymupdf parses PDF text
   b. SCRIPT:   Claude API generates 30s episode script + quiz questions
   c. REVIEW:   (Optional) HR approval gate — job pauses until HR approves script
   d. VIDEO:    HeyGen/Runway API call with script + avatar image
   e. PUBLISH:  Video URL written to `episodes` table; module status → 'live'
4. At each step, worker updates `pipeline_jobs.status` → Supabase Realtime fires → frontend updates
5. On any failure: Celery retries up to 3× with exponential back-off; final failure sets status 'failed' + error_message
```

---

## 4. 🗄️ Database, Auth & Storage

A unified Backend-as-a-Service approach to securely manage users, roles, relational data, file storage, and real-time subscriptions.

| Concern | Choice | Detail |
|---------|--------|--------|
| Platform | **Supabase** | PostgreSQL + Auth + Storage + Realtime in one managed service. |
| Database | **PostgreSQL 15** | Strong relational model for analytics queries. |
| Auth | **Supabase Auth** | Email/password for MVP. JWT-based sessions. |
| RBAC | **Supabase Row Level Security (RLS)** | Enforce data access at the database layer, not just the API layer. Employees can only SELECT their own `quiz_attempts` and `watch_events`. |
| Storage Buckets | Three buckets: `source-documents`, `avatar-headshots`, `generated-videos` | `generated-videos` bucket uses signed URLs with 4-hour expiry to prevent link sharing. |
| Realtime | **Supabase Realtime** (PostgreSQL CDC) | Subscribed by frontend to `pipeline_jobs` table for live generation tracker. |

### Key RLS Policies (Pseudocode)

```sql
-- Employees can only read their own quiz attempts
CREATE POLICY "employee_own_attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = employee_id);

-- Employees cannot read other employees' watch events
CREATE POLICY "employee_own_watch" ON watch_events
  FOR SELECT USING (auth.uid() = employee_id);

-- HR can read all records in their company
CREATE POLICY "hr_full_access" ON quiz_attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'hr')
  );
```

---

## 5. 🤖 Generative AI Pipeline

The core intelligence layer that transforms dry text into engaging episodic video content.

### 5.1 Text & Logic (LLM)

| Concern | Choice | Model |
|---------|--------|-------|
| Primary LLM | **Anthropic Claude** | `claude-sonnet-4-5` (balance of speed/quality for script generation) |
| Fallback LLM | **OpenAI GPT-4o** | For pipeline resilience if Anthropic rate limits |

**Prompt Responsibilities:**
- **Chunking:** Split long PDFs into thematic chunks of ~500 tokens each.
- **Scripting:** Convert each chunk into a narrated, 30-second episode script (≈ 75 words). Enforce with max_tokens budget.
- **Quiz Generation:** For each episode, generate 1–3 multiple-choice questions with distractors. Output structured JSON: `{ question, options[4], correct_index, suggested_timestamp_s }`.

> ⚠️ **Hallucination Guard:** Always instruct the LLM to generate quizzes *only* from the provided text chunk (ground-truth-only prompting). HR reviews all scripts before video rendering begins.

### 5.2 Video Generation

| Provider | API | Best For |
|----------|-----|----------|
| **HeyGen** (primary) | REST API, async job | Highest avatar fidelity, most natural lip-sync. |
| **Runway** (fallback) | REST API | Strong alternative if HeyGen is unavailable. |
| **Luma** (tertiary) | REST API | Fast generation, slightly lower fidelity. |

**Multi-Provider Strategy:** Configure providers as an ordered fallback list in environment variables. If Provider 1 returns an error or times out after 5 minutes, the Celery task automatically retries with Provider 2.

### 5.3 Document Parsing

```python
# Preferred: pymupdf (NOT PyPDF2 — it is archived and unmaintained)
import fitz  # pymupdf

def extract_text(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text("text")
    # Fallback to OCR if text layer is empty
    if len(text.strip()) < 50:
        text = extract_via_ocr(file_path)  # use pytesseract + fitz rasterize
    return text
```

---

## 6. 📹 Video Delivery & CDN

Generated video files must be served with low latency to employees globally.

| Concern | Choice | Notes |
|---------|--------|-------|
| Video Hosting (MVP) | **Supabase Storage** | Acceptable for MVP at low scale. Videos are stored in the `generated-videos` bucket. |
| CDN / Scaling Option | **Cloudflare Stream** | Recommended for v1.1+. Handles adaptive bitrate streaming (HLS), global edge delivery, and per-video analytics. |
| URL Security | **Signed URLs** (Supabase) | Generated video URLs expire after 4 hours. Employees must be authenticated to obtain a fresh URL. |
| Thumbnail Generation | **FFmpeg** (server-side) | Extract a frame at 1 second into the video as the episode thumbnail. Run as a post-generation Celery step. |

---

## 7. 🎬 Motion & Animation Stack

To achieve the fluid, cinematic aesthetic — not just a styled CRUD app.

| Library | Role | Usage |
|---------|------|-------|
| **Framer Motion** | React animation engine | Page transitions (`<AnimatePresence>`), quiz modal scale-in, staggered carousel card reveals, error shake animation. |
| **Lenis** | Smooth scroll | Applied at the root layout. Replaces default browser scroll with physics-based momentum scrolling. |
| **Lucide React** | Icon system | All UI icons. Tree-shakable. Pairs well with Framer Motion for animated icon state changes. |
| **Custom Cursor** | Brand identity | A global React context (`CursorProvider`) tracks `clientX`/`clientY` and renders a custom DOM element (glowing ring) with `spring` physics delay. Falls back to default cursor on touch devices via `pointer: coarse` media query. |

### Reduced Motion Accessibility

All Framer Motion animations must respect the `prefers-reduced-motion` system setting:

```tsx
import { useReducedMotion } from "framer-motion";

const shouldReduce = useReducedMotion();
const transition = shouldReduce ? { duration: 0 } : { type: "spring", stiffness: 300 };
```

---

## 8. 🏗️ Development & Tooling

### Agent-Assisted Development ("Vibe Coding" Stack)

| Tool | Role |
|------|------|
| **Claude Code** | Terminal-based agentic coding for backend logic, migrations, and API route scaffolding. |
| **Stitch MCP** | Connects Google Stitch UI designs directly to coding agents via MCP, enabling instant extraction of layouts, CSS tokens, and component structures. |
| **Antigravity** | Visual/UI agent for Next.js — manages UI testing, component generation, and async agent planning via the Browser Agent. |

### Code Quality

| Tool | Purpose |
|------|---------|
| **ESLint + Prettier** | Frontend code linting and formatting. |
| **Ruff** | Python linting and formatting (replaces flake8 + black). |
| **pytest** | Backend unit and integration tests. Target ≥ 70% coverage on pipeline logic. |
| **Playwright** | End-to-end browser tests for critical flows: login, upload, video playback, quiz. |

---

## 9. 📊 Monitoring & Observability

| Concern | Tool | Notes |
|---------|------|-------|
| Frontend Error Tracking | **Sentry** (Next.js SDK) | Captures JS exceptions, performance traces. |
| Backend Error Tracking | **Sentry** (Python SDK) | Attaches to FastAPI middleware; captures unhandled exceptions + Celery task failures. |
| Frontend Performance | **Vercel Analytics** | Core Web Vitals (LCP, CLS, FID) per route. |
| Celery Job Monitoring | **Flower** | Web UI for Celery — inspect active/failed/queued tasks in real-time. Run internally, not publicly exposed. |
| Uptime Monitoring | **Better Uptime** or **UptimeRobot** | Alert on-call if `/health` endpoint returns non-200. |

---

## 10. 🌍 Environment Strategy

Three environments with full parity:

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| `development` | `localhost:3000` | `localhost:8000` | Supabase local (Docker) |
| `staging` | Vercel Preview URL | Railway staging service | Supabase staging project |
| `production` | `app.blitzwatch.io` | Railway production service | Supabase production project |

All secrets (API keys, DB URLs) are managed via environment variables. **No secrets are committed to Git.** Use `.env.local` locally and the hosting platform's secret manager in staging/production.

---

## 11. 📦 Dependency Quick-Reference

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "tailwindcss": "^3.x",
    "framer-motion": "^11.x",
    "@studio-freight/lenis": "^1.x",
    "lucide-react": "^0.x",
    "recharts": "^2.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@supabase/supabase-js": "^2.x"
  }
}
```

### Backend (`requirements.txt`)
```
fastapi>=0.111
uvicorn[standard]>=0.29
gunicorn>=22.0
pymupdf>=1.24          # PDF parsing — use this, NOT PyPDF2
httpx>=0.27
pydantic>=2.7
celery>=5.4
redis>=5.0
supabase>=2.5
pytesseract>=0.3       # OCR fallback
Pillow>=10.3           # Image validation for headshots
python-multipart>=0.0.9  # Multipart file upload support
sentry-sdk[fastapi]>=2.x
```
