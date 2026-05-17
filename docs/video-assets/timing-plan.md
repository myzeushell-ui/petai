# PetAI Video — Editing Timeline

> Финальный таймлайн для DaVinci / Premiere / CapCut.
> Длина: **89 sec** · Формат: **1080p 60fps** · Аудио: **48 kHz stereo**

## Tracks

```
V3  ─ Lower-thirds / captions (английские субтитры)
V2  ─ Screencast clips (Scene 2-7)
V1  ─ Live footage (user-recorded)
A1  ─ Voice-over (scene-01..08.mp3, AI-cloned voice)
A2  ─ Music bed (-22 LUFS, дакинг под VO)
A3  ─ SFX (whoosh-переходы, UI clicks)
```

## Timeline

| t (s) | Scene | V1 (Live)                 | V2 (Screencast)              | A1 (VO)        | Notes                          |
|-------|-------|---------------------------|------------------------------|----------------|--------------------------------|
| 0–8   | 1     | Прогулка, собаки, ты      | —                            | scene-01.mp3   | Wide shot, slow pan            |
| 8–19  | 2     | (B-roll: телефон в руке)  | quiz → marketplace           | scene-02.mp3   | Crossfade live → screen        |
| 19–31 | 3     | (B-roll: Luna ест)        | dashboard → labs → nutrition | scene-03.mp3   | Picture-in-picture: Luna+UI    |
| 31–43 | 4     | (B-roll: тренировка)      | AI chat → consult → payment  | scene-04.mp3   | Whoosh при переходе экранов    |
| 43–57 | 5     | (B-roll: Luna playful)    | heat → match → COI → contract| scene-05.mp3   | UI cards анимируются sync с VO |
| 57–67 | 6     | (B-roll: щенки)           | new listing flow             | scene-06.mp3   | Ускорение шагов (1.5x)         |
| 67–81 | 7     | Luna крупным планом      | collar metrics + waveform   | scene-07.mp3   | Split-screen: ошейник+эмоции   |
| 81–89 | 8     | Ты в кадр, finale         | (PetAI logo overlay)         | scene-08.mp3   | Logo fade-in последние 2 сек   |

## Hex-палитра (для титров/логотипа)

- Primary green: `#22C55E` (PetAI brand)
- Accent emerald: `#10B981`
- Pink (breeding): `#EC4899`
- Purple (collar): `#A855F7`
- Background: `#FAFAFA` light / `#0F0F10` dark
- Text on light: `#111827`

## Шрифт

**Inter** (уже в проекте). Bold для заголовков, Medium для подписей.

## Music

Бесплатные источники с лицензией:
- **YouTube Audio Library** — search "uplifting corporate" 80–100 BPM
- **Epidemic Sound** (Trial 30 дней) — track "Better Days" / "Pet Friends"
- **Pixabay Music** — лицензия CC0

Тип: **lo-fi indie pop**, тёплая гитара, без вокала, BPM 95–110.

## SFX

- UI click: https://freesound.org/people/MATRIXXX_/sounds/365671/
- Whoosh: https://freesound.org/people/qubodup/sounds/60013/
- Success ding: lazada-style chime

## Subtitles (.srt)

Сгенерировать из `voice-over.md` или авто-распознавание из VO:
- DaVinci: Transcribe Audio → SRT
- Premiere: Speech to Text → Captions
- Шрифт subs: Inter 28pt white, drop-shadow

## Export settings

```
Format:        MP4 (H.264)
Resolution:    1920 × 1080
Frame rate:    60 fps
Bitrate:       12 Mbps (high), 8 Mbps (web)
Audio:         AAC 192 kbps, 48 kHz stereo
Color space:   Rec.709
Final size:    ~140 MB at 89s
```

## Куда заливать

- **YouTube** unlisted — для investor pack (вставка в pitch deck)
- **Vimeo** для clean без рекламы
- **Linkedin native** quad — 1:1 версия (cropped) для соцсетей
