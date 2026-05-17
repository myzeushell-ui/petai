# PetAI Demo Video — Production Pack

> 80–90 sec demo video для investor pack / лендинга / соцсетей.

## Файлы в этой папке

| Файл                                | Что внутри                                      |
|-------------------------------------|-------------------------------------------------|
| [`../video-scenario.md`](../video-scenario.md) | 8-сценовый сценарий (источник правды)            |
| [`voice-over.md`](voice-over.md)    | Тексты для озвучки, разбитые по сценам          |
| [`screencast-script.md`](screencast-script.md) | Pixel-точный план записи экрана (клики/тайминг)  |
| [`elevenlabs-setup.md`](elevenlabs-setup.md) | Как клонировать голос и сгенерировать аудио     |
| [`scripts/generate-voiceover.sh`](scripts/generate-voiceover.sh) | Bash-скрипт → 8 MP3 через ElevenLabs API        |
| [`timing-plan.md`](timing-plan.md)  | Финальный таймлайн для монтажа                  |
| `audio/scene-XX.mp3`                | (генерируется) AI-озвучка                       |
| `screencasts/scene-XX.mp4`          | (запишешь сам) Скринкасты приложения            |
| `live-footage/`                     | (загрузишь сюда) Твои живые кадры               |

## Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Записать voice-sample.mp3 → ElevenLabs → 8 scene MP3s    │
│ 2. Запустить dev: npm run dev --prefix petai                 │
│ 3. По screencast-script.md записать 7 mp4 (Scene 2-7)       │
│ 4. Загрузить твои живые кадры в live-footage/                │
│ 5. По timing-plan.md собрать всё в DaVinci/Premiere/CapCut  │
│ 6. Экспорт 1080p 60fps                                       │
└─────────────────────────────────────────────────────────────┘
```

## Что готово

- ✅ Сценарий (8 сцен)
- ✅ Voice-over тексты + направление актёрской игры
- ✅ Все 4 недостающие UI-страницы собраны (Consultations, Breeding, Collar, Marketplace/new)
- ✅ Pixel-точный recording script
- ✅ ElevenLabs setup + bash-скрипт генерации
- ✅ Editing timeline + цвета, шрифты, экспорт-настройки

## Что нужно от тебя

1. **Записать voice-sample** (1–3 мин чистого голоса) → `audio/voice-sample.mp3`
2. **Загрузить живые кадры** → `live-footage/`
3. **Купить ElevenLabs Starter** ($5) и положить ключ в `.env.local`
4. **Записать скринкасты** по `screencast-script.md`
5. **Собрать монтаж** по `timing-plan.md`

Каждый из 5 пунктов — 30–60 минут работы. Всего ≈ 4 часа до готового видео.
