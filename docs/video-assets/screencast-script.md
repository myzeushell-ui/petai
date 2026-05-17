# PetAI — Screencast Recording Script

> Скрипт для записи скринкастов приложения под видео "My Dog Journey" (80–90 sec).
> Сервер: `npm run dev --prefix petai` → http://localhost:3000

## Setup

1. **Browser:** Chrome/Edge в incognito, окно 1280×800 (или 1440×900 для 4K-апскейла)
2. **Zoom:** Cmd/Ctrl + 0 (100%)
3. **Recorder:** OBS Studio / ShareX / Loom / built-in (Win+G на Windows)
4. **Cursor:** включить highlight (ShareX → Tools → Cursor Highlighter)
5. **Theme:** light mode (по умолчанию)
6. **Disable** browser bookmarks bar (Ctrl+Shift+B)

---

## SCENE 2 — Finding the right one *(≈ 12 sec)*
**VO:** "I downloaded PetAI. Took a quiz. The app picked the right breed for my lifestyle. Found a verified breeder right in the marketplace. Got my puppy."

| t   | Действие                                  | URL                |
|-----|-------------------------------------------|--------------------|
| 0.0 | Открыть лендинг                            | `/`                |
| 1.5 | Click **"Открыть приложение"** (hero CTA)  | → `/dashboard`     |
| 3.0 | Click sidebar → **Породы**                 | `/breeds`          |
| 4.5 | Hover/scroll по карточкам пород            | —                  |
| 6.5 | Click sidebar → **Маркетплейс**            | `/marketplace`     |
| 8.0 | Hover на верифицированных заводчиках       | —                  |
| 10.0| Click первую карточку щенка                | —                  |

---

## SCENE 3 — Health card and nutrition *(≈ 12 sec)*
**VO:** "Right away — a health card. Vaccines, blood tests, weight — all in one place. AI built a balanced diet plan — for the breed, age, weight and activity."

| t   | Действие                                | URL          |
|-----|-----------------------------------------|--------------|
| 0.0 | Открыть **Dashboard**                    | `/dashboard` |
| 1.5 | Pause на Health Score 87                | —            |
| 3.0 | Scroll к Upcoming Reminders             | —            |
| 4.5 | Click sidebar → **Lab Results**          | `/labs`      |
| 6.0 | Scroll по результатам анализов          | —            |
| 7.5 | Click sidebar → **Питание**              | `/nutrition` |
| 9.5 | Pause на калориях и пропорциях рациона  | —            |

---

## SCENE 4 — The problem *(≈ 12 sec)*
**VO:** "My dog had a behavior problem. I found a dog trainer in the app. Booked a session. Paid. Got a training plan. All inside PetAI."

| t   | Действие                                       | URL              |
|-----|------------------------------------------------|------------------|
| 0.0 | Click sidebar → **AI Assistant**                | `/assistant`     |
| 1.0 | Печатать в чат: "Luna pulls on the leash"      | —                |
| 2.5 | Получить ответ AI                              | —                |
| 4.0 | Click sidebar → **Консультации**                | `/consultations` |
| 5.0 | Filter chip → **Кинолог**                       | —                |
| 6.0 | Click карточку **Дмитрий Петров**               | → detail         |
| 7.0 | Click **"Записаться на консультацию"**          | → booking        |
| 7.5 | Click слот **15:30**                            | —                |
| 8.0 | Click **"Перейти к оплате"**                    | → payment        |
| 9.0 | Click **"Оплатить 5 000 ₽"** (loading spinner)  | → success        |
| 10.5| Pause на "Запись подтверждена"                  | —                |

---

## SCENE 5 — Becoming a breeder *(≈ 14 sec)*
**VO:** "Time passed. I decided to breed. Heat cycle tracker. Mating match by pedigree. Inbreeding calculator. Breeding contract — generated automatically."

| t    | Действие                                   | URL                 |
|------|--------------------------------------------|---------------------|
| 0.0  | Click sidebar → **Разведение**              | `/breeding`         |
| 1.0  | Pause на "День 12 · Estrus" + rose card    | —                   |
| 3.0  | Click tab **Подбор пары**                   | —                   |
| 4.5  | Hover на Champion Goldenline Atlas (96%)   | —                   |
| 6.0  | Click карточку Atlas                        | → coi tab           |
| 7.0  | Pause на "Прогноз COI потомства: 2.4%"      | —                   |
| 9.0  | Click **"Оформить договор вязки"**          | → contract tab      |
| 10.0 | Click **"Сгенерировать договор PDF"**       | spinner             |
| 11.5 | Pause на "Договор готов · 6 страниц" + ✓   | —                   |

---

## SCENE 6 — Selling puppies *(≈ 10 sec)*
**VO:** "Puppies were born. I listed them on PetAI marketplace. Pedigree, documents, photos. Buyers find them, message me, buy — all in one app."

| t   | Действие                                        | URL                   |
|-----|-------------------------------------------------|-----------------------|
| 0.0 | Перейти на                                       | `/marketplace/new`    |
| 1.0 | Pause на Step 1 (helmet, dates, price)          | —                     |
| 2.5 | Click **"Далее → Фото"**                         | → step 2              |
| 3.5 | Pause на 4 щенках emoji + slots                 | —                     |
| 5.0 | Click **"Далее → Документы"**                    | → step 3              |
| 6.0 | Pause на 5 verified docs + "Verified Breeder"   | —                     |
| 7.5 | Click **"Далее → Публикация"**                   | → step 4              |
| 8.5 | Click **"Опубликовать"** → spinner → 142 views  | done                  |

---

## SCENE 7 — Smart collar *(≈ 14 sec)*
**VO:** "And then — the smart collar. Temperature, movement, heart rate. And a microphone that listens to barks and understands how your dog feels — stress, joy, pain, anxiety. You know before you even notice."

| t    | Действие                                        | URL       |
|------|-------------------------------------------------|-----------|
| 0.0  | Click sidebar → **Smart Collar**                 | `/collar` |
| 1.0  | Pause на 4 metric cards (temp/HR/activity/GPS)  | —         |
| 3.0  | Zoom in на live waveform (анимация ~2 сек)      | —         |
| 5.5  | Scroll к Эмоции (5 баров с эмодзи)              | —         |
| 7.5  | Pause на "Игровой лай · 0.8 сек"                 | —         |
| 9.0  | Pause на amber AI insight ("AI заметил утром")  | —         |
| 11.0 | Slow zoom out                                    | —         |

---

## SCENE 8 — Finale
Живые кадры. Скринкаст не нужен — только логотип PetAI в финале (можно открыть `/` лендинг на 2 сек).

---

## Технические заметки
- Запиши **каждую сцену отдельным клипом** — проще монтировать
- Скорость курсора: средняя (не дёргано)
- Между кликами **0.5–1 сек паузы** для VO синхронизации
- Если animation не успевает — pause запись на 1 сек, потом продолжай
- **Не записывай dev-mode banner "Demo Mode"** сверху — обрежь в посте
- Имя файла: `scene-02.mp4`, `scene-03.mp4`, ... сохрани в `docs/video-assets/screencasts/`
- Формат: **1080p 60fps** (4K если поддерживает запись)
