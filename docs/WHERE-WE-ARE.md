# PetAI · Где мы — снэпшот сессии (2026-05-28)

> Этот файл — точка восстановления. Если сессия Claude в Chrome
> вылетит, открой новый чат и скажи:
> **"Прочитай docs/WHERE-WE-ARE.md и продолжаем оттуда"**

---

## 👤 Контекст

- **Пользователь:** Дима (НЕ Volodya — это была старая запись, исправлено)
- **Язык общения:** русский
- **Стиль:** прямой, без приукрашивания, action-oriented
- **Project root:** `C:\Users\PC\petai`
- **GitHub:** https://github.com/myzeushell-ui/petai
- **Web (live):** https://petai-ochre.vercel.app
- **Android APK (live):** https://github.com/myzeushell-ui/petai/releases/download/v1.1.0/PetAI.apk

---

## ✅ Что СДЕЛАНО на сегодня

### Продукт (живой в проде)
- **Веб-приложение** Next.js 16 + TypeScript + Tailwind v4, 23 маршрута
- **20 дизайн-тем** портированы из `synq` репо (`portable/PetAiDesigns.tsx`), интегрированы в основное приложение через CSS variables. Тема меняется через 🎨 палитру внизу справа — Dashboard, Reminders, Breeds, Upbringing — всё реагирует
- **Bespoke dashboard** — для каждой темы свой уникальный layout (не просто перекрашенный). Backup в `/dashboard-classic`
- **Pet cover header** — Facebook-style большая фотография питомца сверху дашборда
- **Двуязычность EN/RU** — переключатель в Sidebar, основные страницы локализованы
- **Воспитание** — `/upbringing` + `/breeds/[id]` детальные страницы с lifecycle care для 20 пород
- **Reminders × Воспитание** — авто-генерация напоминаний по этапу жизни питомца
- **AI Gateway** — Claude через Vercel AI Gateway работает (Дима добавил кредитку и API ключ)
- **Android APK v1.1.0** — TWA-обёртка над живым вебом, 1.1 МБ, на GitHub releases
- **/install страница** правильно ссылается на v1.1.0
- **/partner лендинг** — для привлечения ветов/кинологов с FormSubmit формой
- **Affiliate Vetster** на `/consultations` (placeholder ref=PETAI пока Дима не зарегистрирует)
- **/designs** — preview всех 20 дизайн-направлений

### Документация / стратегия (в `docs/`)
- `b2b-collar-partners.md` — research + готовые письма для производителей умных ошейников (PureSpet, TIZE, FitBark, Invoxia, etc.)
- `fundraising-preseed.md` — pre-seed playbook $1M, 14 чеков, 270 контактов
- `fundraising-1-stripe-atlas-walkthrough.md` — пошаговый гайд Stripe Atlas
- `fundraising-2-investor-crm.csv` — 12 первых инвесторов для импорта в Notion
- `fundraising-3-outreach-templates.md` — 10 готовых писем под каждое имя
- `non-dilutive-funding.md` — обзор всех типов non-dilutive funding
- `all-free-entry-programs.md` — обзор всех free-entry программ (Группы A/B/C)
- **`applications/` папка (27+ файлов)** — мастер-кит + детальный walkthrough под каждую заявку:
  - 00-MASTER-KIT.md (база данных всех ответов)
  - 01-10: Cloud credits programs (Microsoft, Google, AWS, NVIDIA, Anthropic, OpenAI, HubSpot, Notion, Vercel, GitHub)
  - 11-15: Pet-tech конкурсы (Purina, PetSmart Cura, Mars Bio Heroes, SuperZoo, Global Pet Expo)
  - 16-19: AI startup конкурсы (Slush 100, TechCrunch Disrupt, WebSummit, Anthropic Builds)
  - 20-23: Fellowships (Pioneer.app, Z Fellows, MassChallenge, Schmidt Futures)
  - 24-26: Government grants (Skolkovo, SBIR, EIC Accelerator)
  - 27-30: Equity акселераторы (YC, Techstars, 500 Global, Antler — skipped per ТЗ)
  - 31: AppSumo Originals LTD (новый, для fastest real cash)

---

## ⏸️ Что ОТКРЫТО — действия от Димы

### Срочно (от Димы)
1. **Заполнить личные данные** в `docs/applications/00-MASTER-KIT.md`:
   - Полное имя на латинице
   - Страна + город
   - Phone в формате +7xxx
   - LinkedIn URL
2. **Сротировать AI Gateway ключ** — он засветился в чате; через https://vercel.com/dima-s-projects2/~/ai
3. **Зарегистрироваться в Vetster Affiliate** — https://vetster.com/en-us/affiliates → ref-код → прислать → заменю PETAI placeholder

### Заявки готовые к подаче (по приоритету)
- **#01 Microsoft for Startups** — $5K Azure instant, 10 мин подача
- **#03 AWS Activate Founders** — $1K AWS, 1-3 дня
- **#20 Pioneer.app** — старт сегодня, $50K возможен через 8-12 нед
- **#31 AppSumo LTD** — $17K-$140K cash через 10-14 нед
- **#11 Purina PCIP** — $25K cash, deadline осенью

### Дальние треки
- **Pre-seed $1M** — outreach к Carmichael Roberts, Aaron Easterly, Ben Jacobs, Pincus и т.д. через шаблоны в `fundraising-3-outreach-templates.md`
- **B2B письма по ошейникам** — `docs/b2b-collar-partners.md` готовы к отправке

### ⚠️ Открытый вопрос (последний разговор 2026-05-28)
**Дима сказал что темы работают только как цветовые схемы, layouts не меняются.**

Реальное состояние: на `/dashboard` рендерится `<ThemedHome>` который для каждой темы вызывает уникальный Pet* компонент (PetPastelPink, PetDarkLuxury, PetCyber и т.д.) — layouts ТОЧНО разные. Возможные причины почему Дима не видит:
1. Browser cache (нужен Ctrl+Shift+R)
2. Sidebar/AppShell не меняется — Дима смотрит на framework а не на content
3. Дима ожидает что меняются все страницы — но в исходниках Pet* layouts ТОЛЬКО для Home/Dashboard, на /reminders /breeds /upbringing меняются только цвета

**Что нужно решить:**
- A. Test через `/designs` — там layouts в чистом frame, разница максимально видна
- B. Убрать AppShell с /dashboard (full-screen) — 30 мин работы
- C. Сделать per-theme layouts для других страниц — 2-3 недели
- D. Упростить до color scheme only — 1 час

---

## 🔧 Технический стек / окружение

```
Project: C:\Users\PC\petai
Framework: Next.js 16 (App Router, Turbopack)
TypeScript: strict mode
Styling: Tailwind CSS v4
Animations: Framer Motion
Icons: Lucide React
AI: Claude (Anthropic) via Vercel AI Gateway
Deploy: Vercel (auto-deploy from main branch)
Mobile: Expo React Native (mobile/ — legacy) + TWA Android shell (petai-twa/)
Git branches: dev → main
```

### Бэкап / другие проекты
- `C:\Users\PC\petai\mobile\` — Expo React Native приложение (legacy, заменено TWA в production APK)
- `C:\Users\PC\petai-twa\` — Bubblewrap TWA проект для Android APK
- `C:\Users\PC\text5\` — соседний прототип телефона
- `C:\Users\PC\petai-deck\` — investor deck (HTML)
- `C:\Users\PC\petai-site\` — маркетинговый сайт (HTML)
- `C:\Users\PC\petai-team\` — страница команды

---

## 📋 Ключевые конвенции этого проекта

- Все работы — **end-to-end автономно**, никаких "запусти команду X"
- TypeScript-проверка после каждого кода-изменения: `cd /c/Users/PC/petai && node node_modules/typescript/bin/tsc --noEmit`
- Production build для верификации: `npx next build`
- Коммит и push на `dev`, потом merge в `main` чтобы Vercel auto-deploy
- На русском в чате (если Дима пишет на русском)

---

## 🆘 Если сессия вылетела — как продолжить

Открой новый Claude Code чат и вставь это:

```
Я Дима. Продолжаем работу над PetAI.

Прочитай файл /c/Users/PC/petai/docs/WHERE-WE-ARE.md — это снэпшот
текущего состояния всех проектов.

Также прочитай:
- /c/Users/PC/.claude/projects/C--Users-PC/memory/MEMORY.md
- /c/Users/PC/.claude/projects/C--Users-PC/memory/user_name.md
- /c/Users/PC/petai/CLAUDE.md

После прочтения скажи "понял, готов" и спроси с чего продолжаем.
```

Я (новый Claude в новой сессии) прочитаю эти файлы и у меня сразу будет:
- Кто ты (Дима, не Volodya)
- Что мы построили
- Что открыто
- Какие конвенции

И мы продолжим без потери контекста.

---

## 📝 Последний коммит на момент создания snapshot
Открой `git log dev --oneline -5` чтобы увидеть актуальный last commit.
