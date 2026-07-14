## Идеи 61-80: Сельское хозяйство, лес, горнодобыча, углерод/экология/природный капитал

> Кластер природных активов (natural capital) — это ~$3-4 трлн ежегодных капиталопотоков (агрокредит, страхование урожая, farmland/timberland AUM, exploration budgets, углеродные и биоразнообразие-рынки, mitigation banking), которые до сих пор управляются на Excel, полевых обходах и лабораторных пробах. Гео-данные (Sentinel-1/2 SAR+optical бесплатно, Planet/Maxar/Vexcel коммерчески, LiDAR, InSAR, eDNA) + ML впервые делают возможным парсел-уровневый андеррайтинг, MRV и комплаенс по цене софта. Ниже 20 идей, каждая — B2B SaaS 70%+ маржи, AI-native, старт <$3M, путь к $10M ARR за 5 лет и потолок $1B. Идеи сознательно разнесены по механике: андеррайтинг (61, 68, 75), кредит (62), workflow-копилоты (63, 73, 74), вертикальные data-продукты (64, 71, 79, 80), комплаенс/раскрытия (66, 69), мониторинг/инспекции (72, 78), planning (78), marketplace+SaaS (70, 76), MRV-платформы (67, 79).

---

**Идея 61. Парсел-уровневый андеррайтинг урожая для кроп-перестраховщиков и agri-MGA (CropUnderwrite / AcreScore)**

- **Проблема:** Глобальный рынок страхования урожая — ~$48 млрд премий (2025), при этом MPCI и private crop андеррайтятся на county-уровне (в США — actuarial data USDA RMA), а не на уровне поля. Перестраховщики (Swiss Re, Munich Re, Hannover Re покрывают >$20 млрд кроп-премий) и international agri-MGA/carriers оценивают риск засухи/наводнения/града агрегированно, не видят structural shift урожайности от климата, и не могут ценить приватные продукты (index/named-peril) вне субсидируемых госсхем США/ЕС.
- **Клиент (кто именно, чей бюджет):** Chief Actuary / Head of Agriculture перестраховщиков и специализированных agri-carriers; ~50-80 крупных кроп-перестраховщиков и retro-игроков; ~300+ agri-MGA и primary carriers на развивающихся рынках (Индия PMFBY, Бразилия, Африка, Австралия), где нет USDA-подобной actuarial-инфраструктуры. Бюджет — андеррайтинг + cat-modelling + reinsurance-purchasing.
- **Текущее решение:** USDA RMA actuarial tables (только США), county yield-модели, ручные weather-индексы, generic cat-модели RMS/Verisk (слабы в agri), полевые loss adjusters.
- **Почему текущее решение плохое:** county-агрегация скрывает 3-5x разброс риска внутри округа; нет parcel-level истории урожай→убыток; на развивающихся рынках вообще нет ground truth, что делает private crop нестрахуемым; loss adjustment вручную дорог и подвержен фроду; climate shift не отражён в исторических таблицах.
- **Предлагаемое AI-решение:** вертикальный data-продукт: Sentinel-1 SAR (weather-agnostic) + Sentinel-2/Planet optical + reanalysis-погода (ERA5) + soil (SoilGrids) → биофизические crop-модели + deep learning yield-nowcasting по каждому полю за 15+ лет истории → распределение урожайности, tail-риск, корреляционная структура для аккумуляции. Продукт: (1) underwriting API «дай риск-профиль по геометрии поля/портфелю», (2) parametric trigger-oracle для index-продуктов, (3) automated loss verification. Модели: SAR-optical fusion, gradient boosting на yield, копула-модели пространственной корреляции.
- **Размер рынка (bottom-up):** 60 перестраховщиков/retro × $300-600K + 300 agri-MGA/carriers × $100-250K + reinsurance brokers (Aon, Gallagher Re, Guy Carpenter agri-desks) × $250K ≈ $130-180M ядро. Путь к $1B: bps-модель на перестраховочной премии + экспансия в parametric-as-primary на emerging markets (сотни млн необеспеченных фермеров) + climate-repricing всего $48 млрд рынка.
- **Конкуренты:** Descartes Underwriting, Kettle, Arbol/dClimate (параметрика), Global Parametrics, Pula (emerging-markets distribution), EY/Gallagher agri-actuarial; спутниковые data-вендоры (EOS Data Analytics) продают imagery, но не risk-модели.
- **Why now (2024-2026):** SAR-optical fusion решил проблему облачности (all-season yield 2025); climate volatility ломает исторические actuarial-таблицы; перестраховщики после серии agri-убытков требуют challenger-моделей secondary perils; параметрика операционализировалась (Article-6/parametric деалы); OpenET/公開 ET-данные снизили COGS.
- **Go-to-market:** land через перестраховочные agri-desks (10-15 логотипов = проникновение в глобальный retro-слой), затем emerging-markets carriers/MGA как distribution, где мы — единственный источник ground truth; кейс «репрайсинг retro-книги + −20% loss ratio на index-продуктах».
- **Ожидаемый ACV:** $150-600K (SaaS + usage/bps).
- **Ожидаемая валовая маржа:** 78-85% (COGS — commercial imagery + inference; SAR/optical базово бесплатны).
- **Ожидаемый moat:** проприетарный датасет field-level yield→loss outcomes по многим странам (никто не собирает петлю до убытков), доверие актуариев/регуляторов, интеграция в reinsurance-workflow.
- **Вероятность юникорна: 6%**

---

**Идея 62. Операционная система залогового мониторинга и андеррайтинга агрокредита (AgCollateral / FarmLedger)**

- **Проблема:** В США ~$594 млрд agri-кредита (Farm Credit System ~$269 млрд, банки ~$212 млрд, 1,372 farm banks). Кредитные решения по фермам делаются на годовых balance sheets, налоговых декларациях и физических farm visits раз в год. Залог (посевы, земля, скот) не мониторится непрерывно; кредитор узнаёт о неурожае/дефолте с лагом в сезон; portfolio-уровневый climate/drought-риск не считается до события.
- **Клиент (чей бюджет):** Chief Credit Officer / ag-lending division банков и Farm Credit ассоциаций (~70 ассоциаций FCS + 1,372 farm banks + агролендеры типа Rabobank, AgFirst, Compeer); бюджет — credit risk + loan servicing + compliance. Вторично — сельхоз-лизинг и input-финансирование (Nutrien Financial, John Deere Financial).
- **Текущее решение:** ручной andерайтинг по документам, годовые farm visits, county-уровневая USDA-статистика, generic core-banking (nCino, Jack Henry) без гео-слоя; спорадические NDVI-отчёты.
- **Почему текущее решение плохое:** нет continuous collateral verification; невозможно оценить фактические засеянные акры/culture-mix/урожайность залогового поля; portfolio-концентрация по гео/культуре/водному стрессу невидима до региональной засухи; ручной андеррайтинг медленный и дорогой, режет доступ микро/underserved-фермеров.
- **Предлагаемое AI-решение:** continuous collateral OS: геокод каждого залогового поля → SAR/optical crop-classification + yield-nowcast + soil moisture + ET (OpenET) → real-time collateral value + early-warning дефолта + portfolio heatmap (drought/flood/concentration). LLM-агент собирает andерайтинг-пакет (crop history, actual planted acres, yield trend) из документов + imagery. Продукт встраивается в loan origination и servicing; alerts + covenant-мониторинг.
- **Размер рынка (bottom-up):** 70 FCS-ассоциаций × $150-400K + 1,372 farm banks (таргет топ-400 ag-heavy) × $75-150K + 30 крупных агролендеров × $300K + input-financiers ≈ $150-220M ядро (США). Путь к $1B: bps на обслуживаемом кредите (2-4 bps на $500 млрд+ = $100-200M) + экспансия в EU/Brazil/Australia agri-lending + встраивание в crop insurance (dual-use данные).
- **Конкуренты:** nCino/Jack Henry (core, без гео), Ceres Imaging/Taranis (agronomy, не кредит), FBN/Bushel (grower-facing), региональные fintech; ни один не закрывает lending collateral OS.
- **Why now:** agri-lending инвестирует в цифровизацию (>50% лендеров в 2025), climate-волатильность бьёт по портфелям, банки требуют раннего предупреждения; OpenET расширился на 48 штатов (дек 2025), SAR-optical дал all-season мониторинг; reguляторное давление на climate-risk в кредите.
- **Go-to-market:** land через 3-5 FCS-ассоциаций (референсы = вход в весь Farm Credit кооперативный слой), затем topmost farm banks; wedge — «−50% времени андеррайтинга + drought early-warning спас X bps резервов».
- **Ожидаемый ACV:** $100-400K.
- **Ожидаемая валовая маржа:** 78-84%.
- **Ожидаемый moat:** датасет collateral→performance→default по многим лендерам, интеграции с core-banking/LOS, доверие credit-комитетов и регуляторов (FCA/OCC).
- **Вероятность юникорна: 5%**

---

**Идея 63. Агрономический копилот и prescription-движок для ag-ретейла и кооперативов (AgronomyOS)**

- **Проблема:** Ag-ретейлеры и кооперативы (CropLife 100 + тысячи независимых) — точка контроля sell-through удобрений/СЗР/семян и variable-rate предписаний для миллионов акров. Их агрономы работают в разрозненных tools (Excel, John Deere Ops, R7/Climate FieldView, лабораторные почвенные отчёты), тратят часы на scouting-отчёты и составление prescriptions вручную; retention фермера держится на персональном агрономе, а не на данных.
- **Клиент (чей бюджет):** VP Agronomy / Digital у ag-ретейлеров и кооперативов (Nutrien Ag Solutions, Helena, GROWMARK, Wilbur-Ellis, Simplot + ~500 региональных); бюджет — agronomy services + digital/precision. ACV платит ретейлер, ценность — sell-through + удержание grower-аккаунтов.
- **Текущее решение:** Climate FieldView (Bayer), Trimble/John Deere Ops Center, Proagrica/Agrian (recordkeeping), лабораторные почвенные пробы, ручной scouting.
- **Почему текущее решение плохое:** vendor-locked экосистемы (Bayer/Deere) конфликтуют с независимым ретейлером; recordkeeping-tools не генерируют предписания; агроном не масштабируется; imagery-alerts не привязаны к продуктовому каталогу/марже ретейлера; фермер уходит, если агроном уходит.
- **Предлагаемое AI-решение:** агрономический копилот поверх imagery: satellite/drone NDVI + soil test + weather + planting-records → LLM-агент, который (1) генерирует scouting-отчёты и field-level рекомендации, (2) авто-собирает variable-rate prescriptions под каталог/маржу ретейлера, (3) пишет grower-facing summaries. Vision-модели детектят стресс/сорняки/болезни; retrieval по agronomic knowledge base + локальной истории. Продукт — white-label под бренд ретейлера.
- **Размер рынка (bottom-up):** топ-100 US ag-ретейлеров × $200-500K + ~500 региональных/кооперативов × $50-120K + EU/LatAm/AU агродистрибьюторы ≈ $120-180M ядро. Путь к $1B: seat-based (десятки тыс. агрономов глобально) + per-acre managed + take на sell-through/prescriptions; экспансия в input-manufacturers (Nutrien/Corteva) как distribution.
- **Конкуренты:** Climate FieldView, Taranis, Ceres Imaging, Sentera, Agerpoint, Proagrica/Agrian, cropwise (Syngenta); большинство — либо imagery-alerts, либо recordkeeping, не agronomy-copilot под маржу ретейлера.
- **Why now:** LLM сделали генерацию агроном-отчётов/предписаний решаемой; независимые ретейлеры ищут анти-Bayer/Deere стек; консолидация ретейла требует масштабирования агрономов; imagery подешевела.
- **Go-to-market:** land через 5-10 региональных кооперативов (быстрое внедрение, нет IT), white-label; upsell в топ-100; distribution через input-manufacturers, ищущих канал к grower без Bayer/Deere.
- **Ожидаемый ACV:** $80-500K.
- **Ожидаемая валовая маржа:** 75-82%.
- **Ожидаемый moat:** данные prescription→outcome→sell-through, встроенность в workflow агронома (высокий switching cost), white-label lock-in под бренд ретейлера.
- **Вероятность юникорна: 4%**

---

**Идея 64. Гео-разведка урожая для зерновых мерчандайзеров и оригинаторов (GrainSignal)**

- **Проблема:** Физические зерновые мерчандайзеры/оригинаторы (ADM, Bunge, Cargill, LDC, кооперативы, ethanol/crush-плантаторы) торгуют basis и управляют origination/логистикой, полагаясь на USDA WASDE (лаг, систематические ревизии) и полевые скауты. Они узнают о региональном урожае/качестве позже, чем спутник это видит; их проблема — не спекулятивная альфа (это ниша хедж-фондов/SatYield), а physical basis, origination-планирование и качество зерна по draw-area элеватора.
- **Клиент (чей бюджет):** Head of Origination / Merchandising / S&D (supply & demand) у мерчандайзеров, crush/ethanol-заводов, зерновых кооперативов; ~200-400 таких организаций глобально с меняющимся ландшафтом. Бюджет — trading/merchandising research + procurement.
- **Текущее решение:** USDA WASDE/crop progress, private scouts (Pro Farmer tour), брокерские research-ноты, generic NDVI-дашборды, SatYield/Gro Intelligence.
- **Почему текущее решение плохое:** WASDE лагирует и ревизуется; scouts дороги и субъективны; generic-дашборды дают NDVI, но не production/quality по draw-area конкретного элеватора и не привязаны к basis/logistics; хедж-фонд-ориентированные вендоры (SatYield) не решают physical merchandising.
- **Предлагаемое AI-решение:** вертикальный data-продукт для physical trade: SAR-optical yield/area/phenology/stress + protein/oil quality-прокси (гиперспектр/модели) → production-nowcast по draw-area, региону, порту, за 3-6 недель до WASDE + basis/logistics-слой (что это значит для origination конкретного актива). Deep learning на yield, weather-ensemble, transformer на phenology. Продукт: S&D-дашборд + API в trading-системы + alerting по контрактным гео.
- **Размер рынка (bottom-up):** 6-8 ABCD/мейджоров × $500K-1.5M + 200 региональных мерчандайзеров/crush/ethanol × $80-200K + кооперативы/порты ≈ $80-140M ядро. Путь к $1B: расширение на softs (кофе, какао — EUDR-совмещение), удобрения, freight; глобальная origination (Brazil/Black Sea/Australia); API-монетизация в trading-стек.
- **Конкуренты:** Gro Intelligence (перезапуск после банкротства 2023), SatYield, Kayrros/Vandersat (в составе EarthDaily/Planet), Descartes Labs, Bloomberg/LSEG agri-desks, Maxar/Planet analytics.
- **Why now:** Gro Intelligence обанкротился (2023) → вакуум; SAR all-season yield (2025); WASDE-волатильность и ревизии подрывают доверие; EUDR требует geo-attribution softs (кросс-продажа); LLM собирают S&D-нарратив.
- **Go-to-market:** land 1-2 мейджора как anchor (валидация), затем региональные оригинаторы/crush; wedge — «basis-edge + origination-планирование, которого нет в WASDE»; partnership с брокерами/exchanges для distribution.
- **Ожидаемый ACV:** $80K-1.5M.
- **Ожидаемая валовая маржа:** 80-88% (чистый data/API-продукт).
- **Ожидаемый moat:** проприетарные yield/quality-модели, откалиброванные на фактических elevator receipts (уникальный ground truth), track record точности vs WASDE, интеграция в trading-стек.
- **Вероятность юникорна: 5%**

---

**Идея 65. Учёт воды и торговля правами для GSA и ирригационных округов (AquiferLedger)**

- **Проблема:** SGMA (California) заставила 260+ Groundwater Sustainability Agencies достичь баланса водоносных горизонтов к 2040; аналогичное давление растёт по всему aридному Западу и глобально. GSA и ирригационные округа должны измерять фактический water use по каждому полю, аллокировать права, вести allocation-ledgers и запускать trading/allocation-программы — сейчас на Excel и самоотчётах фермеров, что не масштабируется и юридически оспариваемо.
- **Клиент (чей бюджет):** General Manager GSA / ирригационного округа (260+ GSA в CA + сотни districts на Западе США + water authorities AU/Chile/Spain); бюджет — water management + compliance; финансируется через assessment fees с землевладельцев. Вторично — сами фермеры-водопользователи (allocation-мониторинг).
- **Текущее решение:** самоотчёты + flowmeters (частичное покрытие), Excel-леджеры, эпизодические ET-отчёты, юридические consultancies; отдельные пилоты OpenET-based платформ (Rosedale-Rio Bravo).
- **Почему текущее решение плохое:** flowmeters покрывают <часть скважин, дороги; самоотчёт неверифицируем и оспорим в суде; Excel-аллокация не выдерживает litigation и trading; нет единого allocation-ledger + market layer; consultancies не дают continuous software.
- **Предлагаемое AI-решение:** water-accounting + trading OS: OpenET (ансамбль ET-моделей, quarter-acre) + SAR/optical crop-classification + soil/precip → фактический consumptive use по полю → allocation-ledger (кто сколько выбрал против права) → marketplace для внутри-bassein торговли/переноса аллокаций. LLM-агент готовит compliance-отчёты в state/regulator. Продукт: SaaS для GSA + grower-portal + optional trading exchange (take-rate).
- **Размер рынка (bottom-up):** 260 CA GSA × $50-150K + ~500 districts/authorities США × $40-120K + AU/Chile/Spain/MENA ≈ $60-100M ядро SaaS. Путь к $1B: take-rate на water trading (водные рынки Запада США оцениваются в млрд $/год оборота), экспансия в municipal/industrial water accounting и глобальные aридные бассейны.
- **Конкуренты:** OpenET (data-слой, не SaaS-леджер), Water Ledger/Waterfind (AU trading), California Water Watch, GEI/Montgomery consultancies, Trimble; фрагментировано, нет доминанта.
- **Why now:** SGMA sustainability-дедлайны материализуются (probationary designations начались 2024-2025); OpenET расширился на 48 штатов (дек 2025) с quarter-acre разрешением — фундамент готов; drought-циклы + водный дефицит поднимают цену воды; litigation требует defensible accounting.
- **Go-to-market:** land 5-10 GSA в критических бассейнах (Central Valley), референс-driven продажа в SGMA-сообществе (плотная сеть менеджеров), затем trading-layer как upsell; consultancies как каналы.
- **Ожидаемый ACV:** $40-150K SaaS + trading take.
- **Ожидаемая валовая маржа:** 76-84%.
- **Ожидаемый moat:** legally-defensible allocation-ledger (регуляторное доверие = высокий switching cost), сетевой эффект trading-marketplace (ликвидность), проприетарная калибровка ET на flowmeter ground truth.
- **Вероятность юникорна: 4%**

---

**Идея 66. Комплаенс-платформа EUDR/deforestation-free для импортёров-операторов (ForestProof)**

- **Проблема:** EUDR вступает в силу 30 дек 2026 (large/medium операторы) и 30 июня 2027 (micro/small): любой, кто размещает на рынке ЕС cattle, cocoa, coffee, palm oil, rubber, soy, wood или деривативы, обязан подавать Due Diligence Statement с геолокацией каждого участка происхождения + доказательством deforestation-free (после cut-off 31.12.2020) в цифровую систему ЕС (TRACES). Комиссия оценивает остаточные compliance-costs в ~€2.0 млрд/год (после −75% упрощений). Сотни тысяч операторов не могут делать это в Excel.
- **Клиент (чей бюджет):** Head of Sustainability / Supply Chain / Compliance у импортёров, traders, food/CPG, retail (ЕС + экспортёры в ЕС по всему миру); десятки тысяч операторов, но платящее ядро — крупные/средние. Бюджет — compliance + procurement.
- **Текущее решение:** Excel + PDF-справки поставщиков, консультанты (EY/PwC), точечные traceability-стартапы, generic ESG-платформы (Assent, Sourcemap), внутренние DDS-порталы.
- **Почему текущее решение плохое:** ручной сбор geo-полигонов от тысяч поставщиков не масштабируется; невозможно верифицировать deforestation-free без независимого imagery-анализа; риск-классификация стран/участков меняется; TRACES-интеграция и audit-trail требуют системы, а не таблиц; штрафы до 4% оборота ЕС делают ошибку дорогой.
- **Предлагаемое AI-решение:** EUDR-комплаенс OS: (1) сбор/валидация geo-полигонов от поставщиков (mobile + LLM-парсинг документов), (2) независимая deforestation-верификация каждого участка через imagery (Sentinel + Planet + Global Forest Change, change-detection после 2020), (3) авто-генерация Due Diligence Statement + TRACES-submission, (4) supplier-risk-скоринг и audit-trail. Модели: forest-loss detection (CNN на time-series), entity resolution поставщиков, LLM-workflow.
- **Размер рынка (bottom-up):** ~5-10 тыс. платящих операторов (large/medium) × $30-150K + downstream/retail × $50-300K + экспортёры вне ЕС ≈ $250-500M ядро при полном enforcement. Путь к $1B: расширение на UK Forest Risk Commodities, US-аналоги, CSRD/CSDDD, соседние supply-chain due diligence (forced labor, water); per-shipment/per-plot usage-модель на огромных объёмах.
- **Конкуренты:** Assent, Sourcemap, Osapiens, Meridia, Livelihoods, Trase (data, не compliance-SaaS), Descartes, TraceX, Prewave; фрагментировано, много generic-ESG без гео-верификации.
- **Why now:** дедлайн 30.12.2026 наконец зафиксирован (Комиссия отказалась от дальнейших отсрочек core-текста); enforcement competent authorities с 30.06.2026; штрафы до 4% оборота; upstream-экспортёры вынуждены compliance для доступа к ЕС; imagery deforestation-detection стал дешёвым и точным.
- **Go-to-market:** land через большие food/trader-логотипы (их compliance тянет весь их supplier-хвост в платформу = встроенный distribution), sell «TRACES-ready DDS + verified deforestation-free»; consultancies как каналы; usage-driven expansion по хвосту поставщиков.
- **Ожидаемый ACV:** $30-300K + per-plot usage.
- **Ожидаемая валовая маржа:** 75-82%.
- **Ожидаемый moat:** verified supplier/plot-граф (сетевой эффект: поставщик заведён однажды — переиспользуется многими покупателями), регуляторная встроенность в TRACES, датасет compliance-outcomes.
- **Вероятность юникорна: 8%**

---

**Идея 67. dMRV-операционная система для разработчиков природных углеродных проектов (CarbonProof)**

- **Проблема:** Разработчики nature-based carbon-проектов (ARR, REDD+, improved forest management, blue carbon) тратят $ и годы на MRV: полевые plots, ручные baseline/additionality-расчёты, дорогая third-party верификация. dMRV-сегмент agri-carbon ~$1.5 млрд (2025) → $3.5 млрд (2030, 18% CAGR). Buyer-side ratings (Sylvera, BeZero) выросли; developer-side инструментарий для измерения, quantification и registry-submission — фрагментирован и незрел.
- **Клиент (чей бюджет):** Head of MRV / Project Development у carbon developers (Chestnut Carbon, Land Life, Terraformation, hundreds mid-size), NGO-проектов, и government jurisdictional-программ; бюджет — project development + verification. Вторично — verifiers/registries (Verra, Gold Standard) и corporate insetters.
- **Текущее решение:** ручные field plots, allometric-уравнения на Excel, разрозненные remote-sensing consultancies, Verra methodologies с бумажной верификацией, Open Forest Protocol (mobile ground-data), Pachama (поглощена Carbon Direct, 2025).
- **Почему текущее решение плохое:** field plots дороги и не масштабируются; ручной quantification медленный, оспариваемый, ведёт к over-crediting scandals; верификация занимает месяцы; нет continuous MRV для permanence/reversal; consultancies — не software.
- **Предлагаемое AI-решение:** dMRV OS для разработчика: LiDAR/GEDI/спутник + SAR biomass + optical change-detection → automated biomass/carbon stock quantification, baseline, additionality, leakage, permanence-мониторинг → Verra/Gold-Standard-ready MRV-пакеты + continuous reversal-alerting. Модели: canopy-height/biomass regression (как Chloris/пр.), change-detection, uncertainty-quantification (ключ для credit integrity). Продукт — SaaS + verification-ready reports API.
- **Размер рынка (bottom-up):** сотни developers: 500 × $50-200K + jurisdictional-программы × $200K-1M + insetters/verifiers ≈ $80-150M ядро. Путь к $1B: per-credit/per-hectare take на растущем VCM (консервативно $1.6-2 млрд 2025, оптимистично $15+ млрд; ARR-сегмент растёт быстрее всех благодаря Microsoft/Google оффтейкам $50-70/т), + jurisdictional REDD+ (Article 6) + встраивание в insetting (пересечение с идеей 79).
- **Конкуренты:** Chloris Geospatial ($8.5M Series A, forest carbon), Pachama (в Carbon Direct), Sylvera/BeZero (buyer-ratings, не dev-tooling), Open Forest Protocol, cCarbon, NCX/Basemap, Perennial (soil), Kanop, Renoster; фрагментировано.
- **Why now:** over-crediting-скандалы (REDD+) убили доверие к ручному MRV → спрос на defensible digital quantification; Verra одобрил AI-tools (Perennial VT0014, авг 2025); ARR-бум на corporate оффтейках; SAR/LiDAR biomass-модели созрели; Article 6 требует rigorous MRV для суверенных трансферов.
- **Go-to-market:** land через mid-size developers (боль верификации острейшая), затем jurisdictional-программы (large seats) и registries как канал доверия; wedge — «−50% MRV-cost + faster verification = быстрее выручка от кредитов».
- **Ожидаемый ACV:** $50-500K + per-hectare/credit.
- **Ожидаемая валовая маржа:** 76-84% (COGS — LiDAR/commercial imagery на некоторых проектах).
- **Ожидаемый moat:** проприетарные biomass-модели, откалиброванные на field-plots (ground truth), registry-акцептованность методологии, датасет project→verification→reversal.
- **Вероятность юникорна: 5%**

---

**Идея 68. Андеррайтинг-движок и риск-данные для страхования углеродных кредитов (ReversalRisk)**

- **Проблема:** Рынок страхования углеродных кредитов (Kita, Oka, CarbonPool, CFC) молод и быстро растёт: покрывает non-delivery, invalidation, reversal (пожар/наводнение/политика). Oxbow Partners оценивал потенциал в «миллиард-долларовый» insurance-рынок. Но страховщикам не хватает актуарной базы: как ценить reversal-риск конкретного лесного проекта? Нет loss-истории, нет parcel-level hazard-моделей, нет continuous monitoring выданных полисов.
- **Клиент (чей бюджет):** Head of Underwriting / Chief Actuary carbon-insurers, MGA, Lloyd's-синдикатов, входящих в carbon-класс; ~20-40 игроков сегодня, растёт; плюс reinsurers, buffer-pool администраторы (Verra buffer pool), крупные carbon-buyers (Microsoft) для in-house риск-менеджмента. Бюджет — underwriting + cat-modelling.
- **Текущее решение:** BeZero/Sylvera ratings (quality, не insurance-hazard), ручные оценки, buffer pools (grubый коллективный резерв), партнёрство BeZero×Oka; в целом — нет специализированного actuarial-слоя.
- **Почему текущее решение плохое:** quality-рейтинги ≠ insurance hazard (permanence-риск пожара/политики); buffer pools неэффективны и непрозрачны; нет parcel-level моделирования reversal (wildfire/drought/deforestation hazard по конкретному проекту); нет continuous монитора для выданных полисов; страховщики не могут масштабировать андеррайтинг вручную.
- **Предлагаемое AI-решение:** actuarial data-продукт для carbon-insurance: parcel-level hazard-моделирование (wildfire probability, drought, flood, land-use/political risk) + continuous imagery-мониторинг проектов + reversal early-warning → underwriting API «риск-профиль и цена reversal для проекта X» + portfolio-аккумуляция + claims-верификация (что реально сгорело/деградировало). Модели: wildfire/climate hazard, biomass change-detection, geospatial cat-аккумуляция.
- **Размер рынка (bottom-up):** 40 carbon-insurers/MGA × $150-400K + reinsurers × $300-600K + buffer-pool админы/registries × $200K + крупные buyers ≈ $30-60M ядро сегодня, но bps-модель на страховой премии растущего рынка (потенциал $ млрд GWP) → $1B при масштабе carbon-insurance + расширение в parametric nature-triggers.
- **Конкуренты:** BeZero (×Oka партнёрство), Sylvera, Renoster/Calyx (quality), cat-modellers (Moody's RMS wildfire), CarbonPool (сам страховщик, in-house модели); белое пятно — независимый insurance-grade hazard-слой.
- **Why now:** carbon-insurance взлетел 2023-2026 (несколько MGA/carriers запустились); reversal-события (лесные пожары уничтожают кредиты) материализовались; BeZero×Oka (2024) валидировал спрос на ratings-in-underwriting; wildfire hazard-модели созрели.
- **Go-to-market:** land через 3-5 carbon-insurers/MGA (весь сегмент мал и знаком), bps-модель встраивается в андеррайтинг; reinsurers как validation; расширение в buffer-pool-администрирование и parametric.
- **Ожидаемый ACV:** $150-600K + bps на премии.
- **Ожидаемая валовая маржа:** 80-86%.
- **Ожидаемый moat:** первый independent reversal loss-датасет (петля policy→event→claim), доверие андеррайтеров/актуариев, интеграция в carbon-insurance workflow, дефицит talent на пересечении actuarial+geospatial+carbon.
- **Вероятность юникорна: 5%**

---

**Идея 69. Движок природного риска и TNFD-раскрытий для корпораций и управляющих активами (BiodiversityLedger)**

- **Проблема:** 730+ организаций ($22+ трлн AUM) взяли на себя TNFD-обязательства; ISSB готовит nature-стандарт (Exposure Draft ожидается окт 2026) — это переход от добровольного к регуляторному. Корпорации и asset-managers должны выполнить LEAP-оценку (Locate-Evaluate-Assess-Prepare): найти зависимость/impact на природу по каждой площадке/активу, оценить biodiversity/water/ecosystem-риск — сейчас через дорогие consultancies и ручные обследования.
- **Клиент (чей бюджет):** Chief Sustainability Officer корпораций (agri-food, extractives, apparel, pharma) + Head of ESG asset-managers/banks; сотни TNFD-adopters + тысячи будущих под ISSB. Бюджет — sustainability/ESG + risk. Отличие от идеи 38 (NatureLens, кредит-портфели EUDR-скрининг): здесь корпоративный own-operations + value-chain TNFD/ISSB disclosure.
- **Текущее решение:** consultancies (ERM, WSP, PwC), ENCORE (dependency-database), IBAT (biodiversity-данные), generic ESG-платформы (Watershed, Persefoni — climate, не nature), ручной LEAP.
- **Почему текущее решение плохое:** consultancies дороги и не continuous; ENCORE/IBAT — статичные datasets, не workflow; climate-ESG-платформы не покрывают nature/biodiversity/water; LEAP вручную по сотням площадок нереален; ISSB-регуляция потребует audit-grade, повторяемого раскрытия.
- **Предлагаемое AI-решение:** nature-risk & disclosure OS: геолокация всех площадок/поставщиков → наложение biodiversity (protected areas, KBA, species-range), water stress (ET/aquifer), land-use change, ecosystem-integrity → LEAP-автоматизация + dependency/impact-скоринг + авто-генерация TNFD/ISSB-раскрытия. Данные: спутник land-cover/change, eDNA-интеграции (NatureMetrics-тип), global biodiversity-слои; LLM собирает disclosure-нарратив с evidence-привязкой.
- **Размер рынка (bottom-up):** 730 текущих adopters → тысячи под ISSB; 3,000 × $50-200K корпораций + 500 asset-managers/banks × $100-400K ≈ $250-450M ядро при mainstream-adoption. Путь к $1B: ISSB делает nature-disclosure обязательной (как климат сейчас) → десятки тысяч отчитывающихся; расширение в биоразнообразие-credits/BNG (пересечение с идеей 70) и supply-chain.
- **Конкуренты:** NatureMetrics (eDNA-данные), Watershed/Persefoni/Sweep (climate-ESG расширяются в nature), Nala Earth, Pivotal, Cynthia/NatureAlpha, Bloomberg/MSCI (nature-data), ERM/WSP; ранний фрагментированный рынок без software-лидера.
- **Why now:** ISSB Exposure Draft nature (окт 2026) = переход добровольное→обязательное (повторяет траекторию климата, где Watershed/Persefoni стали юникорнами); 730+ adopters создают immediate спрос; спутник + eDNA сделали biodiversity измеримым; CSRD/EU nature-регуляции давят.
- **Go-to-market:** land через early TNFD-adopters (agri-food/extractives, где nature-риск материален), sell «audit-ready TNFD → ISSB-ready»; аудиторы/consultancies как каналы; повторить climate-ESG land-grab до того, как ISSB сделает рынок массовым.
- **Ожидаемый ACV:** $50-400K.
- **Ожидаемая валовая маржа:** 78-85%.
- **Ожидаемый moat:** первопроходческий nature-disclosure датасет и методология, аудиторская акцептованность, интеграция в ESG-стек, land-grab до регуляторной волны (тайминг = moat).
- **Вероятность юникорна: 7%**

---

**Идея 70. Ориджинация и marketplace экологических кредитов: mitigation banking + BNG (CreditBank)**

- **Проблема:** Рынки экологической компенсации огромны и растут: US wetland/stream mitigation banking — >1,200 банков, ~$3.5 млрд/год отраслевой выручки (глобальный mitigation banking-рынок ~$13 млрд, 2025); England Biodiversity Net Gain — с 2024 обязателен, ~£93 млн/год сейчас → £3 млрд к 2035, 91,000 units, £324 млн частных инвестиций в habitat banks. Но origination (найти/оценить землю под банк), quantification кредитов и сам marketplace живут на brokers, spreadsheets и юристах.
- **Клиент (чей бюджет):** habitat/mitigation bank-девелоперы и операторы (33+ habitat-bank операторов в Англии, сотни US-банкиров), land-owners, девелоперы-покупатели кредитов, регуляторы (USACE, Natural England). Бюджет — land development + compliance-procurement. Marketplace-сторона — take на сделках.
- **Текущее решение:** брокеры кредитов, Excel-леджеры, ручной habitat-assessment (полевые ecologist-обследования), регуляторные PDF-реестры (RIBITS в США), юристы; отдельные маркетплейсы (Biodiversity Units UK, EnTrust).
- **Почему текущее решение плохое:** origination земли под банк — ручной, subjective; habitat/credit quantification — полевой ecologist на acres (не масштабируется); нет ликвидного, прозрачного marketplace с verified inventory; регуляторные леджеры бумажные; matching покупатель-продавец через брокеров дорог.
- **Предлагаемое AI-решение:** origination + marketplace + SaaS: (1) land-screening под банк (habitat-potential, hydrology, condition из imagery/LiDAR/soil) → приоритизация участков; (2) automated habitat/biodiversity-condition assessment и credit-quantification (BNG metric / US functional assessment) через imagery + ML; (3) marketplace verified кредитов с continuous monitoring uplift (доказательство, что habitat реально улучшается). SaaS для банкиров + transaction take.
- **Размер рынка (bottom-up):** US: 1,200 банков + новые × $30-100K SaaS + take на $3.5 млрд/год оборота; UK BNG: 200+ habitat-bank operators × £30-80K + take на растущем £-рынке (→£3 млрд); EU nature restoration law добавит рынки ≈ $60-120M ядро SaaS + transaction upside. Путь к $1B: take-rate на consolidating credit-marketplaces (US $ млрд + UK £ млрд + EU) + экспансия в species/nutrient/stream credits.
- **Конкуренты:** Biodiversity Units UK / Gaia / Environment Bank / Nattergal (UK habitat banks), EnTrust/Ecosystem Investment Partners/RES (US mitigation banking), Ecometric, Joe's Ponds; фрагментировано, много land-operators без software-слоя.
- **Why now:** BNG стал обязательным в Англии (фев 2024) → взрывной спрос на quantification/marketplace; EU Nature Restoration Law (2024) откроет continental-рынки; US mitigation — зрелый, но software-underserved; imagery-based habitat-assessment созрел; TNFD/nature-finance гонит капитал (£324M в UK habitat banks).
- **Go-to-market:** land через habitat-bank operators (SaaS для origination/quantification), затем включить marketplace-liquidity по мере набора inventory; регуляторные integrations (RIBITS/Natural England) как доверие; developer-покупатели как demand-сторона.
- **Ожидаемый ACV:** $30-100K SaaS + 2-5% transaction take.
- **Ожидаемая валовая маржа:** 74-82% (SaaS высокая; marketplace take почти чистая).
- **Ожидаемый moat:** verified habitat/credit-inventory + сетевой эффект marketplace (ликвидность), регуляторная методология-акцептованность, датасет habitat→uplift-outcome.
- **Вероятность юникорна: 4%**

---

**Идея 71. Prospectivity-разведка как софт для юниоров и мейджоров (ProspectAI)**

- **Проблема:** Глобальный nonferrous exploration-бюджет ~$12.4-12.5 млрд/год (2024-2025), 2,210 активных explorer'ов, но success rate discovery крайне низок, а junior-финансирование сжато ($10.3 млрд, 5-летний минимум). KoBold доказал ($537M Series C, $2.96 млрд valuation), что AI-таргетинг работает — но KoBold капиталоёмок (владеет claims, строит рудники). Юниоры и мейджоры хотят AI-таргетинг как софт, не отдавая долю в месторождении.
- **Клиент (чей бюджет):** VP Exploration / Chief Geologist юниоров (~2,200 explorer'ов) и мейджоров (BHP, Rio, Anglo, Glencore, Vale); бюджет — exploration. Спрос усилен critical-minerals гонкой (Cu, Li, REE, Ni) для энергоперехода/AI-датацентров.
- **Текущее решение:** ручная интерпретация геологом geophysics/geochem/drill-data, GIS (ArcGIS), точечные consultancies, in-house data science у мейджоров, KoBold (но он — конкурент за месторождение, не поставщик).
- **Почему текущее решение плохое:** ручная интерпретация мультимодальных данных (magnetics, gravity, hyperspectral, geochem, historical drill logs) не масштабируется и упускает subtle-сигналы; юниоры не могут позволить in-house AI-команду; KoBold-модель (владение) не подходит для тех, кто хочет сохранить upside; данные разрознены (legacy scans, разные системы координат).
- **Предлагаемое AI-решение:** prospectivity-таргетинг SaaS: fusion geophysics (magnetics/gravity/EM) + multispectral/hyperspectral (ASTER, EMIT, WorldView-3, PRISMA) + geochem + digitized legacy drill-logs → ML prospectivity-mapping (где бурить) + explainable targeting + drill-hole prioritization. Модели: self-supervised на geophysical rasters, LLM для оцифровки исторических отчётов/логов, uncertainty-mapping. Продукт: SaaS-таргетинг (не владение месторождением).
- **Размер рынка (bottom-up):** 2,200 explorer'ов (таргет активных 800-1,000) × $50-250K + 30 мейджоров × $500K-2M + government geological surveys (USGS, GA, GSC) × $300K ≈ $150-250M ядро. Путь к $1B: доля от exploration-бюджета ($12.4 млрд/год) как software-tax + government critical-minerals mapping-контракты + расширение в mine-planning/resource-estimation.
- **Конкуренты:** KoBold (владелец-модель), Earth AI (владелец+drilling), VerAI, Fleet Space (hardware+AI), Seequent/Leapfrog (modelling, не таргетинг), Datarock (core, идея 74), IBM/consultancies; software-only prospectivity-vendor для юниоров недопредставлен.
- **Why now:** critical-minerals supply-shock (China export-контроль Ga/Ge/Sb, Cu-дефицит для энергоперехода/AI); KoBold валидировал AI-таргетинг ($537M, $2.96 млрд); foundation-модели для geospatial созрели; government critical-minerals mapping-программы финансируются (USGS Earth MRI); hyperspectral (EMIT/PRISMA) стал доступен.
- **Go-to-market:** land через cash-strapped юниоров (софт дешевле in-house DS), success-story-driven, затем мейджоры (enterprise seats) и government surveys как anchor-контракты; wedge — «AI-таргетинг без отдачи доли, как у KoBold».
- **Ожидаемый ACV:** $50K-2M.
- **Ожидаемая валовая маржа:** 78-86% (COGS — hyperspectral/commercial imagery на части проектов; geophysics — клиентские данные).
- **Ожидаемый moat:** проприетарный training-датасет discovery→outcome (какие таргеты реально дали руду), digitized legacy-геология (уникальный корпус), доверие геологов, government-контракты.
- **Вероятность юникорна: 5%**

---

**Идея 72. Мониторинг устойчивости хвостохранилищ и склонов для GISTM-комплаенса (TailingsWatch)**

- **Проблема:** В мире ~18,000 tailings storage facilities (~3,500 активных); катастрофические прорывы (Brumadinho, Mariana) убивают людей и стоят миллиарды. GISTM (Global Industry Standard on Tailings Management) требует continuous monitoring, independent oversight, risk-transparency. 100+ крупнейших miners раскрыли ~1,800 TSF в Global Tailings Portal, но большинство мониторят вручную (пьезометры, inclinometers, редкие обходы), а InSAR-анализ отдаётся разовым consultancies.
- **Клиент (чей бюджет):** VP Tailings / Geotechnical / ESG у mining-мейджоров и mid-tier (BHP, Vale, Rio, Anglo, Glencore, Newmont + сотни); Engineer of Record; бюджет — geotechnical/ESG risk + insurance. Вторично — регуляторы, insurers, институциональные investors (Church of England pension-инициатива по TSF-раскрытию).
- **Текущее решение:** in-situ инструменты (пьезометры/inclinometers, точечные), разовые InSAR-отчёты от consultancies (SkyGeo, TRE Altamira, Detektia), ручные inspections, tailings-management-софт (без continuous satellite-слоя).
- **Почему текущее решение плохое:** in-situ покрывает точки, не всю дамбу; разовый InSAR — не continuous, дорог; ручные обходы редки; нет fusion InSAR + in-situ + погода в единый risk-score с early-warning; GISTM требует continuous + independent, чего consultancy-модель не даёт масштабируемо.
- **Предлагаемое AI-решение:** continuous stability-monitoring SaaS: Sentinel-1/ICEYE/Capella InSAR (mm-деформация всей дамбы) + fusion in-situ sensors + погода/precip + freeboard из optical → ML anomaly-detection и failure-precursor-моделирование → risk-score, early-warning alerts, GISTM/EoR-ready reporting. Модели: InSAR time-series decomposition, anomaly-detection, physics-informed slope-stability. Продукт: SaaS-дашборд + alerting + audit-trail для регулятора/insurer.
- **Размер рынка (bottom-up):** 3,500 активных TSF; таргет операторов: 200 mining-компаний × $100-500K (портфель фасилити) + EoR/consultancies × $150K + insurers/regulators ≈ $80-150M ядро. Путь к $1B: per-facility usage на 18,000 TSF глобально + расширение на open-pit slope-stability, dams (гидро), infrastructure-subsidence (тот же InSAR-стек, идея 16 DigWatch — соседняя, но там трубопроводы).
- **Конкуренты:** SkyGeo, TRE Altamira (CLS), Detektia, Synthetic (InSAR-consultancies), Sintela (fiber-sensing), Wood/SRK/Klohn (geotech-consultancies), quartex/tailings-management-софт; белое пятно — continuous SaaS с InSAR+in-situ fusion и AI-early-warning.
- **Why now:** GISTM-имплементация с дедлайнами (мейджоры к 2023-2025, остальные позже); investor/insurer-давление после Brumadinho; SAR-констелляции (ICEYE/Capella/Umbra) дали частый revisit + Sentinel-1 бесплатно; InSAR-processing автоматизирован ML; ESG-рейтинги увязали TSF-риск с оценкой.
- **Go-to-market:** land через мейджоров с большими TSF-портфелями (референс = отраслевой стандарт), sell «GISTM-continuous + failure early-warning + insurer-discount»; EoR/consultancies как каналы; insurers как pull-фактор.
- **Ожидаемый ACV:** $100-500K (портфель фасилити).
- **Ожидаемая валовая маржа:** 76-84% (COGS — commercial SAR на части фасилити; Sentinel-1 бесплатно).
- **Ожидаемый moat:** датасет deformation→failure-precursor (калибровка на реальных инцидентах), интеграция с in-situ/EoR-workflow, регуляторно/insurer-акцептованность, high switching cost (safety-critical).
- **Вероятность юникорна: 5%**

---

**Идея 73. AI-копилот пермиттинга и экологической оценки для добычи и инфраструктуры (PermitPilot)**

- **Проблема:** Строительство рудника в США требует до 30 permits и в среднем ~29 лет (NEPA EIS + litigation — главные драйверы задержки). Critical-minerals reform (National Energy Dominance Council, 2025) давит на сокращение сроков, но объём NEPA/permitting-документации гигантский. Consultancies (ERM, Ramboll, WSP) готовят EIS/permit-пакеты вручную по $ млн и месяцы.
- **Клиент (чей бюджет):** VP Permitting / Environmental у miners, energy, infrastructure-девелоперов + environmental consultancies (ERM, WSP, Ramboll, Stantec, Trinity) + government permitting-агентства. Бюджет — permitting/environmental + legal. DOE/PNNL уже строит PermitAI (SearchNEPA/EngageNEPA) — валидирует спрос, но это госинструмент, не коммерческий SaaS.
- **Текущее решение:** consultancies вручную, Word/PDF, legacy EIS-библиотеки, GIS для impact-анализа; PermitAI (PNNL, govt-side); юристы для litigation-risk.
- **Почему текущее решение плохое:** ручная подготовка EIS — самая долгая часть 29-летнего цикла; consultancies не масштабируются, дороги; повторное использование прошлых EIS/precedent неэффективно; impact-анализ (habitat, water, air, cultural) ведётся разрозненно; litigation-риск не моделируется; comment-response раунды тонут в тысячах комментариев.
- **Предлагаемое AI-решение:** permitting-копилот: RAG по корпусу прошлых EIS/EA/permits + LLM-агент, который (1) draftует EIS/permit-разделы, (2) проводит geospatial impact-скрининг (habitat/species/water/wetlands/cultural через imagery + biodiversity/hydro-слои), (3) моделирует litigation/comment-риск, (4) авто-обрабатывает public comments. Продукт: SaaS для consultancies/девелоперов (не govt-only, как PermitAI). Vision — automated environmental impact assessment.
- **Размер рынка (bottom-up):** environmental consulting — десятки $ млрд глобально; таргет: 500 consultancy-офисов × $50-200K + 200 mining/infra-девелоперов × $100-400K + govt-агентства × $200K-1M ≈ $120-250M ядро. Путь к $1B: seat-based на десятках тыс. environmental-профессионалов + per-project usage + расширение на energy/transmission/renewables permitting (тот же NEPA-стек, пересечение с идеей 6/12 в energy-кластере) глобально (EU, AU, CA equivalents).
- **Конкуренты:** PermitAI (PNNL/DOE, govt), Transect (environmental due diligence), Ecobot (wetland permitting), Continuum (permitting workflow), generic legal-AI (Harvey), consultancy in-house tools; коммерческий mining/infra permitting-копилот недопредставлен.
- **Why now:** critical-minerals permitting reform (2025) + emergency permitting procedures давят на скорость; LLM-RAG сделали EIS-drafting реальным; PermitAI (govt) валидировал; litigation-нагрузка растёт; energy/datacenter build-out требует ускорения permitting массово.
- **Go-to-market:** land через environmental consultancies (они делают permitting для многих клиентов = built-in leverage), sell «−40% времени на EIS-draft + litigation-risk-скрининг»; затем крупные miners/infra-девелоперы напрямую; govt-агентства как anchor.
- **Ожидаемый ACV:** $50-400K.
- **Ожидаемая валовая маржа:** 78-85%.
- **Ожидаемый moat:** проприетарный корпус EIS/permit-precedent + outcome-данные (что прошло/оспорено), workflow-встроенность у consultancies, регуляторная точность (высокий доверительный барьер).
- **Вероятность юникорна: 5%**

---

**Идея 74. AI-логирование керна и геонаучная data-OS для разведки (CoreLogic AI)**

- **Проблема:** Разведочные команды логируют драгоценный керн вручную геологами — субъективно, медленно, несогласованно между людьми; геонаучные данные (drill logs, assays, imagery керна) живут в Excel-хаосе и разрозненных системах. AI-in-mining-exploration software ~$1.36 млрд (2025, ~48.5% рынка). Datarock/IMDEX и Seequent MX Deposit доказывают спрос, но большинство юниоров/mid-tier всё ещё логируют вручную.
- **Клиент (чей бюджет):** Chief Geologist / Database Manager разведочных проектов (юниоры + мейджоры + drilling-контракторы + assay-лаборатории); бюджет — exploration data management. Отличие от идеи 71 (prospectivity/где бурить): здесь — что в керне, который уже добурили, и управление всеми геоданными.
- **Текущее решение:** ручное логирование геологом, Excel, acQuire/DataShed (legacy geoscience DBMS), Seequent MX Deposit, Datarock (core imagery AI), фотографирование керна без анализа.
- **Почему текущее решение плохое:** ручное логирование медленно (недели), субъективно (2 геолога = 2 лога), не воспроизводимо; imagery керна снимают, но не анализируют автоматически; данные разрознены, теряются; legacy-DBMS не AI-native; юниоры не могут позволить полный geoscience-stack.
- **Предлагаемое AI-решение:** core-logging + geoscience data-OS: computer vision на high-res core-imagery (детекция trays, сегментация, литология, alteration, structure, RQD) → automated, explainable core logs + hyperspectral (mineralogy) fusion + LLM-оцифровка исторических логов → единая AI-native geoscience-база (drill/assay/imagery) с QA/QC. Продукт: SaaS core-logging + data-management; интеграция в prospectivity/modelling.
- **Размер рынка (bottom-up):** 2,200 explorer'ов (таргет 800-1,000 активных) × $40-200K + мейджоры × $300K-1M + drilling-контракторы/assay-labs × $50-150K + government drill-core repositories × $200K ≈ $100-180M ядро. Путь к $1B: seat/per-metre-cored usage на глобальном exploration-бурении + расширение в resource-estimation/mine-geology + geoscience data-OS как system-of-record.
- **Конкуренты:** Datarock/IMDEX (core imagery AI — лидер), Seequent MX Deposit / acQuire (data management), Corescan/Minalyze (hyperspectral core hardware), Coreplan, VRIFY; сегмент активен, но фрагментирован между hardware, data-mgmt и AI — интегрированный software-first player недопредставлен.
- **Why now:** AI-in-mining-exploration software $1.36 млрд (2025); Datarock валидировал core-imagery AI; foundation-vision-модели созрели; geologist-дефицит (стареющая рабочая сила) требует автоматизации логирования; critical-minerals бум увеличивает объём бурения.
- **Go-to-market:** land через mid-tier/juniors (боль ручного логирования острая, IT-нет), sell «дни→часы на лог + воспроизводимость»; drilling-контракторы/assay-labs как каналы; government core-repositories как anchor-датасеты.
- **Ожидаемый ACV:** $40K-1M.
- **Ожидаемая валовая маржа:** 76-84% (COGS — inference на imagery; hyperspectral на части).
- **Ожидаемый moat:** проприетарный обученный core-датасет (миллионы метров логированного керна = ground truth), system-of-record lock-in (все геоданные внутри), интеграция в modelling/prospectivity.
- **Вероятность юникорна: 4%**

---

**Идея 75. Верификация рекультивации и андеррайтинг обязательств по закрытию рудников (CloseOut)**

- **Проблема:** Mining-компании несут Asset Retirement Obligations (ARO) — reclamation/closure-обязательства на десятки-сотни $ млн каждое (Westmoreland/Cliffs-филинги показывают $50-70M+ на актив), обеспеченные bonds/financial assurance перед регуляторами и sureties. Прогресс рекультивации, revegetation-успех и точность ARO-оценок верифицируются редкими полевыми обходами; регуляторы, sureties и инвесторы не имеют continuous, независимого доказательства, что закрытие идёт и bond адекватен.
- **Клиент (чей бюджет):** (1) Mining-компании (VP Environmental/Closure) — доказать прогресс, вернуть bond; (2) surety/insurance-компании, выпускающие reclamation-bonds — андеррайтить/мониторить экспозицию; (3) регуляторы (OSMRE, state agencies) — верифицировать; (4) институциональные investors — оценить ARO-риск в балансе. Бюджет — closure/environmental + surety underwriting.
- **Текущее решение:** полевые revegetation-surveys, ручные reclamation-отчёты, регуляторные bond-releases по инспекции, актуарная ARO-оценка на inженерных допущениях; sureties андеррайтят на балансе, не на физическом прогрессе.
- **Почему текущее решение плохое:** полевые обходы редки, дороги, покрывают часть; revegetation-успех (ключ к bond-release) субъективен; ARO-оценки не откалиброваны на реальные closure-costs/outcomes; sureties не видят физический прогресс своей экспозиции; brownfield/orphan-обязательства растут (уголь, uranium — см. Western Uranium 10-K).
- **Предлагаемое AI-решение:** reclamation-verification & ARO-underwriting SaaS: time-series imagery (optical + SAR) + spectral vegetation-health + LiDAR/DEM (regrading, slope) → automated revegetation-success scoring, disturbance-footprint tracking, closure-progress verification + ARO-cost benchmarking (калибровка на закрытых объектах). Продукт: (1) operator-dashboard для bond-release, (2) surety underwriting/monitoring API, (3) regulator/investor-verification. Модели: vegetation-recovery ML, change-detection, cost-модели.
- **Размер рынка (bottom-up):** тысячи active/closing mines + десятки тыс. legacy-объектов; таргет: 200 mining-операторов × $50-250K + 30 sureties/insurers × $150-400K + regulators/govt reclamation-программы × $200K-1M + investors ≈ $60-120M ядро. Путь к $1B: bps на застрахованных reclamation-bonds (десятки $ млрд экспозиции) + расширение на oil&gas well-plugging (пересечение с идеей 17 WellFinder), landfill/brownfield closure.
- **Конкуренты:** environmental consultancies (revegetation-surveys вручную), точечные drone-survey фирмы, generic mining-ESG-софт; specialized reclamation-verification + ARO-underwriting SaaS практически отсутствует — белое пятно.
- **Why now:** ARO-обязательства растут (coal-декоммишн, uranium-revival, critical-minerals mine-lifecycle); investor/ESG-давление на balance-sheet ARO-точность; surety-рынок ищет физический андеррайтинг; imagery/LiDAR revegetation-scoring созрел; regulator bond-release backlog.
- **Go-to-market:** land через sureties/insurers (им нужен continuous physical underwriting экспозиции = bps-модель), затем операторы (быстрее bond-release = высвобождение капитала) и регуляторы; wedge — «доказанный revegetation-прогресс → раньше bond-release → возврат капитала».
- **Ожидаемый ACV:** $50-400K + bps на bonds.
- **Ожидаемая валовая маржа:** 78-85%.
- **Ожидаемый moat:** датасет reclamation-progress→closure-cost→bond-outcome (уникальная калибровка), surety/regulator-акцептованность, встроенность в financial-assurance workflow.
- **Вероятность юникорна: 3%**

---

**Идея 76. Провенанс минералов и enforcement-разведка нелегальной добычи (OriginTrace Metals)**

- **Проблема:** Нелегальная и артельная добыча (garimpo, ASM-gold) разрушает Amazon (496,000 га затронуто 2018-2025), финансирует crime и загрязняет ртутью; при рекордных ценах на золото 2025-2026 экономика нелегалов растёт. Downstream buyers (refiners, jewellers, EV/electronics для conflict-minerals compliance — Dodd-Frank 1502, EU Conflict Minerals Reg, OECD Due Diligence) и governments нуждаются в физическом провенансе и enforcement-разведке, которых нет. Отличие от идеи 55 (OriginProof, shipping trans-shipment): здесь — минералы/металлы + land-based ASM enforcement.
- **Клиент (чей бюджет):** (1) Governments/enforcement (Brazil IBAMA, Peru Operation Mercury, mining-reguляторы) — детекция; (2) refiners/LBMA-good-delivery, EV/electronics OEM, jewellers — due-diligence provenance; (3) development-банки/NGO/carbon-buyers (репутационный риск). Бюджет — enforcement + supply-chain compliance + ESG.
- **Текущее решение:** NGO-мониторинг (Amazon Mining Watch, RAMI SAR в Peru), ручные enforcement-рейды, бумажные chain-of-custody сертификаты (легко подделать «gold laundering» через ghost-permits), OECD-аудиты.
- **Почему текущее решение плохое:** NGO-инструменты не операционны для enforcement/procurement в реальном времени; бумажные сертификаты подделываются (gold laundering через legal permits); рейды реактивны; downstream buyers не могут физически верифицировать, что металл не с нелегального site; permit-verification не связан с фактической добычей.
- **Предлагаемое AI-решение:** provenance + enforcement-разведка: SAR (Sentinel-1, weather/cloud-agnostic) + optical change-detection → near-real-time детекция новых mining-фронтов + классификация legal/illegal через overlay permit-границ → alert-feed для enforcement + provenance-скоринг для buyers («этот регион/поставщик — high-risk illegal»). LLM связывает permit-реестры, ownership, trade-flows для anti-laundering. Продукт: alert-marketplace (govt/enforcement) + provenance-API (downstream compliance).
- **Размер рынка (bottom-up):** governments/enforcement (LatAm, Africa, SE-Asia) × $200K-1M + 50 refiners/LBMA × $150-400K + EV/electronics/jewellery OEM (conflict-minerals compliance) × $100-300K + dev-банки/NGO ≈ $60-120M ядро. Путь к $1B: supply-chain due-diligence tax на металлы (пересечение с EUDR-подобными будущими mineral-регуляциями, EU Critical Raw Materials Act) + расширение на sand/timber/wildlife illegal-trade enforcement.
- **Конкуренты:** Amazon Mining Watch/Earth Genome (NGO), SERVIR/RAMI (govt-NGO), Satelligence, Kayrros, Planet analytics, RCS Global/Assent (conflict-minerals due diligence, без гео-enforcement); интегрированного enforcement+provenance SaaS нет.
- **Why now:** рекордные цены на золото (2025-2026) взорвали нелегальную добычу; EU Critical Raw Materials Act + conflict-minerals-регуляции ужесточаются; SAR near-real-time-детекция созрела (RAMI/Amazon Mining Watch доказали); governments под давлением; gold-laundering-скандалы (Brazil ghost-permits) в прессе.
- **Go-to-market:** land через government/enforcement-контракты (anchor, но medium-cycle) + parallel downstream buyers (refiners/OEM), sell «near-real-time illegal-mining alerts + defensible provenance»; dev-банки/NGO как validation и co-financing.
- **Ожидаемый ACV:** $100K-1M.
- **Ожидаемая валовая маржа:** 80-87% (SAR/optical базово бесплатны; чистый data/alert-продукт).
- **Ожидаемый moat:** проприетарный illegal-mining detection-датасет + permit/ownership-граф (anti-laundering), govt-контракты (sticky), провенанс-репутация у LBMA/OEM.
- **Вероятность юникорна: 3%**

---

**Идея 77. Инвентаризация и операционная система управления таймберлендом для TIMO (TimberOS)**

- **Проблема:** Институциональный timberland — большой asset-class (Manulife — крупнейший TIMO мира, >5 млн акров, $11 млрд+; глобально TIMO/REIT управляют десятками млн акров). Инвентаризация (объём, порода, рост, возраст) — фундамент оценки и harvest-планирования — делается циклическими cruise-обследованиями (полевые plots раз в 5-10 лет), что дорого, устаревает и не даёт wall-to-wall точности; harvest-scheduling и carbon-optimization живут в legacy-софте (Remsoft, Trimble/Forsight).
- **Клиент (чей бюджет):** Head of Forest Resources / Investment у TIMO (Manulife, Nuveen, PGIM, Campbell Global/JPM, Rayonier, Weyerhaeuser), forest REITs, крупных private timberland-owners; бюджет — forest management + asset valuation. Вторично — lenders/appraisers/carbon-programs на этих активах.
- **Текущее решение:** field cruise-inventory (statistical plots), LiDAR-acquisitions (разовые, дорогие), Remsoft/Woodstock (harvest-scheduling), Trimble Forestry, SilviaTerra/NCX Basemap (US wall-to-wall inventory, но NCX ушёл в carbon), Excel.
- **Почему текущее решение плохое:** cruise-plots статистичны, устаревают, дороги, не wall-to-wall; разовый LiDAR не continuous; inventory, growth&yield, harvest-scheduling и carbon разрознены в разных tools; оценка актива опирается на старую инвентаризацию; TIMO не могут continuous переоценивать портфель.
- **Предлагаемое AI-решение:** timberland-OS: спутник (Sentinel/Planet) + периодический LiDAR/GEDI + SAR → continuous wall-to-wall inventory (volume/species/height/age по стенду) → growth&yield-модели + harvest-optimization + carbon/biodiversity-слой (dual-use для carbon-программ) + asset-valuation. ML: canopy-height/biomass regression, species-classification, growth-моделирование. Продукт: system-of-record для TIMO, заменяющий cruise+legacy-scheduling.
- **Размер рынка (bottom-up):** 30-40 крупных TIMO/REIT × $200K-1M + сотни mid-size timberland-owners/консультантов × $50-150K + lenders/appraisers ≈ $80-150M ядро. Путь к $1B: per-acre managed на десятках млн институциональных акров + carbon-monetization take (dual-use, пересечение с идеей 67) + глобальная экспансия (NZ/AU/Brazil/Nordic timberland) + встраивание в timberland-transactions/valuation.
- **Конкуренты:** SilviaTerra/NCX (pivoted в carbon), Remsoft, Trimble Forestry, Forsight, TreeMetrics, CollectiveCrunch (AI forest-inventory), Kanop, Overstory (vegetation, но utility-focused, $43M Series B); интегрированного AI-native TIMO-OS нет.
- **Why now:** LiDAR/GEDI + SAR biomass-модели дали wall-to-wall inventory-точность (arXiv 2606.20291 и пр.); NCX/SilviaTerra ушли в carbon → вакуум в inventory-tooling; carbon/natural-capital увеличивает ценность timberland-данных; NCREIF timberland-волатильность требует continuous переоценки; TNFD/carbon dual-use.
- **Go-to-market:** land через 3-5 TIMO (референс = вход в тесное institutional forestry-сообщество), sell «continuous inventory + harvest-optimization + carbon-ready, дешевле cruise»; appraisers/lenders как pull; carbon-programs как upsell.
- **Ожидаемый ACV:** $100K-1M + per-acre.
- **Ожидаемая валовая маржа:** 76-84% (COGS — периодический LiDAR/commercial imagery).
- **Ожидаемый moat:** проприетарные growth&yield-модели, откалиброванные на cruise ground truth, system-of-record lock-in (весь asset внутри), carbon/valuation dual-use, доверие appraisers/lenders.
- **Вероятность юникорна: 4%**

---

**Идея 78. Планирование лесных противопожарных обработок и верификация результата (FuelBreak)**

- **Проблема:** Wildfire-риск требует fuel-treatment (thinning, prescribed burn) на десятках млн акров; US Forest Service обработал 3.3+ млн акров/год, но приоритизация где обрабатывать, планирование и — критично — верификация, что обработка снизила риск, фрагментированы. TNC-исследование показало: ecological forestry дало 41% / ~$211M экономии страховых премий на суб-бассейне. Insurers, utilities, states и federal land-managers хотят risk-reduction MRV, чтобы монетизировать treatments через страховые скидки/resilience-финансирование.
- **Клиент (чей бюджет):** (1) Land-managers (USFS, state forestry, counties, RCD) — приоритизация/планирование; (2) utilities (wildfire-mitigation бюджеты, десятки $ млрд) — treatment на ROW/окрестностях; (3) insurers/reinsurers — risk-reduction-верификация для pricing; (4) resilience-финансисты (green bonds, forest resilience bonds). Бюджет — wildfire mitigation + underwriting + land management. Vibrant Planet — лидер планирования; whitespace — insurance/finance-linked outcome-verification.
- **Текущее решение:** Vibrant Planet (planning), LANDFIRE/California Forest Observatory (fuel-mapping data), ручная приоритизация, полевые post-treatment surveys, разрозненные fire-behavior-модели (FlamMap).
- **Почему текущее решение плохое:** planning-tools не замыкают петлю с insurance/finance (не доказывают риск-снижение в $); fuel-maps статичны; post-treatment-верификация ручная; нет continuous MRV, связывающего treatment → measured risk-reduction → premium/financing outcome; fragmentation между govt-planning и private-underwriting.
- **Предлагаемое AI-решение:** treatment-planning + outcome-MRV: fuel-load/structure из LiDAR+спутник (canopy, surface fuel) + fire-behavior-моделирование → приоритизация treatments по risk-reduction-per-$ → post-treatment change-detection (доказать fuel-снижение) → risk-reduction-MRV, конвертируемый в insurance-скидку/resilience-bond-payout. Модели: fuel-mapping ML, fire-spread-simulation, treatment-effectiveness verification. Продукт: SaaS для planners + verification-API для insurers/финансистов.
- **Размер рынка (bottom-up):** federal/state/county land-managers × $50-300K + 50 utilities (wildfire-mitigation) × $100-500K + insurers/reinsurers × $150-400K + resilience-финансисты ≈ $80-150M ядро. Путь к $1B: per-acre-treated MRV на десятках млн акров + take на wildfire-resilience-финансировании/insurance-linked-продуктах + глобальная экспансия (AU/Med/Canada).
- **Конкуренты:** Vibrant Planet (planning-лидер), Technosylva (fire-modelling), Salo Sciences/Planet (fuel-mapping, в Planet), Overstory (utility vegetation, $43M), Kettle/Delos (wildfire underwriting), XyloPlan; whitespace — insurance/finance-linked treatment-outcome MRV.
- **Why now:** wildfire-катастрофы (LA 2025) → политическое/страховое давление; California FAIR-plan кризис делает risk-reduction монетизируемым; forest-resilience-bonds/insurance-инновации (TNC $211M кейс) созрели; fuel-mapping data (CFO/LANDFIRE) публично доступна; utility wildfire-бюджеты взлетели.
- **Go-to-market:** land через utilities + insurers (у них бюджет и ROI: treatment → premium/liability-снижение), sell «доказанное risk-reduction = страховая скидка/bond-payout»; govt land-managers как scale + co-financing; partnership с resilience-финансистами.
- **Ожидаемый ACV:** $50-500K + verification-take.
- **Ожидаемая валовая маржа:** 76-84%.
- **Ожидаемый moat:** датасет treatment→measured-risk-reduction→loss-outcome (уникальная петля для insurance), методология-акцептованность у insurers/финансистов, интеграция planning+MRV.
- **Вероятность юникорна: 4%**

---

**Идея 79. MRV и claims регенеративного земледелия / insetting для CPG (SupplyShed)**

- **Проблема:** SBTi FLAG обязывает food/ag-компании ставить FLAG-таргет на ≥67% land-related Scope 3 и декарбонизировать supply-shed через regenerative practices + insetting (претензии на reduction внутри своей цепочки, не offset). General Mills, Mars, PepsiCo и др. запускают программы, но MRV supply-shed emissions/removals по тысячам ферм-поставщиков и defensible insetting-claims — на Excel, самоотчётах и дорогих field-samples. Отличие от soil-carbon-измерения (project-side, Yard Stick/EarthOptics/Perennial): здесь — corporate buyer-side supply-shed MRV и claims-леджер.
- **Клиент (чей бюджет):** Chief Sustainability Officer / VP Regenerative Ag у CPG/food-компаний (Nestlé, PepsiCo, General Mills, Mars, Unilever, Danone + сотни), их ag-suppliers/traders (ADM, Cargill programs); бюджет — sustainability/Scope-3 + procurement. Вторично — insetting-registries (SustainCERT, Athian).
- **Текущее решение:** consultancies (Quantis, 3Degrees), Regrow Ag (regen-ag MRV-платформа), самоотчёты фермеров, field soil-samples, generic carbon-accounting (Watershed/Persefoni — не land-specific), SustainCERT/Athian (insetting-verification).
- **Почему текущее решение плохое:** самоотчёты фермеров неверифицируемы; field-samples дороги, не масштабируются на тысячи ферм; generic carbon-accounting не моделирует practice→emission/removal на land; insetting-claims оспоримы без rigorous MRV; supply-shed-attribution (какая ферма поставляет какому заводу) неясна; FLAG-дедлайны требуют audit-grade.
- **Предлагаемое AI-решение:** supply-shed MRV & claims-OS: satellite practice-detection (cover crops, tillage, residue — SAR/optical) + biogeochemical-модели (DNDC-тип) + soil/weather → field-level emission/removal quantification по supply-shed → insetting-claims-леджер с verification-trail + FLAG/SBTi-ready reporting. Модели: practice-classification CV, process-based + ML emission-моделирование, supply-shed attribution. Продукт: SaaS для CPG + supplier-portal + registry-integration.
- **Размер рынка (bottom-up):** сотни FLAG-обязанных CPG/food × $100-500K + ag-traders/co-ops (программы) × $150-400K + insetting-registries ≈ $120-220M ядро. Путь к $1B: per-acre/per-tonne MRV на десятках млн supply-shed-акров + claims-transaction take + расширение на fiber/apparel FLAG, water/biodiversity supply-shed MRV (пересечение с идеей 69).
- **Конкуренты:** Regrow Ag (лидер regen-ag MRV), Perennial/Yard Stick/EarthOptics (soil-measurement, project-side), Boomitra, CIBO, Agreena, Indigo Ag, Cool Farm Tool, Watershed (climate-accounting расширяется); buyer-side supply-shed MRV+claims конкурентен, но фрагментирован.
- **Why now:** SBTi FLAG-дедлайны материализуются (67% Scope-3 таргеты); новый SBTi Net-Zero Standard (2025) даёт больше места insetting/BVCM; CPG под давлением инвесторов/CSRD; satellite practice-detection + biogeochemical-модели созрели; insetting-registries (SustainCERT/Athian) операционализировались.
- **Go-to-market:** land через большие CPG-логотипы (их программа тянет весь supplier-хвост в платформу = distribution), sell «FLAG-ready supply-shed MRV + defensible insetting-claims»; ag-traders как каналы; registries как validation.
- **Ожидаемый ACV:** $100-500K + per-acre.
- **Ожидаемая валовая маржа:** 76-83%.
- **Ожидаемый moat:** проприетарные practice→emission-модели на field-samples (ground truth), supply-shed-граф (сетевой эффект: ферма заведена однажды — переиспользуется), registry/SBTi-акцептованность, claims-outcome-датасет.
- **Вероятность юникорна: 5%**

---

**Идея 80. Природный капитал и portfolio-разведка для институциональных управляющих farmland (AcreAlpha)**

- **Проблема:** Институциональный farmland — большой asset-class (Nuveen Natural Capital $13.1 млрд AUM, 3 млн акров, 580 объектов, 11 стран; farmland REITs растут — Nuveen запустил $3 млрд private farmland REIT в 2025). Управляющие оценивают/мониторят активы на appraisals, tenant-отчётах и полевых обходах; природный капитал (soil health, water, carbon, biodiversity) — новый value-driver и TNFD-требование — не встроен в portfolio-management; underperforming-объекты и climate/water-риск невидимы continuous.
- **Клиент (чей бюджет):** Head of Farmland / Natural Capital / Portfolio у farmland-managers (Nuveen, Manulife, PGIM, Hancock, UBS Farmland, Ceres Partners), farmland REITs (Farmland Partners, Gladstone), pension/endowment LPs; бюджет — asset management + acquisitions + ESG/TNFD. Отличие от идеи 62 (ag-lending collateral) и 64 (trading): здесь — equity-owner asset-management + natural-capital-оптимизация.
- **Текущее решение:** appraisals (циклические), tenant-reported yields, полевые farm-visits, NCREIF benchmarking, generic GIS, разрозненные agronomy/soil-consultancies, Excel.
- **Почему текущее решение плохое:** appraisals статичны, лагируют; tenant-yields самоотчётны; природный капитал (soil carbon, water, biodiversity) не измеряется/не монетизируется, хотя это value+TNFD; underperformance и climate/water-риск объектов невидимы до переоценки; acquisitions-due-diligence на неполных данных; нет continuous portfolio-OS.
- **Предлагаемое AI-решение:** farmland natural-capital & portfolio-OS: спутник (yield/crop-mix/productivity) + soil (carbon/health-прокси) + water (ET/aquifer-stress) + climate-risk-слой → continuous asset-performance + natural-capital-valuation + acquisitions-screening + TNFD/carbon-monetization-возможности (dual-use). ML: productivity-моделирование, soil-carbon-прокси, water-stress, climate-repricing. Продукт: portfolio-OS для managers + due-diligence-скрининг + LP-reporting.
- **Размер рынка (bottom-up):** 30-40 institutional farmland-managers × $200K-1M + farmland REITs × $150-500K + сотни family-offices/mid-managers × $50-150K + LPs/appraisers ≈ $70-130M ядро. Путь к $1B: bps на AUM (2-4 bps на сотни $ млрд глобального institutional farmland+timberland) + natural-capital-monetization take (carbon/water/biodiversity) + глобальная экспансия (Brazil/AU/EU farmland) + слияние с timberland-OS (идея 77).
- **Конкуренты:** Nuveen/Manulife in-house tools, Granular/AcreValue (Corteva, valuations), Ceres Imaging (agronomy), FarmTogether/AcreTrader (retail-платформы), NCREIF (benchmark), Regrow/CIBO (Scope-3), Land Report; интегрированного institutional natural-capital portfolio-OS нет.
- **Why now:** farmland-REIT-запуски (Nuveen $3 млрд, 2025) требуют NAV-pricing/continuous data; NCREIF farmland впервые ушёл в минус (2024) → managers ищут alpha/downside-tools; TNFD/natural-capital делает soil/water/biodiversity value-driver'ом; institutional капитал в natural capital растёт; satellite/soil-модели созрели.
- **Go-to-market:** land через 3-5 managers/REITs (референс = вход в тесное institutional natural-capital-сообщество), sell «continuous asset-performance + natural-capital-alpha + TNFD-ready»; LPs/appraisers как pull; carbon/water-monetization как upsell.
- **Ожидаемый ACV:** $100K-1M + bps на AUM.
- **Ожидаемая валовая маржа:** 78-85%.
- **Ожидаемый moat:** проприетарный asset-performance→valuation-outcome-датасет, natural-capital-методология-акцептованность у LP/appraisers, portfolio-OS lock-in, dual-use с carbon/timberland.
- **Вероятность юникорна: 4%**

---

## Сводная таблица идей 61-80

| № | Название | Механика | Первичный клиент | ACV | Ядро рынка | P(юникорн) |
|---|----------|----------|------------------|-----|-----------|-----------|
| 61 | CropUnderwrite | Андеррайтинг | Кроп-перестраховщики, agri-MGA | $150-600K | $130-180M | 6% |
| 62 | AgCollateral | Кредит/мониторинг | Ag-банки, Farm Credit | $100-400K | $150-220M | 5% |
| 63 | AgronomyOS | Workflow-копилот | Ag-ретейлеры, кооперативы | $80-500K | $120-180M | 4% |
| 64 | GrainSignal | Data-продукт | Зерновые мерчандайзеры | $80K-1.5M | $80-140M | 5% |
| 65 | AquiferLedger | Compliance+marketplace | GSA, ирригационные округа | $40-150K | $60-100M | 4% |
| 66 | ForestProof | Compliance-workflow | Импортёры-операторы ЕС | $30-300K | $250-500M | 8% |
| 67 | CarbonProof | MRV-платформа | Carbon-девелоперы | $50-500K | $80-150M | 5% |
| 68 | ReversalRisk | Андеррайтинг-данные | Carbon-insurers, MGA | $150-600K | $30-60M | 5% |
| 69 | BiodiversityLedger | Compliance/раскрытия | CSO корпораций, asset-mgrs | $50-400K | $250-450M | 7% |
| 70 | CreditBank | Marketplace+SaaS | Habitat/mitigation-banks | $30-100K+take | $60-120M | 4% |
| 71 | ProspectAI | Data-продукт | Юниоры, мейджоры (exploration) | $50K-2M | $150-250M | 5% |
| 72 | TailingsWatch | Мониторинг/compliance | Mining VP Tailings, sureties | $100-500K | $80-150M | 5% |
| 73 | PermitPilot | Workflow-копилот | Env-consultancies, miners | $50-400K | $120-250M | 5% |
| 74 | CoreLogic AI | Workflow/data-OS | Разведочные геологи | $40K-1M | $100-180M | 4% |
| 75 | CloseOut | Андеррайтинг/верификация | Sureties, miners, регуляторы | $50-400K | $60-120M | 3% |
| 76 | OriginTrace Metals | Marketplace+enforcement | Governments, refiners/OEM | $100K-1M | $60-120M | 3% |
| 77 | TimberOS | Asset-mgmt data-OS | TIMO, forest REITs | $100K-1M | $80-150M | 4% |
| 78 | FuelBreak | Planning+MRV | Utilities, insurers, land-mgrs | $50-500K | $80-150M | 4% |
| 79 | SupplyShed | MRV/claims | CSO CPG/food-компаний | $100-500K | $120-220M | 5% |
| 80 | AcreAlpha | Data-продукт/asset-mgmt | Farmland-managers, REITs | $100K-1M | $70-130M | 4% |

**Что это значит для строителя компании / инвестора.** Три идеи выделяются по риск-профилю и заслуживают приоритета: **ForestProof (66)** и **BiodiversityLedger (69)** — регуляторно-форсированные (EUDR-дедлайн 30.12.2026 зафиксирован; ISSB nature-стандарт с окт 2026), а регуляция создаёт non-discretionary спрос и повторяет траекторию climate-ESG, где Watershed/Persefoni стали юникорнами за 3-4 года; **TailingsWatch (72)** и **CropUnderwrite (61)** — safety/underwriting-critical с loss-петлёй, дающей datamoat, недоступный имитаторам. Общий структурный вывод: побеждает не «мониторинг X со спутника» (это commoditized imagery-analytics с 20 конкурентами), а игроки, которые (а) замыкают петлю до финансового исхода — bond-release, loss ratio, credit-default, verified claim — где ground-truth-датасет становится непреодолимым moat, и (б) встраиваются в регуляторный/registry-workflow (TRACES, GISTM, Verra, SBTi, NEPA), превращая compliance в switching cost. Наименее привлекательны идеи с government-anchor sales-циклами (76) или чистой asset-management bps-моделью без loss-петли (80, 77) — большой TAM, но медленный GTM и слабый лок-ин. Оптимальная точка входа: узкий регуляторный или underwriting-wedge с усилителем-distribution через крупный логотип, чей supplier/portfolio-хвост втягивается в платформу автоматически (66, 69, 79, 62).

---

## Источники

- European Commission / Access2Markets. «Delay until December 2026 and other developments in the implementation of the EUDR Regulation», 2025-2026. https://trade.ec.europa.eu/access-to-markets/en/news/delay-until-december-2026-and-other-developments-implementation-eudr-regulation
- Norton Rose Fulbright. «Update on EU Deforestation Regulation (EUDR): Towards simplified implementation», 2025 (оценка снижения compliance-costs €8.1 млрд→€2.0 млрд, ~75%). https://www.nortonrosefulbright.com/en/knowledge/publications/67068c0e/update-on-eu-deforestation-regulation-eudr--towards-simplified-implementation
- World Resources Institute. «Increasing Traceability in Agricultural Supply Chains» / Trase (SEI, Global Canopy). https://www.wri.org/insights/supply-chain-transparency-deforestation ; https://trase.earth/about
- MarqStats / отраслевые обзоры. «Global Agricultural Carbon MRV Market» ($1.52 млрд 2025 → $3.48 млрд 2030, 18% CAGR) — генерик-отчёт, помечен как ориентир. https://marqstats.com/reports/global-agricultural-carbon-mrv-market/
- PR Newswire / Chloris Geospatial. «Chloris Geospatial Raises $8.5 Million Series A to Scale Satellite-Based Forest Carbon Monitoring», 2025. https://www.prnewswire.com/news-releases/chloris-geospatial-raises-8-5-million-series-a-to-scale-satellite-based-forest-carbon-monitoring-302498338.html
- Crunchbase / Tracxn / Contrary Research. Pachama funding ($88M, acquired by Carbon Direct, ноя 2025). https://research.contrary.com/company/pachama
- Perennial. «Perennial Announces VT0014, First Verra-Approved Tool for AI-Powered Soil Carbon Quantification», авг 2025. https://www.perennial.earth/post/verra-vt0014-press-release
- AgFunderNews. «Yard Stick lands $18m for faster, cheaper soil carbon measurement». https://agfundernews.com/yard-stick-lands-18m-to-equip-agrifood-with-faster-cheaper-soil-carbon-measurement-tools ; Tracxn — EarthOptics ($38.1M, окт 2025).
- MSCI. «Voluntary Carbon Market in Review» (CORSIA Phase 1, Article 6), 2025-2026. https://www.msci.com/discover-msci/events/2Q26-voluntary-carbon-market-in-review ; Fastmarkets — CORSIA outlook.
- Sylvera. «State of Carbon Credits 2025» / «Carbon Market Trends 2026». https://www.sylvera.com/state-of-carbon-credits
- BeZero Carbon / Oka. «BeZero and Oka partner to power insurance with ratings expertise», 2024; Kita; CarbonPool. https://bezerocarbon.com/insights/bezero-carbon-and-oka-partner-to-power-insurance-with-ratings ; Oxbow Partners/Kita «Gross Written Carbon» report, 2024.
- S&P Global Market Intelligence. «World Exploration Trends 2024» / «Corporate Exploration Strategies» (nonferrous exploration $12.5 млрд 2024 → $12.4 млрд 2025; 2,210 explorer'ов; junior financing $10.3 млрд). https://www.spglobal.com/market-intelligence/en/news-insights/research/world-exploration-trends-2024
- TechCrunch / Mining Engineering (SME). «KoBold Metals raises $537M» ($2.96 млрд valuation), янв 2025. https://techcrunch.com/2025/01/02/kobold-used-ai-to-find-copper-now-investors-are-piling-in-to-the-tune-of-537m/
- IMDEX / Datarock; Seequent. Core imagery AI и geoscience data management. https://www.imdex.com/software/datarock ; https://www.seequent.com/products-solutions/mining/data-management-products/
- Dataintelo / отраслевой обзор. «AI in Mining Exploration Market» (software ~$1.36 млрд, ~48.5%, 2025) — генерик, ориентир. https://dataintelo.com/report/ai-in-mining-exploration-market
- GRID-Arendal / Global Tailings Portal (~1,800 TSF, 100+ компаний); оценка ~18,000 TSF мировой портфель, ~3,500 активных. https://tailing.grida.no/about ; World Mine Tailings Failures — «Estimate of World Tailings Portfolio 2020».
- ICMM / GISTM — Global Industry Standard on Tailings Management; Global Tailings Management Institute. https://thegtmi.org/
- Springer / Bull. Eng. Geol. Environ. «Application of Sentinel-1 InSAR to monitor tailings dams and predict geotechnical instability», 2024. https://link.springer.com/article/10.1007/s10064-024-03680-3
- White & Case. «Shovel-ready? Building US critical mineral resilience» (до 30 permits, ~29 лет). https://www.whitecase.com/insight-our-thinking/shovel-ready-building-us-critical-mineral-resilience ; PNNL PermitAI. https://www.pnnl.gov/projects/permitai
- Amazon Conservation / MAAP. «AI-powered detection of Amazon gold mining» (Amazon Mining Watch); RAMI SAR (Peru, IOPscience). https://www.maapprogram.org/amazon-gold-mining-2025/ ; https://iopscience.iop.org/article/10.1088/2515-7620/ad937e (496,000 га 2018-2025).
- farmdoc daily (U. Illinois). «Lending Activity and Performance of the Farm Credit System and Community Banks», июнь 2025; ABA «Farm Banks…» (FCS ~$269 млрд, банки ~$212 млрд, 1,372 farm banks). https://farmdocdaily.illinois.edu/2025/06/
- Fortune Business Insights. «Crop Insurance Market» (~$48-50 млрд премий 2025-2026, MPCI-доминанта) — генерик, ориентир. https://www.fortunebusinessinsights.com/crop-insurance-market-113633 ; MarketIntelo «Crop Insurance Underwriting via Satellite» ($1.27 млрд 2024→$5.94 млрд 2033) — генерик.
- OpenET / etdata.org / NASA. «OpenET Expands Satellite-based Water Data Across 48 States», дек 2025 (quarter-acre, 13,000+ users). https://etdata.org/openet-expands-satellite-based-water-use-data-48-states-farmers-water-managers-across-nation/
- Regrow Ag. «SBTi FLAG Guidance» / «New SBTi Net-Zero Standard» (≥67% FLAG Scope 3). https://www.regrow.ag/post/sbti-flag-guidance-what-you-need-to-know
- Trellis / SustainCERT / Athian. «How insetting helps food companies cut Scope 3». https://trellis.net/article/sustaincert-athian-insetting-food-agriculture/
- Nuveen Natural Capital ($13.1 млрд AUM, 3 млн акров, private farmland REIT $3 млрд 2025); Global AgInvesting. https://globalaginvesting.com/nuveen-launches-3b-private-us-farmland-reit-with-exposure-to-californias-central-valley/ ; NCREIF Farmland Index. https://user.ncreif.org/data-products/farmland/
- Manulife Investment Management — крупнейший TIMO (>5 млн акров, $11 млрд+ timberland); 40-F FY2025. https://www.manulifeim.com/institutional/global/en/strategies/private-markets/timberland
- Biodiversity Units UK. «The BNG Industry Report July 2025» (~£93 млн/год → £3 млрд к 2035, 91,000 units, £324 млн в habitat banks, 33 операторов). https://www.biodiversityunits.com/news-insights/revealed-the-bng-industry-report-july-2025 ; Energy Live News.
- PLOS One / EASI. «Assessing the size and growth of the US wetland and stream compensatory mitigation industry» (>1,200 банков, ~$3.5 млрд/год); Custom Market Insights — глобальный mitigation banking ~$13 млрд 2025 (генерик, ориентир). https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0285139
- TNFD. Adoption (730+ организаций, $22+ трлн AUM); ISSB nature Exposure Draft ожидается окт 2026. https://tnfd.global/ ; Edie «620 firms back $20trn nature-related reporting».
- PR Newswire / Overstory. «Overstory Closes $43m Series B» (vegetation intelligence, 6 из 10 крупнейших utilities), ноя 2025. https://www.prnewswire.com/news-releases/overstory-closes-43m-series-b-to-scale-ai-driven-wildfire-prevention-and-grid-resilience-302625548.html
- Vibrant Planet / TNC. «How Insurers and Homeowners Will Benefit from Better Fire Risk Analysis» (ecological forestry: 41% / ~$211M premium savings). https://www.vibrantplanet.net/insights/how-insurers-and-homeowners-will-benefit-from-better-fire-risk-analysis
- SatYield. Satellite crop intelligence для трейдеров (yield 3-6 недель до WASDE). https://www.satyield.com/
- SilviaTerra / NCX Basemap (537 млн акров, 92 млрд деревьев, Landsat/Sentinel+FIA); IEEE Spectrum. https://spectrum.ieee.org/this-ai-can-see-the-forest-and-the-trees
- MarketIntelo. «AI Virtual Fencing and Smart Livestock Management Market» (GPS-модули −68% с 2018) — генерик, ориентир. https://marketintelo.com/report/ai-virtual-fencing-and-smart-livestock-management-market
