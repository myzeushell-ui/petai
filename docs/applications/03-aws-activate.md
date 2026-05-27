# #03 — AWS Activate

## Краткий бриф

- **Что дают:** $1K credits сразу (Founders tier, без условий) → до **$100K** при попадании в Portfolio tier (через approved accelerator/VC) + AWS Business Support + бесплатная техподдержка $300 value/мес
- **Equity:** ❌ нет
- **Подача:** **бесплатно**, ~10 минут (Founders tier)
- **URL:** https://aws.amazon.com/activate/
- **Срок ответа:** 1-3 дня
- **Юр.лицо нужно:** ❌ нет для Founders tier

## ✅ ЧТО ОТ ТЕБЯ НУЖНО ЛИЧНО

- [ ] AWS account (создаётся бесплатно на aws.amazon.com, нужна **валидная карта** для биллинга — но списываться ничего не будет если использовать только credits)
- [ ] Прислать AWS Account ID (12 цифр, видно после создания account в правом верхнем углу AWS Console)
- [ ] Подтвердить email + phone

## 📝 ГОТОВЫЕ ОТВЕТЫ НА ПОЛЯ ФОРМЫ

### Founders tier application form

URL подачи: https://aws.amazon.com/activate/founders/

- **AWS Account ID:** `[12-значный ID после создания AWS account]`
- **Company name:** `PetAI`
- **Company website:** `https://petai-ochre.vercel.app`
- **Company stage:** `Pre-seed`
- **Year founded:** `2026`
- **Industry:** `Software / Internet → Health & Wellness`
- **Company size:** `1`
- **Country:** `[твоя страна]` или `United States` если Atlas готов
- **Annual revenue:** `$0`

### Tell us about your business
```
PetAI is the AI health operating system for pets — bark-analysis voice AI,
lab result interpretation, lifecycle care timeline for 20+ breeds, and a
marketplace of vetted vets, trainers, breeders. Live web + Android app,
bilingual EN/RU. Pre-seed stage, solo founder.

Plan to use AWS for:
- AI inference (Bedrock for Claude alternative, or SageMaker for own
  bark-analysis model)
- Lambda + API Gateway for serverless backend
- DynamoDB for high-throughput pet health timeline data
- S3 for pet photos and lab document storage
- CloudFront CDN for global app delivery
- Amplify for mobile app backend
```

### Are you part of an accelerator/VC?
- `No` for now → activates Founders tier ($1K)
- Если потом попадёшь в YC/Techstars/etc → подаёшь повторно через "Portfolio" path для $100K

## 📎 ЧТО ПРИЛОЖИТЬ

Founders tier — ничего не нужно прикладывать. Чисто веб-форма.

Для Portfolio tier ($100K) — нужна **letter of recommendation** от approved accelerator/VC. Получим если попадём в Y Combinator / Techstars / 500 Global или один из их investor list получит check от нас.

## ⚠️ ОСОБЫЕ МОМЕНТЫ

- **Карта для AWS account** — обязательна даже для free tier. Используй ту же что для других иностранных сервисов (Wise / Revolut).
- **$1K не списывается** если использовать только free tier + credits. Будь осторожен с **EC2 instances** — они могут сожрать credits за неделю если случайно запустить t3.large без autoshutdown.
- **AWS Business Support** ($300/мес value) активируется автоматически с Founders tier на 6 месяцев.

## ✅ ПОСЛЕ ПОДАЧИ

1. В течение 1-3 дней email от AWS Activate team
2. Credits появятся в AWS Console → Billing → Credits через 24 часа после approval
3. Можем переехать постепенно: например, S3 для пет-фоток сразу с AWS вместо Vercel blob (дешевле в долгую)
