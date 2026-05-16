# 🐾 PetAI — AI Health Operating System for Pets

> Investor-ready clickable prototype. Built for the a16z Speedrun pitch.

PetAI gives pet owners a single intelligent platform to track their pet's health, get AI-powered insights, analyze lab results, manage medications, and communicate with vets — all without a backend.

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/petai.git
cd petai

# 2. Install dependencies
npm install

# 3. Copy env file (no changes needed for demo)
cp .env.example .env.local

# 4. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app loads instantly in **Demo Mode** with no login required.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Components | Custom UI + Radix UI primitives |
| Animation | Framer Motion |
| Data | Local mock data (no backend) |
| Deployment | Vercel |

---

## Project Structure

```
petai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   └── (dashboard)/        # App shell with sidebar
│   │       ├── dashboard/      # Main dashboard
│   │       ├── assistant/      # AI chat interface
│   │       ├── labs/           # Lab results + AI analysis
│   │       ├── timeline/       # Health history timeline
│   │       ├── reminders/      # Medications & reminders
│   │       └── vet-report/     # Vet visit summary
│   ├── components/
│   │   ├── ui/                 # Base UI components (Button, Card, Badge…)
│   │   ├── layout/             # AppShell, Sidebar, Header
│   │   ├── demo/               # Demo mode banner
│   │   ├── pet/                # Pet profile components
│   │   ├── ai/                 # AI insight cards, chat
│   │   └── health/             # Health score, timeline, labs
│   ├── data/                   # Mock data (all realistic demo content)
│   ├── types/                  # TypeScript type definitions
│   ├── lib/                    # Utilities (cn, formatDate, etc.)
│   └── styles/                 # Theme constants
├── README.md
├── CONTRIBUTING.md
├── PROJECT_CONTEXT.md
├── ROADMAP.md
└── TASKS.md
```

---

## Demo Mode

The app runs in **Demo Mode** by default:
- No registration or login required
- All data is fictional (demo pet: Luna, 4yo Golden Retriever)
- AI assistant responds with pre-scripted realistic answers
- Designed to be shown live to investors

To open the demo: `npm run dev` → open browser → click **"Open App"**

---

## Deploy to Vercel

```bash
# Option 1: Vercel CLI
npm i -g vercel
vercel

# Option 2: GitHub integration
# Push to GitHub → connect repo in vercel.com → auto-deploy
```

No environment variables required for demo deployment.

---

## For the Second Developer

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for full onboarding instructions.

**TL;DR:**
```bash
git clone https://github.com/YOUR_USERNAME/petai.git
cd petai
npm install
git checkout -b feature/your-task-name
# make changes
git push origin feature/your-task-name
# open Pull Request to dev
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## Architecture Notes

- **No backend required** — all data lives in `src/data/`
- **Supabase-ready** — types and data structures are designed for easy DB migration
- **AI is mocked** — `getMockResponse()` in assistant page simulates AI responses
- **Demo mode** is hardcoded via `src/data/demoPets.ts` → `primaryPet`
