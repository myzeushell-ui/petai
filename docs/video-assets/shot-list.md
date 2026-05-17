# PetAI Video — Shot List

> Mapping снятых пользователем клипов → сценам сценария.
> Файлы в `live-footage/` (после автоматической обработки).

## Source footage inventory

8 клипов от Дмитрия (загружены в Downloads, 17 мая 20:22):

| Исходник | Длит | Размер | Содержание                                                |
|---|---|---|---|
| `video_..._20-22-27.mp4`    | 32 s | 720×1280 60fps | **Single-cam.** Ты стоишь с таксой на поводке на траве, парк, деревья с тёмно-красной листвой, цокольный высотный фон |
| `video_..._20-22-47.mp4`    | 27 s | 720×1280 60fps | **Single-cam.** Селфи: ты крупным планом, такса частично видна снизу, парк, ветерок треплет волосы |
| `video_..._20-22-47 (2).mp4`| 12 s | dual 548×1280 | Top: ты с подругой(?), пара пушистых собак играет. Bottom: ты говоришь в камеру |
| `video_..._20-22-47 (3).mp4`| 12 s | dual          | Top: люди гуляют с собаками в перспективе, парковая дорожка. Bottom: ты говоришь |
| `video_..._20-22-47 (4).mp4`| 15 s | dual          | Top: белый шпиц на зелёном поводке бежит по траве. Bottom: ты говоришь |
| `video_..._20-22-47 (5).mp4`| 1 s  | 1080×2520     | **Drop** — случайный кадр, слишком короткий |
| `video_..._20-22-47 (6).mp4`| 13 s | dual          | Top: рыжая такса бежит по розовой дорожке. Bottom: ты говоришь с городским фоном |
| `video_..._20-22-47 (7).mp4`| 7 s  | dual          | Top: две собаки играют на розовой дорожке. Bottom: ты говоришь |

**Итого:** ~119 с сырых кадров (около 60 с face-to-camera + 60 с B-roll).

## Processed clips (in `live-footage/`)

После авто-кропа split-видео разрезаны на 2 канала:

```
live-footage/
├── 01-walk-park-leash.mp4        ← 27.mp4   (32s, wide shot ты+такса)
├── 02-selfie-finale-face.mp4     ← 47.mp4   (27s, селфи финал)
├── dual2-action.mp4              ← (2) top  (12s, шпицы играют)
├── dual2-face.mp4                ← (2) bot  (12s, talking head)
├── dual3-action.mp4              ← (3) top  (12s, дорожка людей)
├── dual3-face.mp4                ← (3) bot  (12s, talking head)
├── dual4-action.mp4              ← (4) top  (15s, белый шпиц)
├── dual4-face.mp4                ← (4) bot  (15s, talking head)
├── dual6-action.mp4              ← (6) top  (13s, такса бежит)
├── dual6-face.mp4                ← (6) bot  (13s, talking head + city)
├── dual7-action.mp4              ← (7) top  (7s, две собаки)
└── dual7-face.mp4                ← (7) bot  (7s, talking head)
```

## Scene-by-scene mapping

### SCENE 1 — The walk (0–8 s)
**VO:** "I wanted a dog. But which one? There are hundreds of breeds. Which one fits my apartment, my schedule, my family?"

| Time (s) | Track | Clip                          | In→Out | Notes |
|----------|-------|-------------------------------|--------|-------|
| 0–3      | V1    | `01-walk-park-leash.mp4`      | 0:00→0:03 | Wide establishing: ты+такса на траве, медленный pan |
| 3–6      | V1    | `dual2-action.mp4`            | 0:01→0:04 | Cut: пушистые собаки играют — "hundreds of breeds" |
| 6–8      | V1    | `dual7-action.mp4`            | 0:00→0:02 | Cut: две собаки на дорожке — "fits my family?" |

### SCENE 2 — Finding the right one (8–19 s)
**VO:** "I downloaded PetAI. Took a quiz. ... Got my puppy."

| Time | Track | Source | Notes |
|---|---|---|---|
| 8–10  | V1 | `dual3-face.mp4` 0:00→0:02 | "I downloaded PetAI." — лицо |
| 10–13 | V2 | screencast: `/breeds` quiz | "Took a quiz" |
| 13–16 | V2 | screencast: quiz results + match | "picked the right breed" |
| 16–19 | V2 | screencast: `/marketplace` filter | "verified breeder ... my puppy" |

### SCENE 3 — Health card + nutrition (19–31 s)
**VO:** "Right away — a health card. ... What to feed, how much, when."

| Time | Track | Source | Notes |
|---|---|---|---|
| 19–21 | V1 | `01-walk-park-leash.mp4` 0:08→0:10 | "Right away — a health card" — короткая cut |
| 21–25 | V2 | screencast: `/dashboard` health 87 | Score, reminders |
| 25–28 | V2 | screencast: `/labs` | Bloodwork ALT |
| 28–31 | V2 | screencast: `/nutrition` | Diet plan |

### SCENE 4 — The problem (31–43 s)
**VO:** "My dog had a behavior problem. ... All inside PetAI."

| Time | Track | Source | Notes |
|---|---|---|---|
| 31–33 | V1 | `dual4-action.mp4` 0:00→0:02 | Шпиц на поводке — "behavior problem" |
| 33–35 | V2 | screencast: `/assistant` chat | AI ответ |
| 35–38 | V2 | screencast: `/consultations` filter Кинолог | Дмитрий Петров |
| 38–40 | V2 | screencast: booking слот 15:30 | Calendar |
| 40–43 | V2 | screencast: payment + success | Stripe form → ✓ |

### SCENE 5 — Becoming a breeder (43–57 s)
**VO:** "Time passed. I decided to breed. Heat cycle tracker. ..."

| Time | Track | Source | Notes |
|---|---|---|---|
| 43–45 | V1 | `01-walk-park-leash.mp4` 0:18→0:20 | "Time passed" — крупный план таксы |
| 45–48 | V2 | screencast: `/breeding` heat tracker | День 12 Estrus |
| 48–51 | V2 | screencast: Подбор пары + Atlas 96% | |
| 51–54 | V2 | screencast: COI 2.4% | Прогноз |
| 54–57 | V2 | screencast: contract PDF generated | ✓ |

### SCENE 6 — Selling puppies (57–67 s)
**VO:** "Puppies were born. I listed them on PetAI marketplace. ..."

| Time | Track | Source | Notes |
|---|---|---|---|
| 57–60 | V1 | `dual6-action.mp4` 0:00→0:03 | Такса бежит — "Puppies were born" |
| 60–63 | V2 | screencast: `/marketplace/new` step 1–2 | Title + photos |
| 63–65 | V2 | screencast: step 3 verified docs | Verified Breeder |
| 65–67 | V2 | screencast: published + 142 views | Conversion shot |

### SCENE 7 — Smart collar (67–81 s)
**VO:** "And then — the smart collar. ... You know before you even notice."

| Time | Track | Source | Notes |
|---|---|---|---|
| 67–69 | V1 | `01-walk-park-leash.mp4` 0:24→0:26 | Такса крупным планом — collar reveal |
| 69–73 | V2 | screencast: `/collar` 4 metrics | Temp/HR/Activity/GPS |
| 73–77 | V2 | screencast: waveform LIVE + "Игровой лай" | Voice AI |
| 77–81 | V2 | screencast: 5 эмоций + AI insight | "You know before..." |

### SCENE 8 — Finale (81–89 s)
**VO:** "One app. From 'which dog should I get' — to breeding and selling puppies. PetAI."

| Time | Track | Source | Notes |
|---|---|---|---|
| 81–86 | V1 | `02-selfie-finale-face.mp4` 0:00→0:05 | Ты в камеру — "One app" |
| 86–89 | V3 | PetAI logo + tagline | Fade out с logo |

## PIP (Picture-in-Picture) face overlays

Чтобы видео не было «холодным screencast'ом» — кладём face-talking shots как маленький PIP в правом нижнем углу во время скринкастов:

- **PIP size:** 180×210 px (1080p timeline)
- **Position:** bottom-right, 40 px от краёв
- **Border:** 2px white + 8px corner-radius
- **Shadow:** drop-shadow 0 4px 12px rgba(0,0,0,0.25)

| Scene | PIP source                  | Когда показывать          |
|-------|------------------------------|---------------------------|
| 2     | `dual3-face.mp4` 0:02→0:11   | весь скринкаст            |
| 3     | `dual2-face.mp4` 0:00→0:12   | весь скринкаст            |
| 4     | `dual4-face.mp4` 0:02→0:12   | начало (chat)             |
| 5     | `dual6-face.mp4` 0:00→0:12   | весь скринкаст            |
| 6     | `dual7-face.mp4` 0:00→0:07   | step 1–2 только           |
| 7     | `dual6-face.mp4` 0:01→0:13   | весь скринкаст            |

## Что нужно сделать ещё

1. ✅ Кропнуть split-видео на action+face — сделано
2. ✅ Назвать клипы семантично — сделано
3. ⬜ Записать 7 скринкастов app (по [screencast-script.md](screencast-script.md))
4. ⬜ Сгенерировать 8 mp3 голоса (по [elevenlabs-setup.md](elevenlabs-setup.md))
5. ⬜ Собрать всё в редакторе по [timing-plan.md](timing-plan.md) + этому shot-list'у

## Замечания по live-footage

- **Качество single-cam (27 и 47):** 720p 60fps, отличное — main hero shots
- **Качество split (2-7):** 548 wide, ~28fps, среднее — годится для PIP и быстрых cut'ов, в full-screen не растягивать
- **Стиль одежды:** во всех клипах ты в чёрно-белой полосатой футболке — отличная преемственность кадров ✓
- **Город на фоне:** видны новостройки + парк с красными деревьями — узнаваемая локация, выглядит свежо
- **Такса:** рыжая, активная, тип "miniature dachshund" — фотогенична на розовой дорожке
- **Аудио в клипах:** будет заменено AI-озвучкой, оригинальный звук мьютим
