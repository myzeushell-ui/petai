# Stripe Atlas — пошаговый гайд для PetAI (15 минут утром)

> Открой https://stripe.com/atlas → жми **Get started** → создавай аккаунт на свой email.
> Дальше каждое поле — что писать. Сохрани этот файл открытым, копируй из него.

---

## Шаг 1 — Account creation
- **Email:** myzeushell@gmail.com
- **Password:** придумай сильный, запиши в свой password manager
- **Country of residence:** Russia (если живёшь в РФ) — Atlas принимает фаундеров из любых стран
- Нажми **Continue**

---

## Шаг 2 — Verify your identity
- Загрузи скан **загранпаспорта** (главная страница с фото)
- Если попросят селфи с паспортом — сделай при дневном свете, лицо чётко видно, паспорт в той же руке, открыт на странице с фото
- Это занимает у Stripe 1-3 дня на проверку

---

## Шаг 3 — Form your company

### Choose company type
- **Delaware C Corporation** ← это нужно для VC (90% инвесторов в US подписывают SAFE только с Delaware C-corp)
- НЕ выбирай LLC — VC не примут

### Company name
- **PetAI Inc.**
- Если занято, варианты по приоритету:
  1. **PetAI Health Inc.**
  2. **PetAI Labs Inc.**
  3. **PetAI Technologies Inc.**
- Stripe сразу проверит доступность в Delaware → выберет первое свободное

### Business description
Скопируй текст 1-в-1:
```
AI-powered pet health platform combining bark-analysis voice AI,
lab result interpretation, lifecycle care guidance and breed-specific
health intelligence for dog and cat owners.
```

### Industry
- **Software / Technology**
- Sub-category: **Health & Wellness software**

---

## Шаг 4 — Founders & equity

### Number of founders
- **1** (только ты — Volodya)
- Если позже захочешь добавить co-founder — easy через "Issue shares"

### Founder details
- **Legal name:** твоё полное имя по загранпаспорту (на латинице)
- **Title:** **Founder & CEO**
- **Address:** твой реальный адрес проживания (US не требуется)
- **Phone:** твой реальный номер

### Equity allocation
- **Issue 10,000,000 shares** at $0.00001 par value (стандарт Atlas)
- **You receive:** 10,000,000 (= 100%)
- Налог: $100 4-year vesting cliff — выбирай **No vesting** для solo founder (если co-founder появится потом, она будет vest only she gets)

---

## Шаг 5 — Tax (EIN)
- Stripe сам получит EIN от IRS за тебя (включено в пакет $500)
- Просто нажми **"Yes, get EIN for me"**
- Без EIN ты не сможешь открыть bank account → не сможешь получать инвестиции

---

## Шаг 6 — Registered Agent
- Stripe Atlas включает **Stripe Atlas Agents Inc.** как registered agent на 1-й год бесплатно
- После 1-го года ~$100/год — позже можно перейти на Northwest Registered Agent ($125/год)
- Просто нажми **Continue** — не выбирай других провайдеров

---

## Шаг 7 — Payment
- **$500 one-time fee** за Stripe Atlas (включает: Delaware C-corp registration, EIN, registered agent 1 год, IRS forms, founder stock issuance, SAFE template)
- Карта: международная, любая что работает с US merchants. Visa/MC из Тинькофф / Wise card работают
- Если твоя карта не примет — попробуй **Wise debit** (открывается за 15 мин из приложения)

---

## Шаг 8 — Bank account (Mercury — отдельно после Atlas)
Stripe Atlas включает 1 год бесплатного **Mercury** (банк для стартапов). После завершения Atlas регистрации:
1. Stripe пришлёт промокод Mercury на твой email
2. Перейди на https://mercury.com → Apply
3. Заполни как фаундер новой Delaware C-corp PetAI Inc., EIN получишь от Atlas
4. Mercury откроет business account за 1-3 дня
5. Это будет аккаунт куда инвесторы будут переводить SAFE деньги

---

## Шаг 9 — После активации (~1-2 недели от подачи)

Когда придёт от Stripe email "Your company is incorporated":
- [ ] Скачать **Stock purchase agreement** (доказательство что ты владеешь 100% shares)
- [ ] Скачать **EIN letter** (нужен для Mercury, налоговой, SAFE)
- [ ] Скачать **Certificate of Incorporation** (главный документ компании)
- [ ] Подать **83(b) election** в IRS в течение **30 дней** от формирования — это критично, без этого будут проблемы с налогами при vesting. Atlas присылает форму, ты подписываешь и отправляешь почтой в IRS. Без 83(b) можешь потерять десятки тысяч долларов налогов потом.

---

## Шаг 10 — Где взять SAFE template

Stripe Atlas даёт встроенный **YC post-money SAFE template**. Не используй другие — VC доверяют только YC формату.

В Stripe Atlas:
- Dashboard → **Issue SAFE**
- Заполни:
  - **Investor name:** (заполняет инвестор когда подписывает)
  - **Investment amount:** (по каждому отдельная сумма — $25k / $50k / $100k / $400k)
  - **Post-money valuation cap:** **$6,000,000**
  - **Discount rate:** **20%**
  - **MFN provision:** ✅ Yes (most-favored-nation — даёт инвестору лучшие условия будущих SAFE если они есть)
- Stripe генерирует PDF, отправляет инвестору на DocuSign через свой портал

---

## ⚠️ Что НЕ делай

- ❌ **Не выбирай LLC** — VC не пойдут
- ❌ **Не пропускай 83(b) election** — потеряешь много на налогах
- ❌ **Не используй Russian bank** для оплаты $500 — может не пройти санкции / freezer на Stripe side. Wise или Revolut работают.
- ❌ **Не указывай в Business description** "AI" слишком абстрактно — IRS / банки могут затормозить. "Software" + конкретика про pet-health — норм.
- ❌ **Не используй generic.com email** для регистрации (yahoo, mail.ru). Используй gmail или corporate email когда домен появится.

---

## Итого по тайму
- Регистрация в Atlas: **15-25 минут**
- Stripe ID verification: **1-3 дня**
- Delaware incorporation: **3-5 рабочих дней**
- EIN от IRS: **1-2 недели**
- Mercury bank account: **1-3 дня после EIN**
- **Полная готовность к приёму SAFE инвестиций: 2-3 недели**

Поэтому Atlas — **первое что делать**. Без C-corp + Mercury **первые `Yes` от инвесторов** просто упадут в пустоту — не сможешь принять деньги.
