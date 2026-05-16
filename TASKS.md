# PetAI — Task Board

> Last updated: 2026-05-16
> Sprint: One-Evening Investor Demo

---

## 🔴 High Priority — Blocking Demo

| Task | Owner | Branch | Status |
|------|-------|--------|--------|
| Landing page hero + CTA | Dev 1 | `feature/landing-page` | ✅ Done |
| App layout + sidebar navigation | Dev 1 | `feature/app-layout` | ✅ Done |
| Dashboard page | Dev 2 | `feature/pet-dashboard` | ✅ Done |
| AI Assistant chat UI | Dev 2 | `feature/ai-health-assistant` | ✅ Done |
| Lab Results + AI analysis display | Dev 2 | `feature/lab-analysis` | ✅ Done |
| Health Timeline | Dev 2 | `feature/health-timeline` | ✅ Done |
| Reminders page | Dev 2 | `feature/reminders` | ✅ Done |
| Vet Report page | Dev 2 | `feature/vet-report` | ✅ Done |
| Mock data (all datasets) | Dev 2 | `chore/mock-data` | ✅ Done |
| Demo mode banner | Dev 1 | `feature/demo-mode` | ✅ Done |

---

## 🟡 Medium Priority — Polish Before Demo

| Task | Owner | Branch | Status |
|------|-------|--------|--------|
| Mobile responsiveness test | Dev 1 | `fix/mobile-layout` | ⬜ Todo |
| Pet switcher in sidebar | Dev 2 | `feature/pet-switcher` | ⬜ Todo |
| Vercel deployment | Dev 1 | - | ⬜ Todo |
| Animated transitions between pages | Dev 1 | `feature/page-transitions` | ⬜ Todo |
| Waitlist email input on landing | Dev 1 | `feature/waitlist` | ⬜ Todo |
| Health score animated ring | Dev 2 | `fix/health-score-animation` | ⬜ Todo |

---

## 🟢 Low Priority — Nice to Have

| Task | Owner | Branch | Status |
|------|-------|--------|--------|
| Dark mode | Dev 1 | `feature/dark-mode` | ⬜ Todo |
| Second pet (Mochi) profile | Dev 2 | `feature/multi-pet` | ⬜ Todo |
| Lab report upload drag & drop UI | Dev 2 | `feature/lab-upload` | ⬜ Todo |
| Print/export vet report | Dev 2 | `feature/report-export` | ⬜ Todo |
| Favicon + OG image | Dev 1 | `chore/assets` | ⬜ Todo |

---

## Developer 1 Responsibilities

**Focus:** Visual polish, landing page, app shell, deployment

- Landing page (`src/app/page.tsx`)
- App layout, sidebar, header (`src/components/layout/`)
- Demo mode banner
- Waitlist section
- Mobile responsiveness
- Vercel deploy + custom domain
- Favicon, OG tags, SEO metadata
- Dark mode (if time allows)

---

## Developer 2 Responsibilities

**Focus:** Data-driven screens, AI features, mock content

- Dashboard page
- AI Assistant chat
- Lab Results + analysis display
- Health Timeline
- Reminders page
- Vet Report page
- All mock data (`src/data/`)
- Health components (score, timeline, labs)
- Pet profile component
- Second pet support (if time allows)

---

## Independent Tasks (No Conflict Risk)

These can be done simultaneously without merge conflicts:

| Task | Files touched |
|------|--------------|
| Dev 1: Landing page | `src/app/page.tsx` only |
| Dev 2: Dashboard | `src/app/(dashboard)/dashboard/page.tsx` only |
| Dev 2: Mock data | `src/data/*.ts` only |
| Dev 1: Header component | `src/components/layout/Header.tsx` only |
| Dev 2: AI insights | `src/components/ai/AIInsightCard.tsx` only |
| Dev 1: Tailwind config | `tailwind.config.ts` only |

---

## How to Pick Up a Task

1. Check this file — pick an unassigned ⬜ task
2. Update this file: add your name + change status to `🔄 In Progress`
3. Create a branch: `git checkout -b feature/task-name`
4. Build the feature
5. Open PR to `dev` branch
6. Merge → update status to `✅ Done`
