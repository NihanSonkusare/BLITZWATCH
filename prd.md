# Product Requirements Document (PRD)

**Project Name:** BLITZWATCH
**Document Version:** 1.1 (MVP)
**Last Updated:** 2025
**Product Vision:** To eradicate boring corporate training by transforming dry manuals into highly engaging, gamified, bite-sized video episodes starring the employees themselves.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [User Personas](#2-user-personas)
3. [Scope](#3-scope)
4. [Core Features & Functional Requirements](#4-core-features--functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Models (High-Level)](#6-data-models-high-level)
7. [Error Handling & Edge Cases](#7-error-handling--edge-cases)
8. [Accessibility & Compliance](#8-accessibility--compliance)
9. [Technical Architecture (MVP Stack)](#9-technical-architecture-mvp-stack)
10. [Success Metrics (KPIs)](#10-success-metrics-kpis)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Out of Scope (MVP)](#12-out-of-scope-mvp)

---

## 1. Executive Summary

### The Problem
Corporate training is suffering from an attention crisis. Companies spend billions on Learning & Development, but rely on static, dense PDFs and long-form videos. Employees treat these as a mandatory chore, resulting in low engagement and near-zero knowledge retention.

### The Solution
A two-sided, AI-powered platform. HR teams upload standard training PDFs and employee headshots. The AI engine processes the text, scripts engaging 30-second episodes, and generates a video using the employee's AI avatar. Employees log into a **Netflix-style** dashboard to watch their personalized episodes, which feature interactive timed quizzes to enforce active learning.

### What Makes It Different
Unlike traditional LMS platforms (Cornerstone, Workday Learning), BLITZWATCH is consumer-grade in feel. It doesn't look like enterprise software — it looks like something employees *want* to open.

---

## 2. User Personas

### Persona A — The Creator (HR / L&D Admin)
| Attribute | Detail |
|-----------|--------|
| **Goal** | Create engaging training material quickly; prove training ROI to leadership. |
| **Pain Points** | Existing authoring tools are too complex; employees ignore current materials; compliance is hard to verify. |
| **Success Looks Like** | Uploads a PDF in under 2 minutes and gets a publishable video episode in under 15 minutes. |
| **Device** | Desktop (Chrome/Edge). |

### Persona B — The Consumer (Employee)
| Attribute | Detail |
|-----------|--------|
| **Goal** | Complete mandatory training as painlessly and quickly as possible. |
| **Pain Points** | Training feels like punishment; slide decks are boring and irrelevant to daily work. |
| **Success Looks Like** | Watches a 30-second episode with a colleague's face delivering the content, answers 1–2 quiz questions, and feels done. |
| **Device** | Desktop or mobile browser (Chrome/Safari). |

---

## 3. Scope

### In Scope (MVP)
- HR admin CRUD for training content and employee headshots.
- AI-driven text extraction → script generation → video rendering pipeline.
- Employee-facing Netflix-style content library and custom video player.
- Timed, interactive multiple-choice quizzes embedded in the video player.
- Analytics dashboard for HR: quiz scores, completion rates, per-employee drilldown.
- Role-based authentication (HR and Employee roles only).

### Out of Scope (MVP)
- Native mobile app (iOS/Android). Web-responsive only.
- Manager/team-lead role with partial analytics access.
- Third-party SSO / SAML integration (deferred to v1.2).
- Bulk user import via CSV.
- Custom branding per company tenant (multi-tenancy is single-tenant for MVP).
- In-platform video editing or re-takes.
- Automated reminder / push notification emails to employees.
- Offline video download.

---

## 4. Core Features & Functional Requirements

### 4.1 Authentication & Role-Based Access Control

| ID | Requirement |
|----|-------------|
| REQ-Auth-01 | The system must support email/password registration and login. |
| REQ-Auth-02 | The system must implement RBAC with exactly two roles: `hr` and `employee`. |
| REQ-Auth-03 | On login, users must be automatically routed: `hr` → `/hr/studio`; `employee` → `/app/theater`. |
| REQ-Auth-04 | Sessions must persist across page refreshes using secure, HTTP-only cookies. |
| REQ-Auth-05 | A user with the `employee` role must not be able to access any `/hr/*` route (enforced at both frontend middleware and backend API level). |
| REQ-Auth-06 | Password reset via email must be supported. |

---

### 4.2 The HR Studio (Admin Dashboard)

#### 4.2.1 Content Ingestion

| ID | Requirement |
|----|-------------|
| REQ-HR-01 | HR must be able to upload source documents (PDF, DOCX) via a drag-and-drop zone or a standard file picker. |
| REQ-HR-02 | Accepted file types: `.pdf`, `.docx`. Maximum file size: **50 MB**. |
| REQ-HR-03 | Upload progress must be visible. The system must gracefully handle network interruptions with a retry mechanism. |
| REQ-HR-04 | On upload, the system must immediately begin the AI generation pipeline and display the **Generation Tracker** (see REQ-HR-08). |

#### 4.2.2 Casting Directory

| ID | Requirement |
|----|-------------|
| REQ-HR-05 | HR must be able to upload employee headshots (JPEG/PNG, max 5 MB each) to a searchable Casting Directory. |
| REQ-HR-06 | Each headshot entry must be associated with an employee name and employee ID. |
| REQ-HR-07 | HR must be able to select one or more employees from the Casting Directory to be "cast" in a generated video. |

#### 4.2.3 Generation Pipeline

| ID | Requirement |
|----|-------------|
| REQ-HR-08 | A real-time **Generation Tracker** UI must display the current step of the AI pipeline. Steps (in order): `Queued → Extracting Text → Writing Script → Generating Video → Publishing`. |
| REQ-HR-09 | The tracker must update in real-time via WebSocket or Supabase Realtime without a page refresh. |
| REQ-HR-10 | If any pipeline step fails, the tracker must display a clear error state with the failed step highlighted and an actionable error message. |
| REQ-HR-11 | HR must be able to preview the generated video and approve/reject it before it is published to employees. |

#### 4.2.4 Performance Analytics Dashboard

| ID | Requirement |
|----|-------------|
| REQ-HR-12 | The dashboard must display a **line graph** showing overall company-wide module completion rates over 30/60/90-day rolling windows (selectable). |
| REQ-HR-13 | The dashboard must display a **bar chart** showing average quiz scores per department. |
| REQ-HR-14 | Clicking any department bar must drill down to a list of employees within that department and their individual scores. |
| REQ-HR-15 | Clicking any individual employee must open a **side drawer** displaying: total watch time, quiz accuracy %, average question response time (ms), and a per-module breakdown. |
| REQ-HR-16 | All analytics data must be exportable as a CSV. |

---

### 4.3 The Employee Theater (Consumer Dashboard)

#### 4.3.1 Content Library

| ID | Requirement |
|----|-------------|
| REQ-EMP-01 | The home view must display a **Hero Banner** for the highest-urgency assigned module (auto-playing muted preview, title, deadline badge, total runtime). |
| REQ-EMP-02 | Below the hero, the library must display horizontal, drag-scrollable carousels. Required rows: `Continue Watching`, `Up Next (Mandatory)`, `Bite-Sized Recaps (Optional)`. |
| REQ-EMP-03 | Each carousel card must display a thumbnail, episode title, duration, and a progress bar if partially watched. |

#### 4.3.2 Video Player

| ID | Requirement |
|----|-------------|
| REQ-EMP-04 | The video player must be a custom-skinned player (not a default browser player). |
| REQ-EMP-05 | Player controls (play/pause, scrub bar, volume, fullscreen) must auto-hide after 3 seconds of mouse inactivity and reappear on mouse movement. |
| REQ-EMP-06 | Resume playback: if an employee closes and re-opens a module, playback must resume from within 3 seconds of where they left off. |
| REQ-EMP-07 | Employees must **not** be able to scrub forward past un-watched portions of the video (watch-gating). |

#### 4.3.3 Interactive Quizzes (Action Checks)

| ID | Requirement |
|----|-------------|
| REQ-EMP-08 | At timestamps defined during AI generation, the video must **automatically pause** and present a multiple-choice quiz overlay. |
| REQ-EMP-09 | Each question must display a visible **countdown timer bar** starting at **15 seconds** (configurable per module at generation time, range: 5–30 s). |
| REQ-EMP-10 | If the employee answers correctly before time expires: play a success animation, briefly flash the correct answer in green, resume video automatically. |
| REQ-EMP-11 | If the employee answers incorrectly or the timer expires: play an error animation, highlight the correct answer for 3 seconds, log the failure event to the database, then resume the video. |
| REQ-EMP-12 | Employees must not be able to skip or dismiss the quiz overlay without answering or waiting for timeout. |

#### 4.3.4 Personal Stats

| ID | Requirement |
|----|-------------|
| REQ-EMP-13 | A **My Stats** tab must display the employee's own quiz accuracy history (line graph) and a "Speed & Reflexes" score derived from average question response time. |
| REQ-EMP-14 | A visual progress indicator must show completion percentage across the employee's full assigned curriculum. |

---

## 5. Non-Functional Requirements

### 5.1 Performance
| ID | Requirement |
|----|-------------|
| REQ-NF-01 | Initial page load (First Contentful Paint) must be under **2.5 seconds** on a standard broadband connection. |
| REQ-NF-02 | Video playback must begin buffering within **1 second** of the user pressing Play. |
| REQ-NF-03 | API response times for dashboard data queries must be under **500 ms** at p95. |
| REQ-NF-04 | The AI generation pipeline (PDF → published video) must complete in under **10 minutes** for a standard 10-page document. |

### 5.2 Scalability
| ID | Requirement |
|----|-------------|
| REQ-NF-05 | The MVP must support up to **500 concurrent employees** on the platform without degradation. |
| REQ-NF-06 | File uploads must be streamed directly to cloud storage — they must never be buffered entirely in backend memory. |

### 5.3 Security
| ID | Requirement |
|----|-------------|
| REQ-NF-07 | All data in transit must be encrypted via TLS 1.2+. |
| REQ-NF-08 | File upload endpoints must validate MIME type server-side (not just by extension) to prevent malicious file uploads. |
| REQ-NF-09 | Supabase Row-Level Security (RLS) policies must enforce that employees can only query their own quiz results and watch history. |
| REQ-NF-10 | Generated video URLs must be signed/time-limited to prevent unauthorized sharing. |
| REQ-NF-11 | No personally identifiable information (employee headshots, names) may be logged in plaintext to application logs. |

### 5.4 Reliability
| ID | Requirement |
|----|-------------|
| REQ-NF-12 | The AI generation pipeline must be idempotent — a retried job must not create duplicate videos. |
| REQ-NF-13 | Failed pipeline jobs must be retried up to 3 times with exponential back-off before marking as permanently failed. |
| REQ-NF-14 | The platform must target **99.5% monthly uptime** (excluding planned maintenance). |

---

## 6. Data Models (High-Level)

### Core Entities

```
User            { id, email, role ('hr'|'employee'), department_id, avatar_url, created_at }
Department      { id, name, company_id }
TrainingModule  { id, title, source_file_url, script, status, created_by_hr_id, deadline, created_at }
Episode         { id, module_id, video_url, thumbnail_url, duration_s, quiz_timestamps[] }
QuizQuestion    { id, episode_id, timestamp_s, question_text, options[], correct_index, time_limit_s }
Assignment      { id, module_id, employee_id, due_date, assigned_by }
WatchEvent      { id, episode_id, employee_id, watch_time_s, completed, last_position_s, created_at }
QuizAttempt     { id, question_id, employee_id, selected_index, correct, response_time_ms, created_at }
AvatarAsset     { id, employee_id, image_url, uploaded_by_hr_id, created_at }
```

---

## 7. Error Handling & Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Uploaded PDF is password-protected | Pipeline immediately fails with a descriptive error: "This PDF is password-protected. Please upload an unlocked version." |
| Uploaded PDF contains only scanned images (no text layer) | Pipeline notifies HR: "No extractable text found. OCR processing will be attempted." If OCR fails, prompt manual upload of text. |
| Video generation API (HeyGen/Runway) returns an error | Job retries up to 3×; if all fail, HR is notified with a "Try Again" button and support reference code. |
| Employee loses internet mid-quiz | On reconnection, the quiz state (current question and timer) must be restored from server state, not reset. |
| LLM generates a script exceeding the target 30-second runtime | Backend must enforce a token budget during script generation and re-prompt if exceeded. |
| Two HR admins upload the same PDF simultaneously | The deduplication check (hash of file content) must prevent duplicate pipeline jobs. |

---

## 8. Accessibility & Compliance

| ID | Requirement |
|----|-------------|
| REQ-A11y-01 | The platform must target **WCAG 2.1 AA** compliance. |
| REQ-A11y-02 | All interactive elements must be keyboard-navigable with a visible focus ring. |
| REQ-A11y-03 | All video content must include auto-generated closed captions derived from the LLM-generated script. |
| REQ-A11y-04 | The quiz countdown timer must have an ARIA live region that announces remaining time at 10 s and 5 s remaining. |
| REQ-A11y-05 | Color must not be the sole means of conveying quiz feedback (correct/incorrect); icon + text labels must accompany color signals. |
| REQ-A11y-06 | The platform must respect `prefers-reduced-motion` — all non-essential animations must be disabled when this media query is active. |

---

## 9. Technical Architecture (MVP Stack)

*(See `tech_stack.md` for full detail.)*

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lenis.
- **Backend:** FastAPI (Python), Uvicorn, Redis + Celery for async job queue.
- **Database & Auth:** Supabase (PostgreSQL + Auth + Storage + Realtime).
- **AI Pipeline:** Claude (Anthropic) for script + quiz generation; HeyGen/Runway for video synthesis.
- **Monitoring:** Sentry (error tracking), Vercel Analytics (frontend performance).
- **Deployment:** Vercel (frontend), Railway or Render (FastAPI backend).

---

## 10. Success Metrics (KPIs)

| KPI | Definition | MVP Target |
|-----|-----------|------------|
| **Time-to-Creation** | Minutes from PDF upload to a publishable episode | ≤ 10 min |
| **Completion Rate** | % of assigned videos watched to 100% completion | ≥ 70% |
| **Quiz Accuracy** | Average correct answer rate across all quiz attempts | ≥ 65% |
| **DAU / MAU Ratio** | Signal of habit formation among employees | ≥ 20% |
| **Pipeline Success Rate** | % of jobs that complete without manual retry | ≥ 95% |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Video generation API is slow/unreliable | Medium | High | Build multi-provider fallback: try HeyGen → Runway → Luma in sequence. Implement timeout + retry. |
| LLM-generated scripts are inaccurate or hallucinated | Medium | High | HR must review and approve every script before video rendering begins (REQ-HR-11). |
| Employee headshot quality is too low for avatar synthesis | High | Medium | Implement image quality validation (resolution, face detection) at upload time with clear guidance. |
| Supabase Realtime causes memory leaks on the client | Low | Medium | Unsubscribe from all realtime channels in component cleanup functions. |
| Video streaming costs exceed budget at scale | Medium | Medium | Implement per-user daily view limits and CDN caching. Explore self-hosted video delivery via Cloudflare Stream. |
| GDPR / DPDP compliance for storing employee biometric-adjacent data (headshots) | Medium | High | Add explicit consent collection at headshot upload, document data retention policy, and ensure right-to-erasure. |

---

## 12. Out of Scope (MVP)

The following are documented here to prevent scope creep and will be considered for v1.2+:

- Native mobile apps (iOS/Android).
- SSO / SAML integration with enterprise identity providers (Okta, Azure AD).
- Multi-tenancy / company-level custom branding.
- Manager role with team-level (not company-wide) analytics access.
- Bulk user provisioning via CSV or SCIM.
- Automated email reminders for overdue training.
- In-platform script editing or video re-takes by HR.
- Offline mode / video download.
- Leaderboards or peer-visible gamification elements.
