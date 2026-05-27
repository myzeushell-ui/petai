# #05 — Anthropic for Startups

## Краткий бриф

- **Что дают:** до **$50K Claude API credits** (наш AI Gateway работает именно через Claude — credits идут на покрытие наших AI вызовов), dedicated technical support, early access to новые модели, кейс-стади opportunity
- **Equity:** ❌ нет
- **Подача:** **бесплатно**, ~10 мин
- **URL:** https://www.anthropic.com/contact-sales (выбрать "I'm building with Claude" + указать "startup program") или поискать "Anthropic for Startups program"
- **Срок ответа:** 1-3 недели
- **Юр.лицо нужно:** ❌ нет для подачи, но для получения credits нужен Anthropic API account

## ✅ ЧТО ОТ ТЕБЯ НУЖНО ЛИЧНО

- [ ] Anthropic Console account на console.anthropic.com (через myzeushell@gmail.com)
- [ ] Подтвердить что **уже используем Claude** в продукте (это правда — наш `/api/chat`, `/api/triage`, `/api/vision`, `/api/insight` все используют Claude через Vercel AI Gateway)
- [ ] Указать workspace ID (после создания Console account)

## 📝 ГОТОВЫЕ ОТВЕТЫ НА ПОЛЯ ФОРМЫ / EMAIL

Anthropic for Startups не имеет публичной формы как Microsoft — подаются через **contact sales** или **email partnerships@anthropic.com**. Готовый текст:

### Subject
```
PetAI · Startup Program Application · Live consumer AI built on Claude
```

### Email body
```
Hi Anthropic team,

I'm Dima, founder of PetAI — an AI health platform for pets that's built
end-to-end on Claude. Live web + Android, bilingual EN/RU.

Where we use Claude in production:
1. /api/chat — conversational AI assistant for pet health questions,
   with full pet context (breed, age, recent labs) injected per request
2. /api/triage — emergency symptom triage that asks 3-5 clarifying
   questions then returns a structured verdict (emergency/urgent/monitor/
   at_home) with action steps
3. /api/vision — multimodal pet photo analysis (breed identification,
   body condition score, visible health concerns) AND lab result PDF
   interpretation (plain-English explanation, urgency rating)
4. /api/insight — daily personalized care tips based on pet's profile
   and history

All four endpoints route through Vercel AI Gateway which proxies to
Claude. We chose Claude over alternatives because of:
- Superior instruction-following for structured JSON output (critical
  for triage verdicts)
- Multimodal capability for vision endpoint (combining image + lab PDF)
- Russian-language quality on par with English (we serve EN/RU markets
  from day one)

Stage: Pre-seed, solo founder, live product. Raising $1M pre-seed.
Currently funding Claude API from personal budget — credits would
unlock 10x more aggressive AI feature iteration.

Demo (works live, AI endpoints currently in mock mode pending Gateway
credits): https://petai-ochre.vercel.app

Would love to discuss the Startup Program. Open to a 15-min call
anytime: [Cal.com link or "reply with availability"]

Best,
Dima
Founder, PetAI
[your email]
[your LinkedIn]
[your Twitter]
```

## 📎 ЧТО ПРИЛОЖИТЬ

Можно добавить:
- Скриншоты в нашем коде показывающие Claude usage (например `src/lib/ai.ts` где `model = "anthropic/claude-sonnet-4-5"`)
- Demo screenshot одного из AI endpoints в работе

## ⚠️ ОСОБЫЕ МОМЕНТЫ

- **Vercel AI Gateway** — наш текущий setup идёт через Vercel-проксированный Anthropic. Это нормально, кредиты применятся к нашим вызовам.
- **Anthropic for Startups specifically** — программа существует, но менее формализована чем Microsoft/Google. Лучший подход — личный email с конкретным use case (как выше).
- **Альтернатива:** если не пройдём прямую программу, есть Anthropic Builds Hackathons (см. файл #19) — там $5-25K credits за участие.

## ✅ ПОСЛЕ ПОДАЧИ

1. Через 1-3 недели — ответ от Anthropic startup team
2. Если ок — credits добавляются на наш Anthropic Console workspace
3. Затем нужно подключить Anthropic API напрямую (а не через Vercel AI Gateway) для использования кредитов, либо настроить Gateway чтобы он использовал наши credentials — Vercel это поддерживает
