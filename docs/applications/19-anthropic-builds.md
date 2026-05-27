# #19 — Anthropic Builds Hackathons

## Краткий бриф
- **Что дают:** $5-25K cash для winners + $10K+ Claude API credits + co-marketing с Anthropic (тег @anthropic в социал)
- **Equity:** ❌ нет
- **Подача:** **бесплатно**, ~10 мин на регистрацию + работа на hackathon (24-48h)
- **URL:** https://www.anthropic.com/events (или https://lu.ma/anthropic)
- **Срок:** quarterly events, обычно weekend
- **Юр.лицо:** не нужно (можно participate как individual или team)

## ✅ ЧТО ОТ ТЕБЯ НУЖНО ЛИЧНО
- [ ] Anthropic Console account (myzeushell@gmail.com)
- [ ] Готовность работать 24-48 часов на event (онлайн)
- [ ] Demo presentation подготовить за event
- [ ] Опционально: команда 2-4 человека (можешь solo, но team competitive advantage)

## 📝 ГОТОВЫЕ ОТВЕТЫ

### Registration form
- **Name:** `Dima [фамилия]`
- **Email:** `myzeushell@gmail.com`
- **Existing Claude user?** `Yes` (workspace ID)
- **What will you build?** см. ниже

### What will you build for the hackathon?

Идея под hackathon: расширить PetAI с новой Claude-powered фичей. Конкретно:
```
"PetAI Vet Translator" — real-time speech-to-text + Claude
interpretation during veterinary visits.

Owner taps record at vet appointment → Whisper transcribes vet's
explanation → Claude reformulates into plain English with: (1) action
items checklist, (2) follow-up questions to ask before leaving, (3)
red flags that mean "call back if symptoms appear", (4) home care
script. Saved to pet's timeline for future reference.

This addresses the biggest source of pet owner anxiety: leaving the
vet feeling like they understood half of what was said. PetAI captures
and translates the medical-speak in real time.

Tech:
- React Native (Expo) audio recording
- Whisper API (OpenAI) for transcription — фолбэк to Claude with audio
  if Anthropic Claude supports audio by event date
- Claude Sonnet 4.5 for medical interpretation + structured JSON output
- Stored in PetContext as new timeline entry type
```

### Why is this hackathon-fit?
```
1. Live demoable in 36 hours (Claude API + Whisper + UI)
2. Real consumer need validated through PetAI user interviews
3. Showcases Claude's strength: structured output from messy medical
   transcription
4. Built on top of PetAI's existing production codebase — judges see
   real product, not toy
```

## 📎 ЧТО ПРИЛОЖИТЬ
В hackathon обычно нужно:
- ✅ Live demo (screen-share at presentation)
- ✅ GitHub repo с кодом (можем подготовить fork PetAI с веткой `hackathon-vet-translator`)
- ✅ 5-min presentation pitch

## ⚠️ ОСОБЫЕ МОМЕНТЫ
- Anthropic Builds происходит **каждые 2-3 месяца**, online или physical (San Francisco / New York / London обычно). Проверь календарь на anthropic.com/events.
- **Top 3 builds выигрывают $5-25K + Claude credits**, остальные participants получают $1K кредитов just for finishing.
- **Solo participants могут выигрывать**, не обязательно команда. Но 2-3 человека ускоряют work.
- Если PetAI Vet Translator hackathon win → можем интегрировать его как production feature в PetAI следующим спринтом.

## ✅ ПОСЛЕ HACKATHON
- Winners объявляются live на final demo session
- Cash wires в течение 30 дней
- Credits added в Anthropic Console
- Featured в Anthropic blog post / Twitter (брендовый exposure для PetAI)
