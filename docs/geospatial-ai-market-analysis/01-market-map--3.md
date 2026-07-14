# Часть 1. Карта рынка — кластер 3 из 4

## Кластер: Риск, климат, недвижимость

Это кластер, где геопространственные данные монетизируются лучше всего за пределами обороны: здесь есть регуляторные дедлайны (CSRD, EUDR, климатические стресс-тесты), растущий физический ущерб (застрахованные катастрофические убытки растут на 5–7% в год в реальном выражении — Swiss Re sigma) и покупатели с большими P&L-мотивами (страховщики, банки, девелоперы). Ключевая методологическая рамка для всего кластера: по Novaspace, весь мировой рынок EO value-added services составил лишь $3,2 млрд в 2024 г. (CAGR 7%, прогноз $5 млрд к 2034 г.). Поэтому любые «отчёты», рисующие в отдельно взятой вертикали «геопространственный рынок» на $5–10 млрд, считают не спутниковую аналитику, а весь стек данных: аэрофотосъёмку, дроны, parcel-данные, кадастры, каталоги рисковых моделей и софт поверх них. В этом кластере деньги действительно лежат в этом широком стеке — чистый «спутниковый» SAM в каждой вертикали в разы меньше, чем SAM «property/risk intelligence» в целом. Ниже я везде разделяю эти уровни.

Второй общий сигнал: в 2023–2026 гг. кластер прошёл волну консолидации — Cape Analytics → Moody's (янв. 2025), Betterview → Nearmap (дек. 2023), Fathom → Swiss Re (дек. 2023), Pachama → Carbon Direct (ноя. 2025), Kayrros → Energy Aspects (май 2026), Everbridge → Thoma Bravo (2024). Стратеги-агрегаторы данных (Moody's, Verisk, Swiss Re, ICE) скупают point solutions до того, как те успевают дорасти до платформ. Это одновременно и exit-канал, и потолок для standalone-игроков.

---

### Страхование (P&C underwriting и claims)

**TAM.** Глобальные премии P&C — $2,4 трлн (2024, Swiss Re sigma 3/2025; рынок удвоился за 20 лет). Но премии — не TAM для софта. Релевантный TAM — расходы страховщиков на данные, аналитику и модели рисков: якорь — Verisk с выручкой $3,07 млрд (FY2025, 10-K, +6,6% г/г), почти целиком из P&C-данных/аналитики, при доле ~25–35% рынка страховых данных США [оценка]. Совокупный мировой рынок страховых данных и аналитики (underwriting + claims + cat-модели) — **$12–18 млрд в 2025 г. [оценка]**. SAM собственно геопространственной аналитики (aerial/satellite imagery + AI-атрибуты недвижимости + cat-модели + event response): генерик-отчёты дают $1,9–2,1 млрд в 2024 г. с CAGR 15–17% (Dataintelo/MarketIntelo — использовать с осторожностью); моя согласованная оценка снизу вверх (Verisk Extreme Event Solutions + underwriting-часть imagery-игроков EagleView/Nearmap/Vexcel + Moody's RMS/Insurance + ICEYE Insurance + скоринг ZestyAI и пр.) — **$3,5–4,5 млрд (2025)**, из них на «новую» AI-геоаналитику (не legacy cat-модели) — $1–1,5 млрд.

**CAGR.** Весь рынок страховых данных: 8–10% (2025–2030) [оценка]. Геопространственный SAM: 15–20% (2025–2030) — драйверы: рост cat-убытков (тренд к $145 млрд застрахованных потерь в 2025 г., Swiss Re sigma 1/2025; пожары в Лос-Анджелесе янв. 2025 — крупнейший wildfire-убыток в истории, sigma 1/2026), недоступность физических инспекций в масштабе, регуляторное давление на тарификацию wildfire в Калифорнии (модель ZestyAI допущена в rate filings).

**Основные клиенты.** (1) P&C-страховщики (в США ~50 групп контролируют 80% homeowners-премий): бюджеты на данные/модели у топ-carrier — $50–300 млн/год, у среднего регионального — $1–10 млн/год [оценка]. Решение принимают Chief Underwriting Officer, Chief Claims Officer, актуарии; procurement через пилот 6–18 мес. (2) Перестраховщики и брокеры (Swiss Re, Munich Re, Aon, Gallagher) — покупают модели и event-данные, всё чаще строят своё (Swiss Re купила Fathom). (3) MGA и insurtech-андеррайтеры — быстрые внедрения, малые чеки.

**Основные use cases.**
1. Property underwriting scoring: состояние крыши, растительность, defensible space, бассейны/трамполины — по аэроснимкам (Cape/Moody's, ZestyAI, Betterview/Nearmap).
2. Peril-скоринг wildfire/flood/hail на уровне адреса (Z-FIRE покрывает страховщиков ~40% рынка homeowners Калифорнии).
3. Замена физических инспекций виртуальными: $85–350 за выезд против <$1–5 за AI-оценку [оценка]; ZestyAI выдала 31 млн оценок в 2024 г., ожидала >46 млн в 2025 г.
4. Cat event response: SAR-снимки зоны бедствия за часы (ICEYE Flood Rapid Impact — 6–12 часов), приоритизация выплат и резервирование.
5. Claims-оценка и смета: Verisk Xactimate — стандарт отрасли (80% топ-carriers, >4,5 млн смет/год); aerial roof reports EagleView для градовых/ветровых убытков.
6. Управление аккумуляцией портфеля и перестраховочное ценообразование (Verisk EES, Moody's RMS).
7. Детекция фрода и pre-existing damage по историческим снимкам.
8. Book roll: переоценка всего портфеля при покупке книги бизнеса.

**Крупнейшие боли.**
- Растущая убыточность от катастроф: $137 млрд застрахованных потерь в 2024 г., тренд 5–7%/год реального роста (Swiss Re) — прямой мандат на лучшие данные.
- Кризис доступности страхования (Калифорния, Флорида): невозможность тарифицировать → уход carriers; регулятор впервые допустил forward-looking модели — окно для вендоров.
- Claims leakage 5–10% выплат [оценка, отраслевой консенсус] — на ~$500 млрд выплат США это десятки миллиардов.
- Стоимость и медленность инспекций: физическая инспекция каждого риска экономически невозможна при ренуале.
- Дуополия cat-моделей (Verisk EES + Moody's RMS, обе куплены за ~$2 млрд каждая в пересчёте: RMS — $2 млрд в 2021 г.) — страховщики хотят third view; показательно, что FTC в 2014 г. заблокировала покупку EagleView Verisk'ом за $650 млн именно из-за концентрации.

**Существующие софтверные решения.** Категории: (а) cat-модели — Verisk Extreme Event Solutions, Moody's RMS, Cotality; (б) property intelligence по снимкам — Cape (Moody's), ZestyAI, Betterview (Nearmap), EagleView, Vexcel (консорциум страховщиков); (в) event response — ICEYE, Floodbase; (г) claims workflow — Xactimate (Verisk), Cotality Claims/Symbility; (д) параметрика — Descartes Underwriting ($141 млн привлечено), Arbol, Floodbase; (е) дистрибуция через core-платформы — Guidewire HazardHub, Duck Creek marketplace.

**Лидеры рынка.**

| Компания | Выручка/масштаб | Позиция |
|---|---|---|
| Verisk | $3,07 млрд FY2025 (10-K), Underwriting-сегмент $2,18 млрд | Квази-монополия данных/смет США |
| Moody's (RMS + Cape + HighTower?) | RMS ~$350–450 млн [оценка] | №2 в cat-моделях, агрессивный M&A |
| Cotality (экс-CoreLogic) | ~$1,7 млрд общая [оценка; private, Stone Point/Insight, $6 млрд LBO 2021] | Данные property + claims + cat |
| EagleView | $400–600 млн [оценка] | Aerial imagery, крыши, claims |
| Nearmap (+Betterview) | ACV >$180 млн (2025) [оценка Sacra], Thoma Bravo | Imagery-подписка + underwriting-платформа |
| ICEYE | >€250 млн (2025, компания), EBITDA >€100 млн; страховая часть ~10–20% [оценка] | SAR event response; Series F >€1 млрд |
| ZestyAI | ~$30–60 млн [оценка]; $62 млн equity + $15 млн кредит (июнь 2025) | AI-скоринг wildfire/hail, допущен в CA rate filings |

**Вывод для инвестора.** Это самая монетизируемая вертикаль кластера: покупатель считает ROI в loss ratio, и точечный AI-продукт может встать в workflow с чеком $0,5–5 млн/год на carrier. Но независимые игроки системно скупаются на выручке $20–80 млн (Cape, Betterview, Fathom) — путь к $1 млрд ARR лежит не в «скоринге как фиче», а в замещении дуополии cat-моделей современным, постоянно обновляемым по снимкам «живым» view of risk, либо в вертикальной интеграции в сам риск (MGA/параметрика) с данными как преимуществом в убыточности. Регуляторное окно в Калифорнии/Флориде — редкий момент, когда carriers обязаны менять модели.

---

### Климатические риски и адаптация (climate risk analytics, TCFD/CSRD)

**TAM.** Широкий «climate risk management» генерик-отчёты оценивают в $7,4 млрд (2025, Roots Analysis) с ростом до ~$30 млрд к 2035 г. (CAGR ~14,8%) — но это сборная солянка из консалтинга, ESG-отчётности и софта. McKinsey оценивает climate resilience tech в целом как возможность на $1 трлн к 2030 г. — это TAM адаптационной экономики, а не софта. Реальный SAM физического climate-risk-анализа как софта/данных (то, что продают MSCI, S&P Sustainable1, Moody's, Jupiter, XDI, Climate X, First Street): **$0,8–1,5 млрд в 2025 г. [оценка]** — подтверждается снизу: у лидеров-стартапов выручки $10–40 млн, у подразделений рейтинговых агентств — низкие сотни миллионов на всё ESG&Climate.

**CAGR.** Софт-сегмент: 20–30% (2025–2030) [оценка; GM Insights даёт для софта 30,5% — генерик]. Важно: траектория стала волатильной из-за регуляторного отката (см. боли).

**Основные клиенты.** (1) Банки — климатические стресс-тесты ECB/BoE/APRA; чеки $0,3–3 млн/год на tier-1 банк. (2) Страховщики и перестраховщики. (3) Asset managers / private markets — screening портфелей; данные покупает риск-департамент или ESG-команда. (4) Корпораты под CSRD — сотни тысяч компаний потенциально, чеки $30–150 тыс. (5) Инфраструктура и data centers: XDI в 2025 г. проанализировала ~9 000 дата-центров — гиперскейлеры становятся прямыми покупателями. Решение принимает CRO (банки), head of sustainability (корпораты) — второй тип бюджета заметно слабее.

**Основные use cases.**
1. Отчётность TCFD/ISSB/CSRD: физические риски по активам для disclosure.
2. Стресс-тесты и кредитный риск: перевод hazard-карт в PD/LGD ипотечных и корпоративных портфелей.
3. Due diligence сделок M&A/недвижимости и site selection (включая дата-центры).
4. Adaptation planning: cost-benefit защитных мер (McKinsey MGI: адаптация «окупает себя»; XDI Adaptation report).
5. Скрининг цепочек поставок (CSRD требует value chain).
6. Интеграция в андеррайтинг и pricing страховщиков (пересечение с вертикалью 1).
7. B2C2B-дистрибуция: климатические скоры на листингах Realtor.com, Redfin, Homes.com (First Street).

**Крупнейшие боли.**
- Регуляторный откат: EU Omnibus (февр. 2025) сократил охват CSRD на ~80% компаний; SEC в 2025 г. отказалась защищать climate disclosure rule. Спрос, построенный на комплаенсе, оказался хрупким; выжил спрос, построенный на деньгах (банки, страховщики, инфраструктура).
- Валидация моделей: downscaling CMIP-сценариев до адреса научно шаток; damage functions (hazard → $) — главный источник расхождений между вендорами в разы; покупатели это знают и торгуются.
- Willingness-to-pay в B2C: Zillow добавил скоры First Street в 2024 г. и убрал их в ноябре–декабре 2025 г. под давлением риелторов — прямое свидетельство, что прозрачность риска разрушает чью-то экономику.
- Коммодитизация hazard-слоя: открытые данные (Copernicus, NOAA, First Street non-profit наследие) прижимают цену на «карты», маржа уходит в финансовую интерпретацию.

**Существующие софтверные решения.** Категории: (а) physical risk platforms — Jupiter Intelligence (Series C $54 млн, всего ~$100 млн), XDI/Climate Risk Group, Climate X (Series A $18 млн, GV), First Street (> $50 млн; General Catalyst), Riskthinking.AI, Fathom (Swiss Re) для flood; (б) встроенные в финансовую инфраструктуру — MSCI Climate (через покупки Carbon Delta, RiskMetrics), S&P Global Sustainable1 (The Climate Service), Moody's Climate on Demand + Cape, Verisk, Bloomberg; (в) ESG-отчётные суперприложения, добавляющие физрриск — Watershed, Persefoni [смежные]; (г) страховые cat-модели, растянутые в климат-сценарии (RMS Climate Change Models).

**Лидеры рынка.** Фактические лидеры по выручке — не стартапы, а MSCI/S&P/Moody's (climate-аналитика внутри ESG-сегментов, по $150–400 млн run-rate каждая на всё ESG&Climate [оценка]); среди независимых — XDI и Jupiter (по $15–40 млн [оценка]); First Street — уникальная дистрибуция через порталы, но монетизация пострадала от решения Zillow.

**Вывод для инвестора.** Ставка «регуляция заставит всех купить климат-аналитику» частично сломалась в 2025 г. — Omnibus и SEC-откат срезали хвост спроса, и standalone-платформы застряли на $10–40 млн выручки при высокой конкуренции с рейтинговыми агентствами. Устойчивый спрос там, где климат уже бьёт по деньгам: страховая тарификация, ипотечные портфели, дата-центры и адаптационный капекс ($1 трлн возможность McKinsey). Строить стоит не «отчёт для CSRD», а систему принятия капитальных решений (adaptation ROI, site selection) — и держать в уме, что MSCI/Moody's купят любого, кто докажет data moat.

---

### Экологический мониторинг (carbon MRV, метан, биоразнообразие)

**TAM.** Три подрынка с разной экономикой. (1) Voluntary carbon market: расходы конечных покупателей — лишь ~$1,0–1,4 млрд (2024–2025, Ecosystem Marketplace/MSCI); ретайрменты 168 млн кредитов (−4,5% в 2025 г.), средняя цена $6,10; но offtake-сделки выросли до $12,3 млрд в 2025 г. (с $3,95 млрд в 2024 г.), а MSCI Carbon Markets прогнозирует рынок $7–35 млрд к 2030 г. и $45–250 млрд к 2050 г. MRV/рейтинги исторически берут 1–5% от стоимости рынка → сегодняшний SAM carbon-MRV/ratings — **$100–300 млн [оценка]** (генерик-оценки «remote sensing MRV $1,7 млрд» — завышены за счёт включения всего agtech). (2) Метан: покупатели — нефтегаз и регуляторы; SAM спутниковой детекции — **$150–400 млн (2025) [оценка]** (GHGSat + Kayrros + госконтракты). (3) Биоразнообразие/nature data (TNFD, EUDR): EUDR-комплаенс — самый быстрорастущий кусок; LiveEO называет EUDR «первым массовым рынком EO-аналитики»; SAM deforestation-комплаенса — **$200–500 млн к 2027 г. [оценка]** при обязательности для тысяч импортёров ЕС. Суммарный геопространственный SAM вертикали: **$0,5–1,2 млрд (2025–2026) [оценка]**.

**CAGR.** VCM-MRV: высокая неопределённость, 10–25% с опционом на кратный рост при интеграции с compliance-рынками (CORSIA; четверть ретайрментов 2025 г. уже связана с комплаенс-схемами). Метан: в ЕС рост (EU Methane Regulation: с 2027 г. требования к импортёрам), в США откат (отмена methane fee Конгрессом в 2025 г.). EUDR: скачкообразный спрос по дедлайну 30 декабря 2025 г. (крупные операторы; регламент — какао, кофе, соя, пальмовое масло, каучук, КРС, древесина).

**Основные клиенты.** Carbon: девелоперы проектов, покупатели кредитов (корпораты), биржи/реестры, инвестфонды — бюджеты малы и цикличны. Метан: суперкрупный нефтегаз (ExxonMobil, Aramco — оба клиенты GHGSat), регуляторы и UNEP (IMEO), трейдеры. EUDR: procurement/compliance-команды импортёров (FMCG, кофе/какао-трейдеры) — чеки $50–500 тыс./год, решение принимает chief procurement/compliance officer — это deadline-driven бюджет, самый надёжный в вертикали. Биоразнообразие: финансовые институты, добывающие компании (TNFD: 500+ организаций-адоптеров).

**Основные use cases.**
1. Оценка и рейтингование лесных карбоновых проектов (Sylvera, BeZero, Renoster): baselines, additionality, leakage; премия за качество реальна — кредиты A–AAA торгуются по ~$14,8/т против $3,5/т у CCC–B (MSCI, 2025).
2. Digital MRV биомассы: Planet Forest Carbon Diligence (3-метровые карты запасов углерода), Chloris, Kanop — сокращение цикла верификации с 18–24 до 4–6 мес.
3. Детекция и атрибуция метановых утечек: GHGSat (14 спутников, +9 к концу 2026 г.; 8,3 млн т метана атрибутировано 3 000+ объектам), Kayrros по Sentinel-5P; потерянный MethaneSAT (запуск март 2024 — потеря связи 20 июня 2025) показал и ценность, и хрупкость модели «один спутник — одна НКО».
4. EUDR due diligence: геолокация участков поставщиков + доказательство отсутствия обезлесения после 2020 г. (LiveEO TradeAware, Satelligence, Planet, Global Forest Watch).
5. Мониторинг нелегальных рубок в реальном времени (ICEYE deforestation SAR-продукт, март 2026).
6. Nature/TNFD-скрининг портфелей: state-of-nature датасеты (100+ датасетов от 40+ провайдеров протестировано в TNFD-песочнице на инфраструктуре Esri, 2025).
7. Мониторинг ковенант «зелёного» долга и sustainability-linked loans.

**Крупнейшие боли.**
- Кризис доверия VCM 2023–2024 гг. уронил объёмы; цена ошибки MRV — обесценение проектов на сотни миллионов (скандалы с avoided-deforestation методологиями Verra).
- Покупатель MRV беден: маржа проекта не выдерживает дорогой верификации; отсюда пивоты и продажи (Pachama, подняв $88 млн, продалась Carbon Direct в ноябре 2025 г.; Kayrros, подняв ~$81 млн, продалась Energy Aspects в мае 2026 г.).
- Регуляторные качели: США ослабляют (methane fee отменён), ЕС усиливает, но с задержками (EUDR перенесён на год, упрощения для микрокомпаний).
- Фундаментальная точность: спутниковая аллометрия биомассы имеет погрешности 10–30%, что при цене кредита $6 делает споры о тоннах экзистенциальными.

**Существующие софтверные решения.** Рейтинги кредитов (Sylvera — $99,6 млн привлечено; BeZero; MSCI Carbon Markets — экс-Trove); MRV-платформы (Pachama/Carbon Direct, Chloris, Space Intelligence, Kanop); метан (GHGSat, Kayrros/Energy Aspects, Orbio); EUDR/supply chain (LiveEO — >€72 млн привлечено, Satelligence, Picterra+клиенты); данные как сервис (Planet, Airbus); биоразнообразие (NatureAlpha, Iceberg Data Lab, NatureMetrics — eDNA, не гео).

**Лидеры рынка.** GHGSat — крупнейший чистый игрок метана (~$50–80 млн выручки [оценка], собственная группировка); Planet — инфраструктурный поставщик для половины MRV-стартапов (общая выручка $307,7 млн FY2026, +26%, но лишь малая часть — эта вертикаль); Sylvera/BeZero — дуополия рейтингов при выручках $10–25 млн [оценка]; LiveEO/Satelligence — лидеры EUDR-волны.

**Вывод для инвестора.** Вертикаль богата миссией и бедна деньгами: совокупный SAM около $1 млрд не вмещает компанию с $1 млрд ARR — на горизонте 10 лет ставка работает только как опцион на превращение VCM в compliance-рынок ($45–250 млрд к 2050 г. по MSCI) либо как EUDR-плацдарм с экспансией в общий supply-chain-комплаенс (CSDDD, углеродные пошлины CBAM). Судьбы Pachama и Kayrros показывают: standalone-MRV — это фича для трейдинговых/комплаенс-платформ, а не компания. Входить стоит через владение транзакцией (биржа/оффтейк с встроенным MRV), а не через продажу пикселей.

---

### Управление катастрофами (disaster management, emergency response)

**TAM.** Границы рынка «гуляют» сильнее всего: узкий сегмент ПО для emergency management — $1,0–1,7 млрд (2025, генерик-оценки Business Research/GrowthMarketReports расходятся из-за включения mass notification); широкий «incident & emergency management» (включая железо, интеграцию, услуги) — $20 млрд+ (2025, генерик). Ориентир сверху: госрасходы только FEMA — ~$30 млрд/год, глобальные экономические потери от катастроф >$160 млрд за одно полугодие 2025 г. (Aon/McKinsey). Геопространственный SAM (детекция, mapping, damage assessment, common operating picture): **$0,7–1,5 млрд (2025) [оценка]**, включая госзакупки EO-данных для ЧС.

**CAGR.** 10–14% (2025–2032) [консенсус генерик-отчётов, направленно верен]: драйверы — рост частоты бедствий (27 «миллиардных» катастроф в США в 2024 г. — 3x к среднему за 44 года), национальные программы раннего обнаружения пожаров, wildfire-митигация utilities.

**Основные клиенты.** (1) Государства: агентства гражданской защиты, пожарные службы (Греция первой в мире интегрировала выделенную спутниковую группировку OroraTech в национальную систему пожаротушения, 2026), rescEU/ЕС, FEMA и штаты США. Бюджеты проектные, $1–50 млн, циклы 12–36 мес. (2) Utilities — самый платёжеспособный сегмент: планы wildfire-митигации калифорнийских utilities измеряются миллиардами долларов в год, покупают детекцию (Pano AI), vegetation management (LiveEO, AiDash), PSPS-аналитику. (3) Страховщики (event response — пересечение с вертикалью 1). (4) Корпорации — business continuity (Everbridge).

**Основные use cases.**
1. Раннее обнаружение пожаров: наземные камеры + AI (Pano AI — $44 млн Series B, июнь 2025, всего $89 млн), тепловые спутники (OroraTech — 8+ аппаратов, Series B до €37 млн; FireSat альянса Google/Muon Space — первый запуск март 2025).
2. Флуд-мэппинг в реальном времени: ICEYE Flood Insights — глубина и охват затопления за часы; используется страховщиками и правительствами (пересечение вертикалей).
3. Damage assessment после события: автоматическая оценка разрушений по SAR/aerial для FEMA-грантов и триажа выплат.
4. Common operating picture: Esri ArcGIS — де-факто стандарт ситуационных центров.
5. Массовое оповещение и evacuation management: Everbridge, Genasys (зоны эвакуации Zonehaven).
6. Vegetation management сетей: приоритизация обрезки по спутниковым данным (AiDash, LiveEO, Overstory).
7. Параметрические триггеры для anticipatory financing (Floodbase, страновые программы Всемирного банка).

**Крупнейшие боли.**
- Бюджетная волатильность: реформа/сокращение FEMA в 2025 г. переносит расходы на штаты — фрагментация закупок; в ЕС наоборот — рост (rescEU, Copernicus Emergency Management).
- «Pilot purgatory»: госзаказчик охотно пилотирует и медленно масштабирует; sales-цикл дольше runway стартапа.
- Цена пропуска события экстремальна (пожар Лахайны — $5,5 млрд застрахованных потерь), но покупатель платит за готовность, а не за срабатывание — сложно показать ROI в мирный год.
- Интеграционный зоопарк: CAD/911, сирены, камеры, спутники, дроны — никто не владеет полным стеком.

**Существующие софтверные решения.** Детекция (Pano AI, OroraTech, Dryad — сенсоры, ALERTCalifornia); EO event response (ICEYE, Planet, Maxar Open Data); CEM/оповещение (Everbridge, Genasys, RapidSOS); COP/GIS (Esri, Palantir для нацбезопасности); damage assessment AI (Microsoft AI for Good, Vexcel post-cat программы); utility-митигация (AiDash, Overstory, Pano).

**Лидеры рынка.** Esri (частная, ~$1,5 млрд общей выручки [оценка], доминирует в гос-GIS); Everbridge (~$450–490 млн выручки [оценка], выкуплена Thoma Bravo за ~$1,8 млрд в 2024 г.); ICEYE (>€250 млн, но большая часть — оборона); Genasys ($34 млн FY2025 run-rate по кварталам 8-K, растёт со 152% в Q4 — эффект контрактов после пожаров LA); Pano AI и OroraTech — категорийные лидеры детекции до $30 млн выручки [оценка].

**Вывод для инвестора.** Как чистый рынок — худшее из двух миров: госзакупки без гособоронных бюджетов. Но есть два обходных пути с венчурной экономикой: (1) продавать utilities, у которых wildfire-митигация — обязательный, миллиардный и растущий капекс с регуляторным драйвером (CPUC), и (2) связка «детекция → параметрический триггер → страховая выплата», где данные конвертируются в долю от риск-премии. Компания на $1 млрд ARR здесь не вырастает из emergency-софта, но может вырасти из «климатической ПВО» для критической инфраструктуры (детекция + предикция + автоматизация решений) — рынок, который сейчас собирается из кусков.

---

### Недвижимость (property intelligence)

**TAM.** Рынок данных и аналитики недвижимости (resi + CRE, США + глобально): якоря — CoStar ($3,23–3,24 млрд выручки 2025, +18%, guidance), Cotality/экс-CoreLogic (~$1,7 млрд [оценка; LBO Stone Point/Insight за $6 млрд, 2021]), Zillow ($2,6 млрд 2025, 10-K — но это медиа/лиды, не данные), ICE Mortgage Technology (Black Knight куплен за $11,7 млрд в 2023 г.), First American Data & Analytics, ATTOM, LightBox. Совокупный TAM данных/аналитики недвижимости — **$12–16 млрд (2025) [оценка]**. SAM геопространственного property intelligence (imagery-derived атрибуты, parcel-данные, климатические скоры, AVM-фичи): **$2,5–3,5 млрд (2025) [оценка]** — EagleView + Nearmap + Vexcel + parcel/location-слои Cotality/LightBox/Regrid + climate-скоры.

**CAGR.** Базовый рынок данных недвижимости: 8–12%; геопространственный SAM: 12–15% (2025–2030) [оценка] — драйверы: модернизация оценки залога (appraisal waivers Fannie/Freddie с inspection-based данными), климатическая переоценка стоимости жилья, muni-сегмент (переоценка налоговой базы по aerial-съёмке).

**Основные клиенты.** (1) Ипотечные кредиторы и GSE — оценка залога, портфельный мониторинг; решает chief credit/valuation officer. (2) Страховщики (пересечение с вертикалью 1 — крупнейший покупатель imagery-атрибутов). (3) CRE-инвесторы, брокеры, банки — due diligence (Cherre «поверх» $3 трлн AUM; LightBox RCM — ~50% investment sales >$10 млн в США). (4) Муниципалитеты — налоговая оценка (EagleView исторически вырос на county-контрактах). (5) Порталы и proptech — климатические и рисковые скоры (First Street на Realtor.com, Redfin, Homes.com). (6) Solar/roofing/telecom-подрядчики. Чеки: от $10 тыс. (подрядчики) до $5–20 млн/год (GSE, топ-страховщики) [оценка].

**Основные use cases.**
1. Автоматическая оценка залога/AVM с imagery-фичами (состояние крыши, пристройки, бассейн) — замена физической оценки ($400–700 за appraisal) данными.
2. Климатическая корректировка стоимости: скоры flood/fire/heat на листингах и в ипотечном андеррайтинге.
3. CRE due diligence: environmental site assessment, зонирование, арендные потоки (LightBox, Cherre, CoStar).
4. Налоговая переоценка: обнаружение незадекларированных улучшений по разновременной aerial-съёмке.
5. Site selection ритейла/логистики/ЦОД: parcel + трафик + риски.
6. Мониторинг портфеля REIT: изменение состояния активов без выездов.
7. Roof/solar measurement reports для подрядчиков (EagleView — категория, которую он создал).

**Крупнейшие боли.**
- Информация о климатическом риске разрушает ликвидность: Zillow убрал климатические скоры First Street в конце 2025 г. под давлением агентов — рынок жилья сопротивляется прозрачности; ипотечный канал (кредитор платит за риск-данные) устойчивее B2C.
- Фрагментация parcel/permit-данных по 3 000+ округов США — вечная боль, вечная возможность (Regrid, ATTOM живут на этом).
- CRE-даунтёрн 2023–2025 гг. (офисы) сжал бюджеты брокеров/инвесторов; LightBox CRE-индекс восстановился только к 2025 г.
- Стоимость съёмки: полное покрытие США высокоразрешающей aerial-съёмкой 2–3 раза в год — капиталоёмкая олигополия (EagleView, Nearmap, Vexcel), спутники (Planet, Airbus) дешевле, но 30–50 см недостаточно для крыш.

**Существующие софтверные решения.** Imagery + атрибуты (EagleView, Nearmap, Vexcel, GAF QuickMeasure); property data platforms (Cotality, ATTOM, First American, Regrid, LightBox, Cherre — data fabric); AVM/valuation (Cotality, HouseCanary, Clear Capital); климат-скоры (First Street, ClimateCheck); CRE-платформы (CoStar, MSCI Real Assets/экс-RCA).

**Лидеры рынка.** CoStar ($3,2 млрд, CRE-монополия по сути), Cotality (~$1,7 млрд [оценка]), ICE Mortgage Tech (данные Black Knight внутри $25+ млрд ICE), EagleView ($400–600 млн [оценка]), Nearmap (>$180 млн ACV [оценка]), LightBox (~$200–300 млн [оценка]), First Street (<$30 млн [оценка], но уникальная дистрибуция).

**Вывод для инвестора.** Большой, прибыльный, но оккупированный рынок: CoStar и Cotality показывают, что в данных недвижимости строятся компании и на $3 млрд+ выручки — прецедент $1 млрд ARR здесь уже есть, в отличие от остальных вертикалей кластера. Открытая позиция — «живой цифровой двойник каждого здания» для ипотеки и страхования одновременно: инкумбенты владеют записями (records), но не текущим физическим состоянием актива; тот, кто сошьёт imagery-AI с транзакционными workflow (оценка залога, ренуал полиса), атакует сразу два бюджета. Риск: капиталоёмкость съёмки и патентная агрессия инкумбентов (EagleView vs Nearmap судились с 2021 г., урегулировано в мае 2026 г.).

---

### Строительство (progress monitoring, earthworks)

**TAM.** Мировой объём строительства — $13–15 трлн/год, но софт-TAM скромен: construction management software — $10,6 млрд (2025) → $17,8 млрд к 2031 г., CAGR ~9% (Mordor Intelligence); топ-5 (Oracle, Autodesk, Procore, Trimble, Bentley) держат ~45%. AI-contech — $2,3 млрд (2025) → $7,2 млрд к 2029 г., CAGR 33% [генерик, направленно верно]. SAM геопространственного слоя (reality capture, progress monitoring, drone/earthworks-аналитика, machine control софт): **$1,5–2,5 млрд (2025) [оценка]**: Trimble Civil Construction (~$0,8–1 млрд с железом [оценка] внутри общей выручки Trimble $3,37–3,47 млрд, guidance 2025), Komatsu Smart Construction, Hexagon/Leica, DroneDeploy, Propeller, OpenSpace, Doxel, Buildots.

**CAGR.** Reality capture / progress AI: 25–35% (2025–2029) [оценка]; venture-сигнал: contech-стартапы с AI собрали $2,22 млрд за 9 мес. 2025 г. — 46% всех инвестиций в contech.

**Основные клиенты.** (1) Генподрядчики (GC) — прогресс, документация, споры; маржа GC 2–4%, поэтому продавать надо экономию конкретных статей. (2) Heavy civil / earthworks-подрядчики и карьеры — объёмы выемки/насыпи, оплата по кубометрам (Propeller: 80 тыс. пользователей, 40 тыс. площадок). (3) Владельцы/девелоперы и особенно гиперскейлеры: бум ЦОД — OpenSpace задействован на 1 000+ строек дата-центров; owner платит за независимую верификацию прогресса охотнее, чем GC. (4) Кредиторы/страховщики строек — draw inspections. Решают VDC/операционные директора; чеки $50–500 тыс./год на компанию.

**Основные use cases.**
1. Progress tracking против BIM/графика: 360°-камеры + CV (OpenSpace — 95 тыс. проектов, купил Disperse; Buildots — Series D $45 млн, 2025; Doxel — $121 млн привлечено).
2. Earthworks: дрон-съёмка → cut/fill объёмы, контроль по кубометрам (Propeller, DroneDeploy).
3. Machine control / стройка по 3D-модели (Trimble Earthworks, Komatsu, Leica) — прямое сокращение переделок.
4. Верификация платежей и draw inspections для кредиторов — фотодоказательство выполненных объёмов.
5. Документация для споров: средний строительный спор в мире — $42,8 млн и 13,4 мес. (Arcadis, 2023 [оценка года]); объективная запись площадки радикально снижает издержки.
6. Safety/compliance-мониторинг (DroneDeploy Safety AI, 2025).
7. Мониторинг удалённых портфелей строек владельцем (REIT, ритейл-сети, гиперскейлеры).

**Крупнейшие боли.**
- Переделки (rework) — 5–9% стоимости контракта; только «плохие данные и коммуникация» стоили стройке США ~$31 млрд/год (FMI/Autodesk, 2018 [оценка]).
- Систематические срывы сроков/бюджета (большинство мегапроектов за бюджетом — McKinsey оценивал недобор производительности отрасли в $1,6 трлн/год) — но боль размазана, покупатель точечный.
- Ручной сбор данных: обходы площадки съедают 10–20% времени суперинтендантов [оценка]; камеры/дроны решают capture, но не решение.
- Низкая цифровая зрелость и текучка субподрядчиков; продукт должен работать «с касок», иначе adoption умирает.
- Фрагментация стека: capture (дрон/камера) — отдельно, ERP/PM (Procore — $1,3 млрд выручки FY2025) — отдельно; интеграционный налог высок.

**Существующие софтверные решения.** Progress AI (OpenSpace, Buildots, Doxel, Reconstruct); drone mapping/earthworks (DroneDeploy — 3 млн площадок, AI-агенты Progress/Safety/Inspection с 2025 г.; Propeller, Pix4D); machine control (Trimble, Topcon, Leica, Komatsu Smart Construction); PM-платформы как канал (Procore, Autodesk Construction Cloud — обе с marketplace-интеграциями); спутниковый мониторинг портфелей строек (SkyFi/Planet — нишевое).

**Лидеры рынка.** Trimble (общая выручка $3,4 млрд; в civil-сегменте — лидер machine control), Hexagon, Autodesk/Procore (платформы-шлюзы), DroneDeploy (~$100 млн ARR [оценка]), OpenSpace/Buildots/Doxel (по $20–50 млн ARR [оценка]) — ни один чистый progress-игрок ещё не вышел за $100 млн.

**Вывод для инвестора.** Capture коммодитизировался (камеры, дроны, скоро — краулеры), а ценность сместилась к верификации денег: оплата субподрядчиков, draw-финансирование, страхование строек, споры — там, где кубометр или процент готовности превращается в платёж. Бум дата-центров даёт редкого богатого и цифрового заказчика-владельца, который платит за независимую правду о прогрессе. Путь к большой компании — не «ещё один progress-дашборд для GC», а финансово-верификационный слой стройки (construction fintech на геоданных); чистые progress-стартапы, скорее всего, будут куплены Procore/Autodesk/Trimble до $100 млн ARR.

---

### Сводка по кластеру

| Вертикаль | TAM (широкий) | Гео-SAM 2025 [оценка] | CAGR SAM | Зрелость | Прецедент $1B+ ARR |
|---|---|---|---|---|---|
| Страхование P&C | $12–18 млрд (данные/аналитика) | $3,5–4,5 млрд | 15–20% | Консолидация | Verisk ($3,07 млрд) |
| Климат-риск/адаптация | $7,4 млрд (2025, генерик) | $0,8–1,5 млрд | 20–30% | Ранняя, откат регуляций | Нет (внутри MSCI/S&P) |
| Экомониторинг/MRV | VCM $1–1,4 млрд спот | $0,5–1,2 млрд | 10–25%+ | Ранняя, хрупкая | Нет |
| Катастрофы | $1–20 млрд (границы гуляют) | $0,7–1,5 млрд | 10–14% | Фрагментирована | Нет (Esri — смежно) |
| Недвижимость | $12–16 млрд (данные) | $2,5–3,5 млрд | 12–15% | Зрелая, олигополия | CoStar, Cotality |
| Строительство | $10,6 млрд (софт) | $1,5–2,5 млрд | 25–35% | Растущая | Procore (смежно) |

Общий вывод по кластеру: единственные вертикали, где геоданные уже сегодня несут SAM, совместимый с амбицией $1 млрд ARR, — страхование и недвижимость, и они же самые защищённые инкумбентами; самый быстрый органический рост — в строительном reality capture и климат-аналитике для финансовых институтов; самые хрупкие ставки — carbon MRV и госзакупки в disaster management. Сквозная возможность кластера — единый «живой» слой физического состояния активов (здание/участок/стройка), продаваемый одновременно страховщику, кредитору и владельцу: сегодня эти три бюджета обслуживают разные вендоры с одними и теми же пикселями.

---

### Источники по кластеру

- Swiss Re Institute, sigma 3/2025 "Growing stronger: P&C market adapts to riskier world" (P&C премии $2,4 трлн), 2025, https://www.swissre.com/institute/research/sigma-research/sigma-2025-03-property-casualty-growing-stronger-riskier-world.html
- Swiss Re Institute, sigma 1/2025 "Natural catastrophes: insured losses on trend to USD 145 billion" и sigma 1/2026 (natcat 2025), 2025–2026, https://www.swissre.com/institute/research/sigma-research/sigma-2025-01-natural-catastrophes-trend.html
- Verisk Analytics, Form 10-K FY2025 и пресс-релизы квартальных результатов 2025 (выручка $3,07 млрд; Underwriting $2,18 млрд), 2026, https://www.sec.gov/Archives/edgar/data/1442145/000143774926004452/vrsk20251231_10k.htm
- Moody's Corporation, пресс-релиз "Moody's to Acquire CAPE Analytics", январь 2025, https://ir.moodys.com/press-releases
- ICEYE, "ICEYE announces 2025 financials: €250M+ revenue, €100M+ profitability, €1.5B backlog", 2026, https://www.iceye.com/newsroom/press-releases/iceye-announces-2025-financials
- Nearmap/Betterview — Coverager, Reinsurance News об acquisition (дек. 2023); Sacra, оценка ACV Nearmap 2025, https://sacra.com/c/iceye/ (профили)
- ZestyAI, корпоративные пресс-релизы и презентация для Washington OIC wildfire workgroup (31 млн оценок 2024, 46 млн план 2025; Z-FIRE ~40% CA homeowners), 2025, https://zesty.ai/ и https://www.insurance.wa.gov/sites/default/files/2025-07/wildfire-wg-zestyai-presentation.pdf
- Swiss Re, пресс-релиз "Swiss Re acquires Fathom, a leader in water risk intelligence", декабрь 2023, https://www.swissre.com/press-release/
- McKinsey & Company, "Climate resilience technology: Capturing value in a $1T market", 2025, https://www.mckinsey.com/capabilities/sustainability/our-insights/climate-resilience-technology-an-inflection-point-for-new-investment
- McKinsey Global Institute, "Advancing adaptation: mapping costs from cooling to coastal defenses", 2025, https://www.mckinsey.com/mgi/our-research/advancing-adaptation-mapping-costs-from-cooling-to-coastal-defenses
- Roots Analysis / GM Insights, Climate Risk Management Market ($7,4 млрд 2025; софт CAGR 30,5%) — генерик-отчёты, использованы с осторожностью, 2025, https://www.rootsanalysis.com/climate-risk-management-market
- XDI (Cross Dependency Initiative), "2025 Global Data Centre Physical Climate Risk and Adaptation Report" (~9 000 сайтов), 2025, https://xdi.systems/news/2025-global-data-centre-physical-climate-risk-and-adaptation-report
- Climate X, пресс-релиз Series A ($18 млн, GV), https://www.climate-x.com/articles/press-releases/series-a
- TechCrunch / The Real Deal / CNN, "Zillow drops climate risk scores after industry pushback", декабрь 2025, https://techcrunch.com/2025/12/01/zillow-drops-climate-risk-scores-after-agents-complained-of-lost-sales/
- Zillow Group, Form 10-K FY2025 (выручка $2,6 млрд, +16%), 2026, https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm
- CoStar Group, квартальные результаты и guidance 2025 ($3,23–3,24 млрд, +18%), 2025, https://investors.costargroup.com/
- Cotality (экс-CoreLogic), пресс-релиз о ребрендинге, март 2025, https://www.cotality.com/press-releases/meet-cotality
- Ecosystem Marketplace, "State of the Voluntary Carbon Market 2025", 2025, https://3298623.fs1.hubspotusercontent-na1.net/hubfs/3298623/SOVCM%202025/
- Sylvera, "State of Carbon Credits 2025" (168 млн ретайрментов, $6,10 средняя цена, offtakes $12,3 млрд), 2025, https://www.sylvera.com/state-of-carbon-credits
- MSCI Carbon Markets, прогнозы рынка ($7–35 млрд к 2030; $45–250 млрд к 2050) и премии за рейтинг (A–AAA $14,80/т vs CCC–B $3,50/т), 2025
- EDF/MethaneSAT, "MethaneSAT Loses Contact with Satellite", июнь 2025, https://www.edf.org/media/methanesat-loses-contact-satellite
- GHGSat, пресс-релизы о расширении группировки (+9 спутников к 2026; 8,3 млн т метана, 3 000+ объектов; клиенты ExxonMobil, Aramco), 2025–2026, https://www.ghgsat.com/en/newsroom/
- IEA, "Global Methane Tracker 2026", 2026, https://www.iea.org/reports/global-methane-tracker-2026/
- TNFD, "2025 Status Report" и "Recommendations for upgrading the nature data value chain" (500+ адоптеров; 100+ датасетов, 40+ провайдеров), сентябрь–октябрь 2025, https://tnfd.global/
- LiveEO, пресс-релизы о раундах (>€72 млн; €28 млн транш) и TradeAware/EUDR, 2024–2026, https://www.live-eo.com/; Payload Space, https://payloadspace.com/liveeo-raises-e28m-to-fund-its-first-constellation/
- FoodNavigator, "EUDR: Earth observation data vital for compliance" (Satelligence, LiveEO, дедлайн 30.12.2025), июль 2025, https://www.foodnavigator.com/Article/2025/07/31/eudr-earth-observation-data-vital-for-compliance/
- Novaspace (экс-Euroconsult), "Earth Observation Data and Services Market" (EO VAS $3,2 млрд 2024, CAGR 7%, $5 млрд к 2034; рынок EO >$8 млрд к 2033), 2025, https://nova.space/press-release/commercial-earth-observation-market-surpasses-8-billion-by-2033/
- Planet Labs PBC, "Financial Results for Q4 and Full Fiscal Year 2026" ($307,7 млн, +26%, backlog $900 млн), март 2026, https://www.businesswire.com/news/home/20260319782110/en/
- Genasys Inc., Form 10-K FY2025 и 8-K quarterly (Q4 FY2025 $17,0 млн, +152,6%), 2025–2026, https://www.sec.gov/Archives/edgar/data/924383/
- Pano AI, пресс-релиз Series B $44 млн (Giant Ventures; всего $89 млн), июнь 2025, https://www.globenewswire.com/news-release/2025/06/16/3099902/
- Fortune, "Greece tackles climate change wildfire risk with satellite network" (OroraTech, первая национальная спутниковая интеграция), июнь 2026, https://fortune.com/2026/06/26/greece-wildfire-satellite-ai-eu-funding-ororatech-2026/
- Descartes Underwriting, пресс-релизы (параметрический flood в США до $70 млн на контракт; $141 млн привлечено), 2025, https://descartesunderwriting.com/
- Procore Technologies, Form 8-K Q4/FY2025 (выручка ~$1,3 млрд), 2026, https://www.sec.gov/Archives/edgar/data/1611052/
- Mordor Intelligence, Construction Management Software Market ($10,6 млрд 2025 → $17,8 млрд 2031, CAGR 9%) — генерик, направленно надёжен, 2025, https://www.mordorintelligence.com/industry-reports/construction-management-software-market
- AEC Magazine, "OpenSpace acquires Disperse" и профили contech ($199 млн привлечено OpenSpace; 95 тыс. проектов; 1 000+ строек ЦОД; Buildots Series D $45 млн; contech AI $2,22 млрд инвестиций за 9М2025), 2025–2026, https://aecmag.com/
- Trimble Inc., Form 10-Q FY2025 и Annual Report 2025 (guidance $3,37–3,47 млрд), 2025, https://www.sec.gov/Archives/edgar/data/864749/
- Arcadis, "Global Construction Disputes Report" (средний спор $42,8 млн, 13,4 мес.), 2023 [использовано как оценка]
- FMI/Autodesk, "Construction Disconnected" (плохие данные ~$31 млрд/год стройке США), 2018 [использовано как оценка]
- Dataintelo/MarketIntelo, отчёты Geospatial Risk Platforms for Insurance ($1,9 млрд 2024) и Geospatial Analytics in Insurance ($2,1 млрд 2024) — генерик-отчёты, помечены и использованы только как вилка, 2024–2025
- Tracxn/PitchBook/Crunchbase (через прессу): раунды и M&A — Pachama → Carbon Direct (ноя. 2025), Kayrros → Energy Aspects (май 2026), Sylvera ($99,6 млн), Jupiter Intelligence (Series C $54 млн), 2025–2026
