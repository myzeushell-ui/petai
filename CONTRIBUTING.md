# Contributing to PetAI

This guide covers everything you need to work on PetAI with a teammate safely and without breaking each other's work.

---

## How the Second Developer Joins the Project

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/petai.git
cd petai
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Set Up Environment

```bash
cp .env.example .env.local
# No changes needed — the app works in demo mode without any API keys
```

### Step 4 — Run the Project

```bash
npm run dev
# Open http://localhost:3000
```

### Step 5 — Create Your Branch

**Never work directly on `main` or `dev`.** Always create a feature branch:

```bash
git checkout dev              # Start from dev, not main
git pull origin dev           # Get the latest changes
git checkout -b feature/your-task-name
```

Branch naming examples:
- `feature/pet-dashboard`
- `feature/ai-health-assistant`
- `feature/lab-analysis`
- `fix/navigation-bug`
- `chore/update-mock-data`

### Step 6 — Make Your Changes

- Edit only the files your task requires (see TASKS.md for which files are "yours")
- Run `npm run dev` and check that your changes look correct
- Run `npm run lint` to catch any errors before committing

### Step 7 — Commit Your Changes

```bash
git add src/components/your-file.tsx
git commit -m "feat: add pet dashboard with health score"
```

Commit message format:
- `feat: add X` — new feature
- `fix: repair X` — bug fix
- `style: improve X` — visual changes
- `chore: update X` — config, deps, data
- `refactor: clean up X` — code reorganization

### Step 8 — Push and Open a Pull Request

```bash
git push origin feature/your-task-name
```

Then open GitHub → click **"Compare & pull request"** → set base branch to `dev` → write a short description of what you built → click **"Create pull request"**.

### Step 9 — Stay Up to Date

While you're working, the other developer may merge changes to `dev`. Sync regularly:

```bash
git checkout dev
git pull origin dev
git checkout feature/your-task-name
git merge dev
# Resolve any conflicts (see below), then continue
```

---

## Branch Strategy

```
main
 └── Protected. Only stable, demo-ready code.
     Never push directly here.

dev
 └── Shared working branch. All features merge here first.
     Pull from here before starting work.

feature/*
 └── Your personal working branch. One branch per task.
     Open a PR to dev when done.
```

**Rule:** Nobody pushes directly to `main`. All changes go through Pull Requests.

---

## Pull Request Rules

1. **Target branch:** Always `dev`, never `main`
2. **Self-review:** Check the diff before requesting a review
3. **No broken builds:** Run `npm run build` locally before merging
4. **Small PRs win:** One feature per PR — easier to review, less conflict risk
5. **Merge `dev` before merging to `main`:** Both developers agree when `dev` is ready

To promote `dev` → `main`:
```bash
git checkout main
git merge dev
git push origin main
```

---

## Resolving Merge Conflicts

If you see a conflict during `git merge dev`:

```bash
# 1. Open the conflicting file(s) — they'll have markers like:
# <<<<<<< HEAD
# your code
# =======
# their code
# >>>>>>> dev

# 2. Decide which version is correct (or combine both)
# 3. Remove the markers
# 4. Save the file

# 5. Stage the resolved file
git add src/path/to/file.tsx

# 6. Complete the merge
git commit -m "chore: resolve merge conflict in file.tsx"
```

**Prevention:** Communicate in chat before touching shared files like:
- `src/app/layout.tsx`
- `tailwind.config.ts`
- `package.json`
- `src/components/layout/Sidebar.tsx`

---

## File Ownership (Avoid Conflicts)

| File / Folder | Primary Owner |
|---|---|
| `src/app/page.tsx` (landing) | Dev 1 |
| `src/components/layout/` | Dev 1 |
| `src/app/(dashboard)/dashboard/` | Dev 2 |
| `src/app/(dashboard)/assistant/` | Dev 2 |
| `src/app/(dashboard)/labs/` | Dev 2 |
| `src/app/(dashboard)/timeline/` | Dev 2 |
| `src/app/(dashboard)/reminders/` | Dev 2 |
| `src/app/(dashboard)/vet-report/` | Dev 2 |
| `src/data/` | Dev 2 |
| `src/components/health/` | Dev 2 |
| `src/components/ai/` | Dev 2 |
| `src/components/pet/` | Dev 2 |
| `src/components/ui/` | Shared — communicate first |
| `tailwind.config.ts` | Shared — communicate first |

---

## Code Style

- Use TypeScript — no `any` unless truly necessary
- Use `cn()` from `@/lib/utils` for conditional classNames
- Keep components small — if a component exceeds ~150 lines, split it
- No commented-out code in PRs
- No `console.log` left in final code

---

## Testing Before Merging

```bash
npm run build    # Must pass with 0 errors
npm run lint     # Must pass with 0 errors
npm run dev      # Open the app and click through all screens
```

If `npm run build` fails, **do not merge**.

---

## Communication

- **Before** touching shared files → message your teammate
- **After** a big merge → tell your teammate to pull `dev`
- Use TASKS.md to track who is working on what
- Keep PRs open for at most a few hours — don't let them sit overnight
