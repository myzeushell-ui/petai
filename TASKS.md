# PetAI Ecosystem — Task Board

> Sprint: Phase 1 Polish + a16z Application
> Updated: 2026-05-17

---

## 🔴 КРИТИЧНО — a16z Speedrun (дедлайн сегодня)

| Задача | Кто | Статус |
|--------|-----|--------|
| Написать one-liner pitch | Dev 1 | ⬜ Todo |
| Записать demo video (2–3 мин) | Dev 1 | ⬜ Todo |
| Заполнить форму speedrun.a16z.com | Dev 1 | ⬜ Todo |
| LinkedIn профили (оба фаундера) | Оба | ⬜ Todo |
| Уникальный инсайт: 1 абзац | Dev 1 | ⬜ Todo |

---

## 🔴 Высокий приоритет — Demo-готовность

| Задача | Кто | Ветка | Статус |
|--------|-----|-------|--------|
| Landing page hero + CTA | Dev 1 | feature/landing-page | ✅ Done |
| App layout + sidebar nav | Dev 1 | feature/app-layout | ✅ Done |
| Dashboard page | Dev 2 | feature/pet-dashboard | ✅ Done |
| AI Assistant chat UI | Dev 2 | feature/ai-assistant | ✅ Done |
| Lab Results + AI analysis | Dev 2 | feature/lab-analysis | ✅ Done |
| Health Timeline | Dev 2 | feature/health-timeline | ✅ Done |
| Reminders page | Dev 2 | feature/reminders | ✅ Done |
| Vet Report page | Dev 2 | feature/vet-report | ✅ Done |
| Mock data (все датасеты) | Dev 2 | chore/mock-data | ✅ Done |
| Demo mode banner | Dev 1 | feature/demo-mode | ✅ Done |
| Prototype (text5) — 7 вкладок | Dev 1 | — | ✅ Done |
| Prototype — Explore (Breed+Shop+Voice) | Dev 1 | — | ✅ Done |
| Prototype — Breeding (Течка+Роды+Вязка+Клички) | Dev 1 | — | ✅ Done |

---

## 🟡 Средний приоритет — Неделя 1–2

| Задача | Кто | Ветка | Статус |
|--------|-----|-------|--------|
| Vercel deploy | Dev 1 | — | ⬜ Todo |
| Mobile responsiveness test | Dev 1 | fix/mobile-layout | ⬜ Todo |
| Pet switcher (Luna + Mochi) | Dev 2 | feature/pet-switcher | ⬜ Todo |
| Animated page transitions | Dev 1 | feature/page-transitions | ⬜ Todo |
| Waitlist email на landing | Dev 1 | feature/waitlist | ⬜ Todo |
| Health score animated ring | Dev 2 | fix/health-score-ring | ⬜ Todo |
| Breed picker — полные 25 вопросов | Dev 2 | feature/breed-picker | ⬜ Todo |
| База пород: 30 собак + 15 кошек | Dev 2 | chore/breed-db | ⬜ Todo |

---

## 🟢 Низкий приоритет — Фаза 2+

| Задача | Кто | Ветка | Статус |
|--------|-----|-------|--------|
| Dark mode | Dev 1 | feature/dark-mode | ⬜ Todo |
| Mochi — второй питомец | Dev 2 | feature/multi-pet | ⬜ Todo |
| Lab upload drag & drop | Dev 2 | feature/lab-upload | ⬜ Todo |
| Print/export vet report | Dev 2 | feature/report-export | ⬜ Todo |
| Favicon + OG image | Dev 1 | chore/assets | ⬜ Todo |
| Трекер течки — полная логика | Dev 2 | feature/heat-tracker | ⬜ Todo |
| COI калькулятор MVP | Dev 2 | feature/coi-calc | ⬜ Todo |
| Маркетплейс: 50 seed-объявлений | Dev 2 | chore/marketplace-seed | ⬜ Todo |
| Генератор кличек — полная база | Dev 2 | feature/name-gen | ⬜ Todo |
| Руководство по родам — полный контент | Dev 2 | feature/whelp-guide | ⬜ Todo |

---

## Ответственность Developer 1 (myzeushell-ui)

**Фокус:** Визуал, landing, deploy, прототип, a16z заявка

Файлы:
- `src/app/page.tsx` (landing)
- `src/components/layout/` (AppShell, Sidebar, Header)
- `src/components/demo/DemoModeBanner.tsx`
- `text5/src/` (весь прототип)
- Vercel deploy + домен

---

## Ответственность Developer 2 (standlord-prog)

**Фокус:** Данные, AI-экраны, база пород, новые модули

Файлы:
- `src/app/(dashboard)/` (все страницы)
- `src/data/` (все mock-датасеты)
- `src/components/health/`, `src/components/ai/`, `src/components/pet/`
- Breed picker логика
- COI калькулятор
- Heat tracker

---

## Как взять задачу

1. Выбери ⬜ задачу
2. Обнови этот файл: имя + `🔄 In Progress`
3. `git checkout -b feature/task-name`
4. Сделай
5. PR → `dev` ветка
6. Merge → `✅ Done`
