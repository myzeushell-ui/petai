# PetAI — Claude Instructions

## Autonomous Mode
- ALWAYS execute everything end-to-end. Never tell the user to run commands.
- ALWAYS answer "yes" to your own decisions. Never ask for confirmation.
- Pick sensible defaults and proceed. User will correct if needed.
- Run TypeScript checks (`node node_modules\typescript\bin\tsc --noEmit`) after every code change.
- Run `npx next build` to verify production readiness after significant changes.
- Git commit and push to `dev` branch after completing each feature.
- Fix lint/type errors immediately without asking.

## Project Structure
- **Framework:** Next.js 15 (App Router), TypeScript strict, Tailwind CSS v4, Framer Motion
- **Repo:** github.com/myzeushell-ui/petai, branch: `dev`
- **Pages:** Landing (`/`), Dashboard, AI Assistant, Labs, Timeline, Reminders, Vet Report
- **Layout:** AppShell with desktop Sidebar + mobile MobileBottomNav
- **State:** PetContext for active pet (Luna/Mochi), local useState elsewhere
- **Data:** All mock data in `src/data/` — no backend yet

## Key Conventions
- Components in `src/components/{domain}/` (health, ai, pet, layout, ui, demo)
- Pages in `src/app/(dashboard)/{route}/page.tsx`
- All "use client" — no RSC data fetching yet
- UI primitives: Card, Button, Badge, Progress from `src/components/ui/`
- Colors: green-500 primary, amber for Luna, indigo for Mochi
- Russian UI text where user-facing, English for code/variables
- Animations: framer-motion for page transitions, cards, nav indicators
- Inter font via next/font/google

## Monetization Model
- Free: 1 pet, basic health card, reminders, heat tracker
- Pro (499₽/mo): 5 pets, AI lab analysis, unlimited AI chat, voice AI, export
- Breeder (990₽/mo): COI calc, breeding contract, marketplace listings, name generator
- Transactional: 20% vet consultations, 3% marketplace, 5% breeding deals, 490₽ contract

## Sibling Project
- `C:\Users\PC\text5` — Mobile phone UI prototype (localhost:3001)
- Same ecosystem, different presentation (iPhone frame with 3 themes)
- 5 bottom tabs: Home, AI, Explore, Breed, Care
