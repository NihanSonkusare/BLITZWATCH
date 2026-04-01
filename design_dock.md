# 🎨 Master UI/UX Design Specification — BLITZWATCH

**Document Version:** 1.1
**Last Updated:** 2025

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design System Tokens](#2-design-system-tokens)
3. [Premium Motion & Interaction Stack](#3-premium-motion--interaction-stack)
4. [Global Architecture & Routing](#4-global-architecture--routing)
5. [The HR Studio (Admin Interface)](#5-the-hr-studio-admin-interface)
6. [The Employee Theater (Consumer Interface)](#6-the-employee-theater-consumer-interface)
7. [The Core Engine: Interactive Video & Gamification](#7-the-core-engine-interactive-video--gamification)
8. [Loading States & Skeleton UI](#8-loading-states--skeleton-ui)
9. [Error States](#9-error-states)
10. [Mobile & Responsive Design](#10-mobile--responsive-design)
11. [Accessibility (WCAG 2.1 AA)](#11-accessibility-wcag-21-aa)
12. [Onboarding Flows](#12-onboarding-flows)

---

## 1. Design Philosophy

The platform operates on a **"Two-World"** design system to serve its two distinct user bases without compromise.

### 1.1 For Employees — "The Theater"
The UI must completely erase the feeling of corporate training. It uses a deep dark mode, cinematic full-bleed layouts, and distraction-free viewing to replicate the experience of opening Netflix or Max. The emotional goal is: *"This doesn't feel like work."*

### 1.2 For HR/Admins — "The Studio"
The UI shifts to a clean, high-visibility, data-dense SaaS environment. Think Linear or Vercel's dashboard — minimal chrome, high-information-density, optimized for workflow speed and analytical clarity. The emotional goal is: *"I can see everything I need at a glance."*

### 1.3 Shared Principles
- **Purposeful Motion:** Every animation has a reason. Nothing moves decoratively without aiding comprehension or delight.
- **Progressive Disclosure:** Surface the most important action first. Complexity is hidden until needed.
- **Consistency Over Surprise:** Design tokens (colors, spacing, radii, motion curves) are applied uniformly. Surprises are reserved for micro-interactions, not layout.

---

## 2. Design System Tokens

### 2.1 Color Palette

#### Theater (Employee — Dark Mode)
```css
/* Backgrounds */
--theater-bg-base:        #0A0A0F;   /* True near-black, slight purple tint */
--theater-bg-surface:     #111118;   /* Card surfaces */
--theater-bg-elevated:    #1A1A24;   /* Modals, drawers */

/* Brand / Accent */
--theater-accent-primary: #E8FF47;   /* Electric lime — primary CTAs, progress bars */
--theater-accent-glow:    rgba(232, 255, 71, 0.15); /* Glow halo for accent elements */
--theater-accent-danger:  #FF4747;   /* Quiz failure, error state */
--theater-accent-success: #47FF9E;   /* Quiz success */
--theater-accent-timer:   #FFB347;   /* Timer bar mid-state (yellow) */

/* Text */
--theater-text-primary:   #F0F0F8;
--theater-text-secondary: #8888A0;
--theater-text-muted:     #44445A;

/* Borders */
--theater-border:         rgba(255, 255, 255, 0.06);
--theater-border-glow:    rgba(232, 255, 71, 0.3);
```

#### Studio (HR — Light Mode)
```css
/* Backgrounds */
--studio-bg-base:         #F8F8FB;
--studio-bg-surface:      #FFFFFF;
--studio-bg-elevated:     #FFFFFF;

/* Brand / Accent */
--studio-accent-primary:  #5B4EFF;   /* Deep violet — primary actions */
--studio-accent-secondary:#E8FF47;   /* Lime — secondary highlight (brand continuity) */
--studio-accent-success:  #22C55E;
--studio-accent-danger:   #EF4444;
--studio-accent-warning:  #F59E0B;

/* Text */
--studio-text-primary:    #111118;
--studio-text-secondary:  #555566;
--studio-text-muted:      #9999AA;

/* Borders */
--studio-border:          #E5E5EF;
--studio-border-focus:    #5B4EFF;
```

### 2.2 Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Hero Title | `Bebas Neue` | 400 | 64px–96px |
| Section Heading | `Inter` | 700 | 24px–36px |
| Card Title | `Inter` | 600 | 16px–18px |
| Body | `Inter` | 400 | 14px–16px |
| Data / Mono | `JetBrains Mono` | 400 | 12px–14px |
| Badge / Label | `Inter` | 600 | 11px–12px, uppercase, letter-spacing: 0.08em |

> Load from Google Fonts. Subset to Latin only to reduce bundle size.

### 2.3 Spacing Scale (4px base unit)
```
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
```

### 2.4 Border Radius
| Element | Radius |
|---------|--------|
| Card | `12px` |
| Button (standard) | `8px` |
| Pill / Badge | `999px` |
| Modal | `16px` |
| Avatar | `50%` |
| Input | `8px` |

### 2.5 Motion Curves & Durations
| Use | Curve | Duration |
|-----|-------|----------|
| Page transitions | `easeInOut` | `400ms` |
| Modal enter | `spring(stiffness: 400, damping: 30)` | — |
| Modal exit | `easeIn` | `200ms` |
| Hover scale | `easeOut` | `150ms` |
| Quiz shake (error) | `spring(stiffness: 500, damping: 10)` | — |
| Cursor trail | `spring(stiffness: 150, damping: 15)` | — |

---

## 3. Premium Motion & Interaction Stack

### 3.1 Global Smooth Scroll
**Lenis** is implemented at the root layout (`layout.tsx`) to replace jagged native browser scrolling with fluid, native-feeling scroll physics. Lenis must be initialized after the DOM is mounted (`useEffect`) to avoid SSR hydration mismatches.

### 3.2 Custom Cursor
The default OS cursor is hidden globally (`cursor: none` on `html`). A custom DOM element — a sleek, glowing ring using `--theater-accent-glow` — trails the physical mouse coordinates with a spring-physics delay (stiffness: 150, damping: 15).

**Interaction states:**
- **Default:** Translucent glowing ring, 28px diameter.
- **Hovering a clickable:** Cursor snaps to full opacity and scales up to 40px.
- **Hovering a video thumbnail:** Cursor inverts to `--theater-accent-primary` fill.
- **Hovering a text input:** Cursor shrinks to 6px dot (doesn't compete with the I-beam).

**Fallback:** The custom cursor is disabled entirely when `pointer: coarse` (touch devices) via a CSS media query check.

### 3.3 Page Transitions
Route transitions are handled by Framer Motion's `<AnimatePresence>` wrapping the page component. Each page enters with a `{ opacity: 0, y: 12 } → { opacity: 1, y: 0 }` animation (400ms, easeInOut) and exits with `{ opacity: 0, y: -8 }` (200ms, easeIn).

### 3.4 Staggered List Reveals
On first mount of any content carousel or analytics grid, child elements stagger in with a `0.05s` delay per item using `variants` and `staggerChildren`. This creates a cascading "arrival" effect.

---

## 4. Global Architecture & Routing

### 4.1 Authentication & Role Gateway

A unified login screen with split aesthetics — the left half uses the dark Theater palette, the right half uses the light Studio palette, with a vertical gradient boundary.

Upon successful authentication, role-based middleware (Next.js `middleware.ts`) routes users instantly:
- `role === 'hr'` → `/hr/studio`
- `role === 'employee'` → `/app/theater`

Any attempt to access a route outside one's role returns a 403 page.

### 4.2 Top Navigation Bar (Global)
- **Left:** BLITZWATCH wordmark (Bebas Neue, small caps).
- **Center:** Pill-shaped global search bar. On focus, expands with a smooth width animation and shows recent searches / auto-suggestions.
- **Right:** Notification bell (with animated dot indicator for unread items), user circular avatar (doubles as dropdown: Settings, Help, Sign Out).

### 4.3 Sidebar — Employee Theater
Minimalist, icon + label. Width: 240px expanded, 64px collapsed (toggle button at bottom).

| Item | Icon | Route |
|------|------|-------|
| Browse | Home | `/app/theater` |
| My Assignments | Bookmark | `/app/assignments` |
| My Stats | BarChart2 | `/app/stats` |

### 4.4 Sidebar — HR Studio
Workflow-oriented. Width: 256px (always expanded on desktop).

| Item | Icon | Route |
|------|------|-------|
| Content Studio | Film | `/hr/studio` |
| Casting & Avatars | Users | `/hr/casting` |
| Analytics | TrendingUp | `/hr/analytics` |
| User Management | Settings | `/hr/users` |

---

## 5. The HR Studio (Admin Interface)

*A bright, clean SaaS environment. Think Notion meets Linear.*

### 5.1 Content Ingestion Zone
- **Dropzone:** A full-width, dashed-border dropzone (border: `2px dashed --studio-border`). On hover/drag-over, the border animates to `--studio-accent-primary` with a subtle background fill.
- **Inner content:** Centered upload icon (Lucide `Upload`), headline ("Drop your training PDF or DOCX here"), subtext ("Max 50 MB · PDF and DOCX accepted"), and a secondary "Browse Files" button.
- **During upload:** A horizontal progress bar replaces the subtext. Shows exact % and file name.
- **Rejected files:** Inline error text appears below the dropzone (wrong type / oversized) without a full page alert.

### 5.2 Casting Directory
- **Layout:** Responsive grid (4 columns on desktop, 2 on tablet, 1 on mobile).
- **Card:** Employee headshot (circle crop), name, department, status badge (`Active` / `No Headshot`).
- **Adding a headshot:** Click the card's `+` zone to open a sheet modal with a headshot uploader and face-detection quality check. If the image passes (face detected, resolution ≥ 512×512), a green "Ready for Casting" badge appears.
- **Selection:** Clicking a card toggles a checkmark overlay. Selected cards show a `--studio-accent-primary` ring.

### 5.3 Generation Tracker
A highly visual, step-by-step progress component that updates in real-time via Supabase Realtime.

```
[ ✅ Queued ] → [ ✅ Extracting Text ] → [ ⏳ Writing Script ] → [ — Generating Video ] → [ — Publishing ]
```

- Each step is represented by a node (circle) connected by a line.
- **Completed:** Filled `--studio-accent-success` circle with a checkmark.
- **Active:** Pulsing `--studio-accent-primary` circle with a spinner.
- **Pending:** Empty `--studio-border` circle.
- **Failed:** Filled `--studio-accent-danger` circle with an X, plus a tooltip with the error message and a "Retry" button.
- **Script Preview Gate:** After "Writing Script" completes, the tracker pauses and reveals an expandable script preview panel. HR must click "Approve & Generate Video" to proceed.

### 5.4 Performance Analytics Dashboard

#### Macro View
Line chart (Recharts `<LineChart>`) with:
- X-axis: dates (30/60/90-day toggle in top-right corner of the card).
- Y-axis: completion rate %.
- Line color: `--studio-accent-primary`.
- Hover tooltip: formatted date + completion %.

#### Micro View
Grouped bar chart (Recharts `<BarChart>`) with:
- X-axis: department names (truncated with ellipsis if long).
- Y-axis: average quiz score 0–100.
- Bar fill: gradient from `--studio-accent-primary` to `--studio-accent-secondary`.
- Clicking a bar triggers a smooth expand to show an employee list below the chart.

#### Employee Drilldown Side Drawer
- Opens from the right with a 350ms slide-in (Framer Motion `x: "100%" → x: 0`).
- Header: employee avatar + name + department.
- Metrics displayed as stat cards: Total Watch Time, Quiz Accuracy %, Avg. Response Speed.
- Below stats: a per-module table with completion status, score, and date.
- Close button (X) in top-right, or click outside to dismiss.

---

## 6. The Employee Theater (Consumer Interface)

*Dark, cinematic, zero friction. This should feel like a reward, not a task.*

### 6.1 Hero Banner (Featured Content)
- **Background:** Edge-to-edge video (muted, autoplayed, looped) or high-res still thumbnail with a subtle ken-burns CSS animation.
- **Gradient overlay:** `linear-gradient(to right, rgba(10,10,15,0.95) 35%, transparent 70%)` — text reads clearly on the left without obscuring the visual.
- **Content (left-aligned):**
  - Module title in Bebas Neue, ~72px.
  - Metadata row: runtime pill, episode count pill, "Deadline: [date]" badge (glowing red if within 48 hours).
  - Primary CTA: "▶ Play Episode 1" button (`--theater-accent-primary` background, dark text, 48px height).
  - Secondary CTA: "Add to List" ghost button.

### 6.2 Content Carousels
- **Layout:** Horizontally scrollable rows using CSS `overflow-x: scroll` with custom scrollbar hidden via `::-webkit-scrollbar { display: none }`. Drag-to-scroll via mouse is enabled through a pointer event handler.
- **Row titles:** Section heading above each row (e.g., "Continue Watching").

**Card hover physics:**
- Hovered card: `scale(1.05)`, card shadow glows with `--theater-accent-glow`.
- Adjacent cards: `scale(0.97)` + `opacity(0.6)` — creates a depth/focus effect.
- Transition: `150ms easeOut`.

**Row types:**

| Row | Badge | Notes |
|-----|-------|-------|
| Continue Watching | Neon progress bar at card bottom | Bar color: `--theater-accent-primary`. |
| Up Next (Mandatory) | "DUE [DATE]" badge on card | Deadline badge pulses red if ≤ 48 hrs. |
| Bite-Sized Recaps | "30s" pill | Optional modules. |

### 6.3 My Stats Tab

- **Layout:** Dark-mode cards grid.
- **Quiz Accuracy History:** Recharts `<LineChart>` with `--theater-accent-primary` line, dark background, minimal axes.
- **Speed & Reflexes:** A custom circular gauge (SVG, animated stroke-dashoffset) showing the employee's average quiz response speed percentile vs. company average. A score like "Top 12%" renders with a celebratory particle burst on first load (only once, not on every visit).
- **Streak indicator:** Consecutive days of completing at least one module, shown as a flame icon + count.

---

## 7. The Core Engine: Interactive Video & Gamification

### 7.1 The Cinematic Player

- **Control skin:** Fully custom (no native `<video>` controls). Tailwind + Framer Motion.
- **Layout:** Controls sit in a translucent frosted-glass bar at the bottom. Fade to `opacity: 0` after 3 seconds of mouse inactivity. Fade back in on any mouse movement or touch.
- **Elements:** Play/pause (center), scrub timeline, current time / total time, volume slider (horizontal, appears on hover over volume icon), fullscreen toggle, settings gear (playback speed).
- **Watch-gating:** The scrub handle cannot be dragged past the furthest watched position. Attempting to do so snaps the handle back with a brief shake animation.

### 7.2 Action Check — Quiz Overlay

**Trigger:** Video pauses automatically. The player emits no visual warning before pausing — the interruption itself is part of the design tension.

**Visual hierarchy on pause:**
1. Video frame blurs and dims (`backdrop-filter: blur(8px)`, `brightness(0.4)`).
2. Quiz modal scales in from 80% to 100% with `ease-out-back` spring.

**Modal anatomy:**
- **Top:** Countdown timer bar — full-width, 6px height, positioned at the very top edge of the modal. Color transitions: `--theater-accent-success` → `--theater-accent-timer` (at 50%) → `--theater-accent-danger` (at 20%). Duration is set per-question (default: 15 seconds).
- **Question text:** 18px, semi-bold, centered.
- **Answer options:** 4 pill-shaped buttons in a 2×2 grid. Each highlights with a soft hover glow.
- **Interaction lock:** The modal cannot be dismissed by pressing Escape, clicking outside, or any other shortcut.

**Feedback states:**

| Outcome | Animation | Duration |
|---------|-----------|----------|
| Correct | Modal border flashes `--theater-accent-success`, checkmark scales in, UI chime plays | 1.5s |
| Incorrect / Timeout | Modal shakes (spring, 3 oscillations), incorrect choice turns red, correct answer illuminates in green | 3s hold, then auto-resume |

**After feedback:** Modal scales out (200ms easeIn), blur lifts, video resumes automatically.

---

## 8. Loading States & Skeleton UI

Every data-dependent component must have a defined skeleton state. Do not show spinners for content areas — use skeleton loaders with a shimmer animation.

| Component | Skeleton |
|-----------|----------|
| Carousel card | Rounded rect, shimmer gradient |
| Hero banner | Full-width blurred static frame |
| Analytics chart | Grey rect with chart axis lines |
| Employee drilldown drawer | 3 stat card skeletons + table rows |
| Generation tracker | All nodes in `pending` state with a "Waiting for job..." label |

**Shimmer animation:**
```css
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #1A1A24 25%, #2A2A38 50%, #1A1A24 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 9. Error States

| Scenario | Component | UI |
|----------|-----------|-----|
| Video fails to load | Video player | Centered error card with retry button and error code. |
| Pipeline step fails | Generation tracker | Red node on failed step, tooltip with error message, "Retry Step" button. |
| File upload rejected | Dropzone | Inline error below dropzone with reason (file too large / wrong type). |
| No internet connection | Global | Top-of-page toast: "You're offline. Some features may be unavailable." |
| API timeout on analytics | Chart | Ghost state with "Couldn't load data" message and a "Refresh" button. |
| Quiz state lost (reconnect) | Player | Overlay: "Reconnected — resuming your quiz from the last checkpoint." |

**Error toast spec:** 40px height, `border-radius: 8px`, appears from top-center with a slide-down animation (200ms). Auto-dismisses after 5 seconds. Can be manually closed with an X.

---

## 10. Mobile & Responsive Design

The MVP targets desktop-first but must be functional on mobile browsers.

| Breakpoint | Alias | Target Devices |
|------------|-------|----------------|
| `< 640px` | `sm` | Phones |
| `640–1024px` | `md` | Tablets |
| `> 1024px` | `lg` | Desktops |

### Key Responsive Behaviors
- **Theater Sidebar:** Hidden on mobile; replaced by a bottom navigation bar with 3 icons (Browse, Assignments, Stats).
- **Studio Sidebar:** Collapses to a hamburger-triggered drawer on tablet/mobile.
- **Hero Banner:** Stack layout on mobile: thumbnail top, text below (no horizontal gradient overlay).
- **Carousels:** Horizontal scroll is preserved on mobile; drag-to-scroll uses touch events.
- **Quiz Overlay:** Full-screen on mobile (modal takes 100vw × 100vh).
- **Custom Cursor:** Disabled entirely on touch devices (`pointer: coarse` media query).
- **Analytics Charts:** Switch from side-by-side layout to stacked single-column on `< 1024px`.

---

## 11. Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard navigation** | All interactive elements are reachable via Tab. Focus ring: `2px solid --theater-accent-primary / --studio-accent-primary` with a `2px` offset. |
| **Screen reader support** | Semantic HTML (`<nav>`, `<main>`, `<section>`, `<button>`). ARIA labels on icon-only buttons. |
| **Quiz timer** | An `aria-live="assertive"` region announces "10 seconds remaining" and "5 seconds remaining". |
| **Quiz feedback** | Color + icon + text label — never color alone. |
| **Closed captions** | All generated videos include WebVTT captions derived from the LLM script. |
| **Reduced motion** | All Framer Motion animations check `useReducedMotion()`. Lenis is disabled when reduced motion is preferred (falls back to native scroll). |
| **Color contrast** | All text on `--theater-bg-base` must meet a 4.5:1 contrast ratio (AA). `--theater-text-primary` (#F0F0F8) on `#0A0A0F` = 18.3:1 ✅ |
| **Touch targets** | Minimum 44×44px touch target on all interactive elements. |

---

## 12. Onboarding Flows

### 12.1 First-Time HR Admin

After first login, a dismissible **welcome modal** appears with 3 steps:
1. "Upload your first training document" — arrow pointing to the dropzone.
2. "Add employee headshots to the Casting Directory."
3. "Sit back while we generate your first episode."

A persistent **progress stepper** at the top of the Studio tracks these 3 steps until all are complete. Disappears permanently once completed.

### 12.2 First-Time Employee

After first login, a brief **3-slide onboarding carousel** appears (modal, full-screen):
1. "Your training, reimagined." — Preview of the Theater UI.
2. "Watch. Earn. Compete." — Explains quizzes and the Stats tab.
3. "Your first assignment is ready." — CTA to close and start watching.

Employees can skip at any point. The carousel is only shown once (persisted in localStorage + database).
