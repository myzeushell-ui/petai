# ЧАСТЬ 1. КАРТА РЫНКА

## Кластер: Движение, города, деньги

*Кластер 4 из 4. Шесть вертикалей, где геопространственные данные монетизируются через движение товаров и людей, управление урбанизированной территорией и финансовые сигналы: логистика, транспорт, умные города, retail location intelligence, госкадастр/картография, alternative data для финансовых рынков.*

Общая рамка кластера: это самый «денежный» из четырёх кластеров по совокупному объёму конечных рынков (только tech-расходы на smart cities — ~$190 млрд/год по методологии IDC), но и самый коварный: доля собственно геопространственного софта в этих деньгах — единицы процентов, а несколько подсегментов (HD-карты, satellite signals для хедж-фондов, «платформы умного города») уже прошли полный цикл хайп → разочарование → распродажа активов. Здесь важно отличать вертикали, где геоданные — это продукт (Placer.ai, Kpler), от вертикалей, где они — ингредиент чужого workflow (логистика, fleet). Ниже — по каждой вертикали отдельно.

---

### Логистика и цепочки поставок (supply chain visibility)

**TAM.** Разделяем три контура:
- Весь софт для управления цепочками поставок (SCM suite: планирование, TMS, WMS): ~$26–31 млрд (2025) [оценка на базе Gartner SCM software: $20,2 млрд ещё в 2022, рост 10–12%/год].
- Софт supply chain visibility как категория: $2,5–3,3 млрд (2025). GMI даёт $3,3 млрд (2025) → $10,9 млрд (2034); market.us — $2,5 млрд (2025) → $12,6 млрд (2035). Расхождение — от границ категории (включать ли control tower и risk intelligence); согласованная оценка: **$2,5–3,5 млрд (2025)**.
- SAM для геопространственной аналитики внутри visibility (реальное трекинг-ядро: RTTVP-платформы, maritime/ocean intelligence, геориск): **~$1,5–2,5 млрд (2025) [оценка]** — сумма выручек project44 + FourKites + Shippeo + Kpler-трекинг + Windward + океанские трекеры + risk-игроки (Everstream, Altana частично).

**CAGR.** 13–18% до 2033–2035 (GMI 13,4%; market.us 17,6%); собственно RTTVP-ядро растёт быстрее рынка — лидеры показывают +30–40% нового ARR (project44, Q3 2025).

**Основные клиенты.** Грузовладельцы (CPG, ритейл, фарма, промышленность) — основной плательщик; 3PL и экспедиторы — второй контур; трейдеры и банки — третий. Бюджет на visibility у enterprise-шиппера: $100 тыс. — $1,5 млн/год (мультимодальный контракт). Решение принимает VP Supply Chain / CSCO, при risk-продуктах — CPO (procurement) и риск-офис. У FourKites 1600+ брендов, включая 18 из топ-20 food & beverage.

**Основные use cases.**
1. Predictive ETA по дорожным, ж/д и океанским перевозкам (ядро RTTVP).
2. Ocean visibility: контейнерный трекинг, port congestion, detention & demurrage-менеджмент.
3. Yard management и dock scheduling (FourKites Intelligent Control Tower, трекинг «до двора»).
4. Supply chain risk monitoring: геособытия (наводнение, забастовка, конфликт) поверх карты поставщиков (Everstream, Resilinc).
5. N-tier mapping: восстановление сети поставщиков 2-3-го уровня для санкционного/ESG-комплаенса (Altana — UFLPA, таможни).
6. Маршрутная оптимизация и last mile (Descartes, Drivin).
7. Cold chain: сенсоры + гео (Tive).
8. Мониторинг товарных потоков как рыночного сигнала (пересечение с вертикалью 6).

**Крупнейшие боли.**
- Стоимость сбоев: по McKinsey Global Institute, за декаду компания в среднем теряет ~45% годовой EBITDA на сбоях цепочек — это главный бюджетообразующий страх после 2020–2022.
- OTIF-штрафы ритейлеров (Walmart — до 3% стоимости инвойса за срыв окна доставки) — прямой ROI-кейс для ETA.
- Detention & demurrage: топ-9 океанских линий выставили ~$8,9 млрд D&D-сборов за 2020–2022 (данные FMC) — visibility окупается спорами по этим счетам.
- Качество данных перевозчиков: покрытие/латентность фидов — хроническая причина churn между платформами.
- Коммодитизация «точки на карте»: трекинг перестал дифференцировать, цена на базовый visibility падает.

**Существующие софтверные решения (категории).** RTTVP (project44, FourKites, Shippeo, Transporeon/Trimble); ocean/maritime intelligence (Kpler-MarineTraffic, Windward, Vizion, Terminal49); risk intelligence (Everstream, Altana, Interos); логистические сети и TMS (Descartes GLN, Oracle, SAP BN, Blue Yonder); сенсорный трекинг (Tive, Roambee); control tower внутри ERP (SAP, Kinaxis).

**Лидеры рынка.**

| Компания | Метрика | Комментарий |
|---|---|---|
| project44 | ~$134 млн ARR [оценка Getlatka], оценка $2,7 млрд; +40% нового ARR Q3 2025, cash-flow breakeven; раунд $105 млн (Springcoast, 08.2025) | лидер Gartner MQ RTTVP 5 лет подряд |
| FourKites | ~$114 млн ARR (2024) | пивот в «Intelligent Control Tower» + AI-агенты |
| Shippeo | выручка +210% YoY в Сев. Америке; всего привлечено >$140 млн ($30 млн от Woven/Toyota, 01.2025) | №3 в MQ, сильна в Европе |
| Descartes Systems | $729 млн выручки FY26 (+12%), публичная | сеть + маршрутизация, серийный консолидатор (Drivin за $30 млн) |
| Altana | оценка $1 млрд, Series C $200 млн | n-tier граф мировой торговли, госзаказ |
| Kpler | $100 млн ARR (01.2024), цель $1 млрд; купила MarineTraffic, FleetMon, Spire Maritime ($233,5 млн, 2025) | консолидатор maritime-данных |

**Вывод для инвестора.** Чистый трекинг коммодитизирован — все лидеры бегут вверх по стеку в agentic control tower, и это правильное прочтение: платят не за «где груз», а за «что делать». Геоданные здесь — ингредиент, поэтому строить новую RTTVP бессмысленно; но слой автономных решений поверх уже собранных сетей (споры по D&D, автоматическая перебронь, санкционный комплаенс) — открытая позиция с ACV $300 тыс.+. Kpler показала самую красивую траекторию кластера: скупить сырые данные (AIS, спутник), упаковать в терминал для операторов — и метить в $1 млрд выручки; модель воспроизводима в смежных товарных потоках (авиакарго, зерно внутренним транспортом).

---

### Транспорт: дорожная инфраструктура, fleet, HD-карты

**TAM.** Три различных рынка, которые нельзя суммировать бездумно:
- Fleet telematics / connected fleet: $18–20 млрд (2025) → $50+ млрд (2035), CAGR ~10% (Market Research Future: $20,2 млрд 2025; M&M скромнее — $22 млрд к 2032). Согласованная оценка: **$18–22 млрд (2025)**.
- Цифровые карты и location-платформы (Google Maps Platform, HERE, TomTom, Mapbox): ~$18–25 млрд (2025) [оценка; сюда входит consumer-реклама и API].
- HD-карты для ADAS/AV: оценки расходятся в 3,5 раза — M&M $1,09 млрд (2025, CAGR 10,5%), другие генерики $3,1–3,9 млрд с CAGR 24–29%. Причина: одни считают только лицензии на embedded-карту, другие — все data services для ADAS. Согласованная оценка: **$1–2 млрд (2025)** реального биллинга, преимущественно L2+/L3-программы OEM.
- SAM геопространственного софта по вертикали (карты + дорожная asset-аналитика + гео-ядро телематики): **~$6–9 млрд (2025) [оценка]**.

**CAGR.** Fleet ~10% (2025–2035); картографические платформы ~8–12% [оценка]; HD/AV-данные — потенциально 20%+, но с бинарным риском сценария «mapless».

**Основные клиенты.** (а) Операторы флотов (логистика, строительство, field services, госфлоты) — покупает fleet manager/COO, бюджет $30–60/машина/мес; (б) автопроизводители — покупает подразделение ADAS/навигации, контракты на цикл платформы (у TomTom автомобильный бэклог €2,4 млрд); (в) дорожные агентства и муниципалитеты — покупает public works director, бюджеты $50–500 тыс. на цикл обследования дорог; (г) страховщики (UBI-данные).

**Основные use cases.**
1. Телематика + видеобезопасность (AI-дашкамы, коучинг водителей — ядро Samsara/Motive).
2. Маршрутизация и диспетчеризация коммерческого транспорта (truck-specific routing: Trimble Maps, PTV).
3. Карты для ADAS/AV: lane-level карты, Mobileye REM (краудсорсинг с серийных машин), NVIDIA.
4. Автоматизированная оценка состояния дорожного покрытия по видео/LiDAR (vialytics — 600+ муниципалитетов; Cyvl; RoadBotics — поглощена).
5. Трафик-аналитика и управление светофорами (INRIX, Miovision, Yunex).
6. EV: планирование зарядной инфраструктуры, range-aware маршрутизация.
7. Curb management и городская логистика.
8. Страховая телематика/UBI.

**Крупнейшие боли.**
- Содержание дорог: бэклог отложенного ремонта дорог и мостов в США — ~$786 млрд (ASCE); при этом обследования до сих пор ведутся вручную раз в 2–3 года — рынок для AI-съёмки.
- Экономика картографии: полное HD-покрытие стоит сотни $ млн и устаревает мгновенно; HERE (выручка ~€0,9–1 млрд [оценка], консорциум BMW/Mercedes/Audi/Intel/Bosch) хронически убыточна и сокращает штат; TomTom Location Technology стагнирует (~€480–500 млн/год, −0–3% YoY).
- Риск «mapless»: Tesla/Wayve/Imagry доказывают езду без HD-карт; Waymo остаётся на картах, Mobileye — на «лёгкой» crowdsourced-карте. Если побеждает mapless, HD-TAM схлопывается.
- Overture Maps Foundation (Meta, Microsoft, Amazon, TomTom) дефлирует стоимость базовой карты до нуля — монетизация уходит в свежесть и атрибуты.
- Пробки: ущерб ~$74 млрд/год только в США (INRIX 2024) — платёжеспособный спрос городов на управление трафиком при этом фрагментирован.

**Существующие софтверные решения (категории).** Fleet-платформы (Samsara, Geotab, Motive, Verizon Connect, Webfleet); картографические платформы (Google Maps Platform — выручка ~$3+ млрд [оценка], HERE, TomTom, Mapbox); AV/ADAS-карты (Mobileye REM, NVIDIA, Baidu в Китае); дорожный asset management (vialytics, Cyvl, AgileAssets/Trimble, Brightly); трафик (INRIX, PTV/Umovity, Miovision).

**Лидеры рынка.**

| Компания | Выручка/метрика | Позиция |
|---|---|---|
| Samsara (NYSE: IOT) | ARR $1,9 млрд FY26 (+30%), выручка $1,62 млрд | лидер connected operations, вышла за пределы транспорта |
| Geotab | 4+ млн подключённых машин; выручка ~$0,8–1 млрд [оценка] | №1 по подпискам в Европе и LatAm |
| Trimble T&L | сегмент ~$790 млн (2024) | карты для грузовиков + TMS |
| TomTom | группа ~€570–580 млн/год; Automotive бэклог €2,4 млрд | Orbis Maps — ставка на возрождение Enterprise |
| HERE | ~€0,9–1 млрд [оценка], убыточна | реструктуризация, зависимость от OEM-акционеров |
| Mobileye | REM-карта с миллионов серийных авто | структурное преимущество в данных |

**Вывод для инвестора.** Fleet-телематика — решённый рынок (Samsara и Geotab забрали его; вход только через незанятые ниши вроде спецтехники или развивающихся рынков). Базовая карта как бизнес умирает под Google + Overture — не инвестировать в «новый HERE». Живая асимметрия — инфраструктурная сторона: дороги это класс активов на триллионы с бэклогом $786 млрд и без системы записи о состоянии; vialytics/Cyvl пока маленькие, категория «Bloomberg дорожного покрытия» для муниципалов и подрядчиков не занята и защитима через накопленную историю состояния. Второй вариант — data QA/фреш-слой для AV-карт по модели supply-side (платят OEM), но он под бинарным mapless-риском.

---

### Умные города (smart cities)

**TAM.** Категория с худшей аналитикой из всех: генерик-отчёты дают $950 млрд — $1,3 трлн (2025) с CAGR 15–23% (Fortune BI, EMR — помечаем как ненадёжные: туда заметают строительство, энергетику и весь городской IoT). Методологически честная рамка — IDC Smart Cities Spending Guide: **~$190 млрд (2023–2025) технологических расходов городов**, рост ~10–20%/год. Внутри этого:
- Аналитика данных штатов/муниципалитетов: ~$13,8 млрд (IDC, 2024).
- SAM геопространственного софта (GIS для местных властей, urban digital twins, гео-слой планирования): **~$4–6 млрд (2025) [оценка]** — опираясь на GIS-рынок в целом ($14,5 млрд, M&M 2025, CAGR 12,4%), где local government — крупнейший вертикальный сегмент.
- City digital twin как поднабор: $4,2 млрд (2025) → $25,8 млрд (2034), CAGR 22,5% (MarketIntelo — генерик, использовать как ориентир порядка величины).

**CAGR.** Техрасходы городов ~10–15%; гео-подсегмент 12–20% (быстрее всего — цифровые двойники и climate adaptation).

**Основные клиенты.** Муниципалитеты и агломерации (планирование, public works, транспортные департаменты), транзитные агентства, городские utilities. Решение: CIO города / директор планирования; финансирование грантовое и бюджетно-цикличное (в США — деньги Bipartisan Infrastructure Law: $65+ млрд на сети/резильентность с встроенными smart-требованиями). Продажи 12–36 мес., через RFP; ACV от $20 тыс. (маленький город, SaaS) до $10+ млн (национальные программы, Ближний Восток/Азия).

**Основные use cases.**
1. Городской цифровой двойник: 3D-модель для планирования застройки, инсоляции, ветра, шума (Cesium/Bentley iTwin; токийский двойник для симуляции эвакуации при землетрясении).
2. Permitting и zoning: автоматизация разрешений с гео-контекстом (Accela, OpenGov, Tyler).
3. Управление трафиком и транспортное моделирование (Replica — синтетические популяции, PTV Visum).
4. Климатическая адаптация: острова тепла, ливневые стоки, посадка деревьев.
5. Управление городскими активами (освещение, знаки, деревья) с mobile GIS.
6. Массовая оценка недвижимости для налога на имущество (пересечение с вертикалью 5).
7. Общественная безопасность / real-time crime centers (гео-ядро; Hexagon Safety, Axon).
8. Citizen engagement: 311-сервисы с геопривязкой.

**Крупнейшие боли.**
- «Пилотное чистилище»: у городов нет CAPEX на масштабирование — исторические провалы (Sidewalk Toronto закрыт в 2020, Cisco свернула smart-city бизнес) дискредитировали категорию «платформа умного города».
- Фрагментация закупок: 19 тыс. муниципалитетов только в США; средний чек мал, CAC высок.
- Кадровый дефицит GIS-специалистов в мэриях — спрос на «аналитика в коробке», а не на инструмент.
- Силосы данных между департаментами; двойники делаются на гранты и умирают без обновления.
- Стоимость боли для города: один только неоптимальный трафик — $74 млрд/год в США (INRIX); наводнения и жара — растущие страховые и бюджетные потери.

**Существующие софтверные решения (категории).** GIS-платформы (Esri ArcGIS — де-факто монополия в западных мэриях; QGIS как free-альтернатива); gov-tech системы записи (Tyler Technologies, Accela, OpenGov, Granicus); двойники/3D (Bentley iTwin + Cesium (куплена в 09.2024), Autodesk Forma, Hexagon; UrbanFootprint, Replica — аналитика); транспортное моделирование (PTV/Umovity, Aimsun); IoT-платформы городов (Cisco/exit, Siemens, NTT).

**Лидеры рынка.**

| Компания | Выручка | Роль |
|---|---|---|
| Esri | ~$1,5–2,5 млрд [оценка; частная, публичных данных нет — оценки прессы расходятся $1,3–5 млрд] | системный стандарт GIS в госсекторе; 350 тыс.+ организаций |
| Tyler Technologies | $2,3 млрд (2025) | «операционная система» местного самоуправления США |
| Bentley Systems | $1,5 млрд (2025, +11%) | инфраструктурные двойники, iTwin+Cesium |
| Hexagon | operating net sales ~€5,4 млрд (группа); Safety & Infrastructure — часть | диспетчеризация 911, городские сети |
| Accela / OpenGov | частные; OpenGov куплена Cox по оценке ~$1,8 млрд (2024) [оценка] | permitting/лицензирование |

**Вывод для инвестора.** «Smart city» как горизонтальная платформа — кладбище капитала; покупается не «умный город», а конкретная бюджетная строка: permitting, оценка недвижимости, управление активами, ливневая канализация. Модель Tyler (владей системой записи, доллар за долларом расширяйся) доказала $2,3 млрд выручки и мультипликаторы SaaS — гео-native аналог системы записи для физических активов города всё ещё не построен. Самый инвестируемый клин сейчас — climate adaptation с федеральным/страховым финансированием: боль оцифрована в долларах убытков, а решения покупаются вне классического smart-city скепсиса.

---

### Location intelligence для ритейла и потребительских рынков

**TAM.** Généric-отчёты по «location intelligence» дают $25 млрд (2025) → $47–54 млрд (2030), CAGR 13,5–16,8% (Mordor, Grand View) — но это зонтичная категория, включающая всё от геомаркетинга до логистики. Узкий рынок foot traffic & customer location intelligence: $4,7–8,6 млрд (2025) по трём генерикам с CAGR 6–10% — разброс в 1,8 раза из-за включения indoor-аналитики и retail media. Согласованная оценка реального SAM (site selection + foot traffic данные и аналитика + гео-CRE-данные для ритейла): **$2–3,5 млрд (2025) [оценка]**, растёт 15–20% — быстрее генерик-CAGR, потому что категория молодая и недопроникнута (у Placer.ai 4300+ клиентов при сотнях тысяч потенциальных).

**CAGR.** 13–17% (широкая категория, Mordor/GVR); ядро foot-traffic-аналитики — 20%+ [оценка] при условии сохранения качества данных (см. боли).

**Основные клиенты.** Ритейл-сети и QSR (VP of Real Estate / growth teams — site selection); владельцы ТЦ и REIT (leasing, asset management); CRE-брокеры (JLL, CBRE); CPG (sales/insights); муниципалитеты и DMO (туризм); финансовые игроки (пересечение с вертикалью 6). Бюджеты: подписка Placer — от ~$15–20 тыс./год за рынок до $500 тыс.+ enterprise; CoStar-подписки — $20–100 тыс.+/год на команду.

**Основные use cases.**
1. Site selection: прогноз выручки новой точки, void-анализ, каннибализация сети.
2. Trade area и профилирование посетителей (демография по census-привязке).
3. Конкурентный бенчмаркинг посещаемости (сеть vs сеть, до публикации отчётности).
4. Leasing/asset management ТЦ: обоснование арендных ставок трафиком.
5. Retail media и out-of-home: таргетинг и attribution по визитам.
6. CPG: дистрибуция и полочные решения по трафику каналов.
7. Муниципальный/туристический анализ потоков.
8. Оценка залога и андеррайтинг CRE-кредитов.

**Крупнейшие боли.**
- Деградация сырья: после Apple ATT и ужесточения SDK-практик GPS-панели сжались в разы; качество/репрезентативность падают, а модели «дорисовывают» — риск систематической ошибки, который клиенты не могут проверить.
- Регуляторный риск: FTC в 2024 запретила Gravy Analytics/Venntel и Mobilewalla продавать sensitive location data; X-Mode — ранее; Near Intelligence прошла через банкротство после SPAC на ~$1 млрд. Хвостовой риск — федеральный закон о приватности, убивающий сырьевые панели.
- Отсутствие ground truth: клиенты сравнивают показания Placer/Unacast со своими кассами и находят расхождения 20–40% на низкотрафичных точках.
- Стоимость ошибки клиента: неудачная точка сети — $0,5–3 млн капзатрат + годы убыточной аренды; именно поэтому site selection — самый устойчивый бюджет категории.

**Существующие софтверные решения (категории).** Foot-traffic-аналитика (Placer.ai, Unacast/Gravy, Advan — финпотребители); POI/данные (SafeGraph, Foursquare Places, Precisely, Overture — бесплатно); site-selection-платформы (Buxton, Kalibrate, SiteZeus, GrowthFactor, Esri Business Analyst); CRE-данные (CoStar, Green Street); геомаркетинг (CARTO как platform-play).

**Лидеры рынка.**

| Компания | Метрика | Комментарий |
|---|---|---|
| Placer.ai | $100 млн ARR (02.2024), рост 60%+; ~$180–220 млн ARR к 2025 [оценка]; оценка $1,5 млрд (07.2024) | безусловный категорийный лидер; 4300+ клиентов |
| CoStar Group | $3,2 млрд выручки (2025, +19%) | смежный гигант CRE-данных; двигается в аналитику локаций |
| Foursquare | ~$60–120 млн [оценка; Getlatka $58 млн — вероятно занижено] | пивот в POI-данные (Graph), закрыла consumer-app |
| Buxton / Kalibrate | частные, десятки $ млн [оценка] | легаси site selection, консультативная модель |
| Unacast (вкл. Gravy) | частная; под FTC-ограничениями | пример регуляторного удара |

**Вывод для инвестора.** Placer.ai доказала главное: грязные вероятностные данные, упакованные в самообслуживаемый вертикальный SaaS с бенчмарками, продаются за SaaS-мультипликаторы — тогда откуда угодно (спутник, Wi-Fi, транзакции) можно повторить паттерн в незанятых гео-нишах. Но сырьевая база (GPS-панели) структурно деградирует, а регулятор целится именно в неё — durable moat уйдёт к тем, кто заменит панели на first-party данные (кассы, Wi-Fi, камеры, транзакции) и на них калиброванные модели. Входить в лоб против Placer поздно; входить в data-калибровку, международные рынки (Placer — США-центрична) и в андеррайтинг CRE-кредитов — ещё нет.

---

### Госсектор: кадастр, землеустройство, национальное картографирование

**TAM.** Здесь TAM — это госбюджеты, а не рыночные отчёты:
- Софт для land management/records: $2,1–2,3 млрд (2025), CAGR 6–8% (TBRC/VMR — генерики, но порядок величины правдоподобен).
- Бюджеты национальных картографических агентств: Ordnance Survey (UK) — выручка £194,5 млн (FY2024/25, восьмой рекордный год подряд); USGS National Geospatial Program — $86,2 млн (FY2025) при общем бюджете USGS $1,45 млрд; глобально ~50–60 значимых NMA. Совокупные мировые расходы на нацкартографирование и кадастр (агентства + аутсорс): **$8–12 млрд/год [оценка]**.
- Донорское финансирование land administration: Всемирный банк непрерывно кредитует модернизацию кадастров (Панама — программа $95,2 млн, одобрена 04.2026; Камерун — $17 млн, 2025; десятки активных проектов, кумулятивно $ млрд-ы).
- SAM для коммерческого софта/аналитики (лицензии, SaaS, data-as-a-service для кадастра, оценки, землеустройства): **~$2,5–4 млрд (2025) [оценка]**.

**CAGR.** 6–10%; всплески привязаны к национальным программам цифровизации (Индия, Индонезия, Саудовская Аравия, Восточная Европа).

**Основные клиенты.** Национальные агентства (кадастр, регистрация прав, NMA), региональные земельные департаменты, в США — 3000+ county assessors (массовая оценка для property tax), города; плательщик часто — донор (WB, USAID до 2025, ЕС). Решение: глава агентства + тендерный комитет; циклы 1–3 года; контракты $1–50 млн (интеграторские) или подписки $50–500 тыс./год.

**Основные use cases.**
1. Оцифровка и ведение кадастра (parcel fabric), 3D-кадастр.
2. Массовая дроновая съёмка для регистрации прав: индийская SVAMITVA — 326 889 деревень отснято дронами, 111,7 млн участков оцифровано (на 05.2026) при бюджете всего ₹566 crore (~$68 млн) — крупнейшая в мире программа property rights.
3. Массовая оценка недвижимости (CAMA) для property tax — включая AI-детекцию незадекларированных улучшений (бассейны, пристройки) по аэроснимкам.
4. Регистрация прав и title workflow (registry systems).
5. Землеустройство и разрешение земельных споров.
6. Мониторинг госземель: самозахваты, незаконное строительство.
7. Национальные базовые карты и elevation-программы (3DEP в США).

**Крупнейшие боли.**
- ~70% населения мира не имеет документированных прав на землю (WB/WEF); «мёртвый капитал» по де Сото — $9+ трлн — политическое обоснование всех программ.
- Бумажные архивы и споры: земельные конфликты — до двух третей судебной нагрузки в ряде стран Юга.
- Недосбор property tax из-за устаревших оценок — для муниципалов апгрейд кадастра самоокупаем (рост налоговой базы 10–30% после переоценки [оценка]) — редкий в госсекторе self-funding кейс.
- Кастомизация под юрисдикцию убивает тиражируемость софта; каждая страна — свой проект.
- Зависимость от донорских циклов и политической воли.

**Существующие софтверные решения (категории).** GIS-ядро (Esri Parcel Fabric — стандарт США), кадастровые suites (Trimble Landfolio — продан Vela/Constellation в 2023, Thomson Reuters Aumentum, Hexagon), CAMA/налоговая оценка (Tyler Appraisal & Tax, Schneider Geospatial, интеграции с Nearmap/EagleView-снимками), registry-интеграторы (национальные IT-компании), новая волна: Medici Land Governance, Meridia, Cadasta (некоммерч.), дрон-стеки (Esri+Survey of India в SVAMITVA).

**Лидеры рынка.**

| Игрок | Метрика | Роль |
|---|---|---|
| Esri | ~$1,5–2,5 млрд [оценка] | платформенный стандарт кадастровых систем |
| Tyler Technologies | $2,3 млрд (2025); appraisal & tax — один из ключевых сегментов | системы записи для county-оценки |
| Trimble | выручка $3,55–3,59 млрд (2025) | съёмочное железо + land admin наследие |
| Hexagon | группа ~€5,4 млрд | съёмка + госинтеграция |
| Ordnance Survey | £194,5 млн | образец коммерциализации NMA |

**Вывод для инвестора.** Деньги здесь надёжные, но медленные и проектные: venture-кейс на custom-кадастрах не собирается (низкая тиражируемость, донорские циклы). Два исключения: (1) CAMA-аналитика для property tax в США — 3000+ округов, self-funding ROI, устаревший стек Tyler/Schneider, идеальная поляна для AI-переоценки по свежим аэро/спутниковым снимкам (модель EagleView/Nearmap доказала, что county платят за детекцию изменений); (2) массовая drone-to-title автоматизация по модели SVAMITVA на экспорт — Индия показала себестоимость $0,5–1 на участок, и десятки стран захотят повторить. Ставки на «блокчейн-кадастры» умерли — не реанимировать.

---

### Финансовые рынки и alternative data

**TAM.** Максимальный разброс оценок во всём кластере — и максимальная доля маркетингового шума:
- Генерики: $12–19 млрд (2025) с CAGR 28–50% (Grand View $18,8 млрд; Precedence $14,2 млрд, CAGR 50% — экстраполяции, к 2035 дающие абсурдные $850 млрд; помечаем как ненадёжные).
- Integrity Research (отраслевой аналитик рынка исследований): траектория к $50–80 млрд к 2028 — тоже агрессивно, но фиксирует консенсус о 25%+ росте.
- Честная оценка реальных расходов buy-side на alternative data (данные + инструменты): **$5–10 млрд (2025) [оценка]** — от бенчмарка «$1 млн затрат на $1 млрд AUM у активных фондов» и $15–60 млн/год бюджета крупного мультистрата.
- SAM геопространственного сегмента (спутниковые сигналы, геолокация/foot traffic для трейдинга, товарные потоки): **$1,5–2,5 млрд (2025) [оценка]**, из которых большая часть — commodity flow intelligence (Kpler и пр.), а не «спутник для сток-пикинга».

**CAGR.** Alt data в целом — 20–30% [оценка, дисконтируя генериков]; гео-подсегмент — двузначный только в commodity/maritime-ветке; ветка «сигналы для фондов акций» растёт медленно и консолидируется.

**Основные клиенты.** Мультистратегии и квант-фонды (Millennium, Citadel, Point72, Two Sigma — data sourcing teams; бюджеты на данные $50–100+ млн/год на фонд, на отдельный гео-датасет — $50–500 тыс./год); commodity-трейдеры (Trafigura, Vitol, Glencore — платят за потоки, а не за альфу; бюджеты $1–10 млн/год); банки/ресёрч; корпораты (конкурентная разведка); государства (санкционный мониторинг — смежный покупатель тех же maritime-данных). Решение: head of data sourcing / head of research после data trial 1–3 мес.

**Основные use cases.**
1. Прогноз выручки ритейлеров по спутниковым парковкам и GPS foot traffic (Advan, Placer-данные) до earnings.
2. Нефть: уровни хранилищ по теням плавающих крыш резервуаров, экспортные потоки (Kpler, Vortexa, Ursa Space по SAR).
3. Отслеживание судов + STS-перевалка «теневого флота» — санкционный комплаенс и трейдинг (Windward, Kpler-MarineTraffic).
4. Металлы: активность плавилен по теплу/SAR (RS Metrics, SpaceKnow — активность заводов Китая).
5. Урожайность и с/х-потоки для трейдинга зерном.
6. Строительная активность/CAPEX-детекция по стройплощадкам.
7. Event-driven: детекция аварий/остановок производств раньше новостей.

**Крупнейшие боли.**
- Быстрый распад альфы: сигнал, проданный десяти фондам, перестаёт быть сигналом; отсюда потолок ACV и врождённая ограниченность TAM «продаж альфы».
- Короткая история данных для бэктеста (спутниковые серии < 10 лет) — квант-фонды отказывают в онбординге.
- Compliance/MNPI и приватность: юридическая экспертиза каждого датасета; после FTC-кейсов гео-панели токсичнее.
- Экономика продаж: data trial долгий, churn высокий, а бюджет фонда на «эксперименты» первым режется в просадку.
- Кладбище категории — эмпирическое доказательство боли: Orbital Insight ($130 млн инвестиций → экстренный заём под оценку $50 млн → распродажа Privateer, 2024), Descartes Labs (fire sale EarthDaily, 2023), Near Intelligence (банкротство после SPAC ~$1 млрд), Kayrros (поглощена Energy Aspects, 2026).

**Существующие софтверные решения (категории).** Commodity flow intelligence (Kpler, Vortexa, Ursa Space); maritime risk (Windward — take-private FTV Capital за £216 млн/$280 млн, 03.2025); спутниковые сигналы (RS Metrics, SpaceKnow, остатки Orbital Insight); транзакционно-геолокационные фиды (Advan, Consumer Edge, Placer для фондов); маркетплейсы данных (Nasdaq Data Link, Bloomberg Enterprise, Snowflake Marketplace); ESG/methane (Kayrros→Energy Aspects, GHGSat — смежно).

**Лидеры рынка.**

| Компания | Метрика | Судьба |
|---|---|---|
| Kpler | $100 млн ARR (01.2024); ~$250–350 млн (2025) [оценка] с учётом M&A; цель $1 млрд | консолидатор-победитель |
| Vortexa | частная; выручка десятки $ млн [оценка] | нишевый №2 в энергопотоках |
| Windward | ~$35–40 млн выручки [оценка по последней публичной отчётности] | выкуплена FTV, разворот в govtech |
| Advan Research | частная | стандарт геолокационных фидов для фондов |
| Ursa Space / RS Metrics / SpaceKnow | мелкие (< $20 млн [оценка]) | выжившие в нише SAR-сигналов |
| Orbital Insight / Descartes Labs / Near | — | кладбище модели «сигналы для альфы» |

**Вывод для инвестора.** Десятилетний натурный эксперимент завершён: продавать спутниковую альфу хедж-фондам — value trap (мелкий пул ACV, распад сигнала, кладбище из Orbital Insight и Descartes Labs), а продавать те же данные как операционный терминал трейдерам, фрахтователям и комплаенс-командам — работает (Kpler идёт к $1 млрд выручки, Windward выкуплен PE с премией). Всё ещё открыто: терминал уровня Kpler для agri-потоков и для металлов/батарейной цепочки, где консолидация не произошла. Новые гео-данные имеет смысл строить только с dual-use дистрибуцией (трейдеры + санкционные регуляторы + страховщики) — одна вертикаль фондов не окупает CAPEX сбора данных.

---

### Синтез по кластеру

| Вертикаль | SAM гео-софта 2025, [оценка] | Рост ядра | Зрелость | Главная открытая позиция |
|---|---|---|---|---|
| Supply chain visibility | $1,5–2,5 млрд | 15–20% | консолидация | agentic-слой поверх visibility; «Kpler для новых потоков» |
| Транспорт/fleet/карты | $6–9 млрд | 8–12% | зрелая/дефляция карт | система записи состояния дорожной инфраструктуры |
| Умные города | $4–6 млрд | 12–20% | пост-разочарование | climate adaptation с страховым финансированием |
| Retail location intelligence | $2–3,5 млрд | 15–20% | рост, риск сырья | first-party калибровка; не-US рынки; CRE-андеррайтинг |
| Кадастр/нацкартография | $2,5–4 млрд | 6–10% | медленная модернизация | AI-CAMA для property tax; drone-to-title на экспорт |
| Финрынки/alt data | $1,5–2,5 млрд | 10–25% | консолидация | commodity-терминалы agri/metals; dual-use данные |

Суммарный SAM кластера для геопространственного софта/аналитики: **~$18–27 млрд (2025) [оценка]** при конечных рынках на порядки больше. Паттерн победителей одинаков во всех шести вертикалях: не продавать данные или карту, а владеть системой записи/решений, в которой геоданные — скрытый ингредиент (Samsara, Tyler, Kpler, Placer). Все крупные провалы кластера (Orbital Insight, Near, HD-карты, smart-city-платформы) — это продажа «сырого гео» без workflow.

---

### Источники по кластеру

- Gartner, Magic Quadrant for Real-Time Transportation Visibility Platforms, 2025. https://www.gartner.com/en/documents/6204087
- Global Market Insights, Supply Chain Visibility Software Market, 2025. https://www.gminsights.com/industry-analysis/supply-chain-visibility-software-market
- Market.us, Supply Chain Visibility Software Market, 2025 (генерик, использован с оговорками). https://market.us/report/supply-chain-visibility-software-market/
- Sacra, FourKites Equity Research Update, декабрь 2025. https://sacra.com/c/fourkites/
- Getlatka, project44 / FourKites revenue estimates, 2024–2025. https://getlatka.com/companies/project44
- Business Wire, «Real-Time Transportation Visibility Platforms Report 2025», август 2025. https://www.businesswire.com/news/home/20250820985707/en/
- Business Wire, «Shippeo Raises $30m Strategic Round Led by Woven Capital», январь 2025. https://www.businesswire.com/news/home/20250113725048/en/
- Crunchbase News, «Supply Chain Startup Altana Hits Unicorn Status, Raises $200M», 2024. https://news.crunchbase.com/venture/supply-chain-startup-unicorn-altana/
- Descartes Systems Group, Fiscal 2026 Fourth Quarter and Annual Financial Results (SEC), 2026. https://www.descartes.com/resources/news/descartes-announces-fiscal-2026-fourth-quarter-and-annual-financial-results
- Kpler, «Kpler reaches $100 million annual recurring revenue milestone», январь 2024. https://www.kpler.com/blog/kpler-reaches-100-million-annual-recurring-revenue-milestone
- gCaptain / Riviera Maritime Media, «Kpler Acquires Spire Maritime» ($233,5 млн), 2025. https://gcaptain.com/kpler-acquires-spire-maritime-aiming-to-dominate-vessel-tracking/
- Spire Global, Form 8-K (продажа maritime-бизнеса), SEC, 2025. https://www.sec.gov/Archives/edgar/data/1816017/000095017025071377/spir-ex99_1.htm
- FTV Capital, «FTV Capital Completes Acquisition of Maritime AI Leader Windward» (£216 млн), март 2025. https://ftvcapital.com/2025/ftv-capital-completes-acquisition-of-maritime-ai-leader-windward/
- Tech.eu, «Energy Aspects to buy Paris-based Kayrros», март 2026. https://tech.eu/2026/03/13/energy-aspects-to-buy-paris-based-kayrros-to-add-satellite-and-geospatial-analytics-capabilities/
- SpaceNews, «Privateer acquires Orbital Insight», май 2024. https://spacenews.com/acquires-orbital-insight/
- McKinsey Global Institute, «Risk, resilience, and rebalancing in global value chains», 2020 (потери ~45% годовой EBITDA за декаду).
- Samsara, Q4 / Full Fiscal Year 2026 Financial Results, март 2026. https://www.samsara.com/company/news/press-releases/q4-fiscal-year-2026-results
- Market Research Future, Fleet Telematics Market (генерик, порядок величины), 2025. https://www.marketresearchfuture.com/reports/fleet-telematics-market-40320
- MarketsandMarkets, HD Map for Autonomous Vehicles Market, 2025. https://www.marketsandmarkets.com/Market-Reports/hd-map-autonomous-vehicle-market-141078517.html
- ResearchAndMarkets / Business Wire, «HD Maps for Autonomous Driving Forecast Report 2025–2032», ноябрь 2025. https://www.businesswire.com/news/home/20251119970902/en/
- TomTom, Q1–Q4 2025 Results. https://corporate.tomtom.com/
- Trimble Inc., 2025 Annual Report / Form 10-K, SEC. https://www.sec.gov/Archives/edgar/data/864749/000086474925000099/trimble2025ars.htm
- FreightWaves, Trimble Transportation segment results, 2024–2025. https://www.freightwaves.com/news/trimbles-q4-transportation-and-logistics-revenue-tops-206m
- Mobileye, REM / AV Maps vs HD Maps (позиция по crowdsourced-картам). https://www.mobileye.com/technology/rem/
- Wikipedia / PitchBook, Here Technologies (выручка, акционеры) [оценка]. https://en.wikipedia.org/wiki/Here_Technologies
- vialytics (600+ муниципалитетов), Cyvl — материалы компаний, 2025. https://www.vialytics.com/ ; https://cyvl.com/
- ASCE, Infrastructure Report Card (бэклог дорог ~$786 млрд). https://infrastructurereportcard.org/
- INRIX, Global Traffic Scorecard 2024 (ущерб от пробок ~$74 млрд, США) [оценка].
- IDC, Worldwide Smart Cities Spending Guide (техрасходы ~$190 млрд; аналитика штатов/муниципалитетов $13,8 млрд 2024). https://www.idc.com/
- Fortune Business Insights / Expert Market Research, Smart Cities Market (генерики $0,95–1,3 трлн — помечены как методологически широкие). https://www.fortunebusinessinsights.com/industry-reports/smart-cities-market-100610
- MarketIntelo, City Digital Twin Market (генерик). https://marketintelo.com/report/city-digital-twin-market
- Bentley Systems, Q4 & Full Year 2025 Results; приобретение Cesium (сентябрь 2024). https://www.bentley.com/news/bsy-announces-q4-and-full-year-2025-results-and-2026-outlook/ ; https://www.bentley.com/news/bentley-systems-acquires-3d-geospatial-company-cesium-2/
- Tyler Technologies, FY2025 guidance/results (Form 8-K, ARS), SEC. https://www.sec.gov/Archives/edgar/data/860731/000086073126000024/tyl2025ars.pdf
- MarketsandMarkets, Geographic Information System Market ($14,5 млрд, 2025). https://www.marketsandmarkets.com/Market-Reports/geographic-information-system-market-55818039.html
- Mordor Intelligence / Grand View Research, Location Intelligence Market, 2025 (широкая категория, использована с оговорками). https://www.mordorintelligence.com/industry-reports/location-intelligence-market
- Placer.ai, «Placer.ai Reaches $100M Annual Recurring Revenue», февраль 2024. https://www.placer.ai/anchor/articles/placer-ai-reaches-100m-annual-recurring-revenue
- TechCrunch, «Placer.ai boosts valuation to $1.5B», август 2024. https://techcrunch.com/2024/08/05/placer-ai-boosts-valuation-to-1-5b-after-quietly-raising-another-75m/
- CoStar Group, Full Year 2025 Results. https://investors.costargroup.com/news-releases/news-release-details/costar-group-full-year-2025-revenue-increased-19-year-over-year
- AdExchanger, «Reflecting On The FTC's Latest Settlements With Sellers Of Sensitive Location Data» (Gravy/Venntel, Mobilewalla), 2024–2025. https://www.adexchanger.com/data-privacy-roundup/reflecting-on-the-ftcs-latest-settlements-with-sellers-of-sensitive-location-data/
- Ordnance Survey Limited, Annual Report and Accounts 2024–25, GOV.UK. https://www.gov.uk/government/publications/ordnance-survey-limited-annual-report-and-accounts-2024-to-2025
- USGS / DOI, FY2025 Budget in Brief (National Geospatial Program $86,2 млн). https://www.doi.gov/sites/default/files/documents/2024-04/2025bibusgs508.pdf
- World Bank, пресс-релизы по модернизации кадастров: Панама ($95,15 млн программа, апрель 2026), Камерун ($17 млн, 2025). https://www.worldbank.org/en/news/press-release/2026/04/29/
- The Business Research Company / Verified Market Reports, Land Management Software Market (генерики). https://www.thebusinessresearchcompany.com/report/land-management-software-global-market-report
- PIB India / Survey of India, SVAMITVA Scheme (бюджет ₹566,23 crore; 326 889 деревень, 11,17 crore участков на май 2026). https://surveyofindia.gov.in/pages/svamitva
- World Economic Forum, «Inside the world's largest drone property rights initiative», 2023. https://www.weforum.org/stories/2023/11/unlocking-rural-prosperity-the-worlds-largest-drone-led-property-rights-initiative/
- Grand View Research / Precedence Research, Alternative Data Market, 2025–2026 (генерики с CAGR 30–50% — помечены как ненадёжные экстраполяции). https://www.grandviewresearch.com/industry-analysis/alternative-data-market
- Integrity Research Associates, «The Explosive Growth of the Alternative Data Industry: Revenue Forecasts Through 2028». https://www.integrity-research.com/the-explosive-growth-of-the-alternative-data-industry-trends-drivers-and-revenue-forecasts-through-2028/
- Wikipedia, Orbital Insight (финансовые трудности 2023, заём под оценку $50 млн). https://en.wikipedia.org/wiki/Orbital_Insight
- Hernando de Soto, «The Mystery of Capital» (оценка «мёртвого капитала» ~$9 трлн) — базовое обоснование программ land administration.
