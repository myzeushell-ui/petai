# ЧАСТЬ 1. КАРТА РЫНКА

## Кластер: Природные ресурсы и энергетика

**Рамка кластера.** Шесть вертикалей, где физические активы распределены по огромным территориям (поля, леса, рудники, скважины, ЛЭП, вышки), а значит геопространственные данные — не «nice to have», а единственный способ увидеть актив целиком. Совокупная выручка отраслей-потребителей кластера — >$12 трлн/год, но платящий SAM для геопространственного софта/аналитики внутри кластера мы оцениваем всего в **$6–10 млрд (2025)** — это одновременно и разочарование, и возможность. Для калибровки: весь коммерческий рынок EO-данных и value-added-услуг Novaspace оценивает в ~$5 млрд (2024) с ростом до $8+ млрд к 2033; EUSPA оценивает выручку EO-даунстрима в €3,5 млрд (2024) → €7,9 млрд (2034), причём сельское хозяйство — крупнейший вклад. Ключевой паттерн кластера: **деньги там, где регуляторика или катастрофическая ответственность (wildfire liability, EU Methane Regulation, EUDR, tailings-компляенс), а не там, где «оптимизация урожайности»**. Второй паттерн: в вертикалях с низкой платёжеспособностью конечного пользователя (фермеры) выживают только те, кто встроился в цепочку создания стоимости (Deere, Bayer) или сменил бизнес-модель с продажи софта на владение активом (KoBold Metals).

Оговорка по методологии: оценки «generic»-аналитиков (MarketsandMarkets, Grand View, Fortune BI и пр.) расходятся в 2–4 раза из-за разных границ рынка (hardware+софт vs только софт; весь digital vs только геопространственный слой). Везде ниже мы разделяем: (а) TAM вертикали-потребителя, (б) TAM софта вертикали в целом, (в) SAM геопространственного софта/аналитики — и даём собственную согласованную оценку.

---

### Сельское хозяйство (precision agriculture + agri-инсайты)

**TAM.**
| Уровень | Оценка | Источник / комментарий |
|---|---|---|
| Валовая продукция сельского хозяйства | ~$4–5 трлн/год | FAO [оценка] — контекст, не адресуемый рынок |
| Precision agriculture (софт+железо+сервисы) | $9,5–14,2 млрд (2025), согласованная оценка **~$11 млрд** | разброс Grand View / Precedence / MarketsandMarkets; расходятся из-за включения guidance-железа и VRT-оборудования (generic-отчёты, с осторожностью) |
| Софт: FMS + crop monitoring аналитика | $3–4 млрд (2025) [оценка]; crop monitoring $3,3 млрд (2025, GM Insights, generic) | только программный слой |
| **SAM геопространственной аналитики (спутники/дроны/AI-инсайты)** | **$0,7–1,2 млрд (2025) [оценка]** | триангуляция: EUSPA — agriculture крупнейший сегмент EO-даунстрима (€3,5 млрд всего, ag ~20% ≈ €0,7 млрд); выручки игроков (FieldView, EOSDA, Planet-ag) в сумме <$1 млрд |

**CAGR.** Precision ag: 9–13% (2025–2030/35, консенсус generic-отчётов). EO-даунстрим в ag: ~12–15% [оценка на базе EUSPA 2024→2034]. Сегмент ag carbon MRV — с крошечной базы 25–30%+.

**Основные клиенты.** Платят НЕ фермеры (WTP $0,5–3/акр/год, высокий churn), а: (1) input-мейджоры и OEM — Bayer, Corteva, Syngenta, John Deere, CNH: бюджеты на digital $100M–500M/год каждый, решение принимает Chief Digital/Technology Officer; (2) агрострахование — в США субсидируемая USDA RMA программа ($17+ млрд премий/год), страховщики покупают yield-данные; (3) трейдеры и CPG (Cargill, ADM, Nestlé, Unilever) — Scope 3 и supply-chain-прозрачность, бюджеты $1–10M/сделка; (4) государства — контроль субсидий (EU CAP «checks by monitoring» на Sentinel), Индия, Бразилия; (5) банки/кредиторы сельхозземель.

**Основные use cases.**
1. Variable-rate предписания (семена/удобрения) — ядро FieldView/Operations Center.
2. Прогноз урожайности для трейдинга и госстатистики (бывшая ниша Gro Intelligence).
3. Андеррайтинг и удалённое урегулирование убытков в агростраховании (в т.ч. индексное страхование в развивающихся рынках).
4. Carbon MRV по практикам regenerative ag (Regrow, Perennial; рынок добровольных ag-кредитов пока лишь ~$36M в 2024, GM Insights).
5. EUDR-комплаенс: доказательство «deforestation-free» происхождения сои/какао/кофе/пальмы — дедлайн для крупных операторов сдвинут на конец 2026 [оценка по состоянию на конец 2025], обязательная геолокация каждого участка.
6. Контроль CAP-субсидий в ЕС — полностью спутниковый мониторинг заявок.
7. Ирригация и водный стресс (Калифорния, Австралия, Ближний Восток).
8. Скаутинг/раннее обнаружение болезней с дронов и спутников (Sentera, Taranis).

**Крупнейшие боли.**
- Экономика продаж фермеру не сходится: CAC высокий, ARPU низкий, сезонный churn. Стоимость боли — кладбище стартапов: Gro Intelligence (закрылась в 2024, подняв $100M+), Farmers Edge (IPO на TSX в 2021 по C$17, делистинг в 2024 по C$0,35 — минус ~98%), Indigo Ag (переоценка с $3,5 млрд до ~$200M, −94%).
- Разрыв «инсайт → действие»: рекомендация без интеграции в технику Deere/CNH не исполняется.
- Фрагментация данных и форматов между OEM; Deere и Bayer строят закрытые экосистемы (интеграция FieldView↔Operations Center с сезона 2026).
- Валидация ag-carbon методологий — доверие к кредитам низкое, цены $10–30/т.
- Развивающиеся рынки: 500M+ мелких хозяйств, платёжеспособность около нуля — платить должны банки/страховщики/государства.

**Существующие софтверные решения.** Категории: FMS/digital-ag-платформы (John Deere Operations Center, Climate FieldView, xarvio/BASF, Cropwise/Syngenta, Trimble Ag → PTx); satellite crop analytics (EOS Data Analytics, Planet Crop Biomass, EarthDaily Agro — экс-Descartes Labs Agro, Geosys); carbon/regen MRV (Regrow, Perennial, Agreena, Boomitra); скаутинг/дроны (Sentera — куплена Deere в мае 2025, Taranis); индексное страхование (Pula, IBISA); commodity intelligence (Kayrros-ag, Satelligence, LSEG/Refinitiv Ag Weather).

**Лидеры рынка.** John Deere: сегмент Production & Precision Ag — $17,3 млрд выручки (FY2025, −17% г/г, циклический спад), Operations Center — 400M+ engaged acres, монетизация через технику и переход к Solutions-as-a-Service; Bayer Climate FieldView — 250M+ подписных акров в 23 странах, выручка цифрового бизнеса [оценка] $150–250M; PTx Trimble (JV AGCO/Trimble, 85% у AGCO) — база ~$850M выручки с целью $2 млрд к 2029; EOSDA — частная, [оценка] выручка $10–30M; Planet — коммерческий сегмент (59% от $307,7M FY2026) со «встречным ветром в agriculture» по собственному признанию.

**Вывод для инвестора.** Прямые продажи аналитики фермерам — доказанно смертельная модель (три громких провала за три года); стоимость создаётся в точках концентрации маржи: OEM, input-компании, страховка, трейдинг, регуляторный комплаенс (EUDR, CAP). Реалистичный путь к большой компании — «регуляторный Veeva» для агро-цепочек поставок (EUDR + Scope 3 + carbon в одном контуре) с оплатой от CPG/трейдеров, а не от фермеров. Прямой B2F-путь имеет смысл только как бесплатный канал сбора данных с монетизацией наверху цепочки.

---

### Лесное хозяйство

**TAM.**
| Уровень | Оценка | Источник / комментарий |
|---|---|---|
| Лесная отрасль (заготовка + продукция) | ~$0,6–0,8 трлн/год [оценка] | контекст |
| Forestry software (весь) | $1,4–1,8 млрд (2025), согласованно **~$1,5 млрд** | Verified Market Reports / SkyQuest / market.us (generic, разброс из-за включения ERP лесозаготовки) |
| **SAM геопространственной аналитики леса** (инвентаризация, мониторинг, fire risk, carbon MRV) | **$0,5–0,9 млрд (2025) [оценка]** | инвентаризация и GIS — крупнейшая часть forestry software; + carbon MRV; + wildfire intelligence |
| Смежный драйвер: voluntary carbon market | $1,04 млрд спот-ритейрменты (2025, Sylvera), forward offtake $12,3 млрд | MRV/рейтинги забирают единицы процентов |

**CAGR.** Forestry software ~10,5% (market.us, generic); carbon MRV и wildfire intelligence — 20–30%+ с малой базы [оценка].

**Основные клиенты.** (1) TIMO/лесные REIT — Weyerhaeuser (выручка ~$7 млрд), Rayonier, Manulife/Hancock: бюджеты на инвентаризацию и планирование $1–20M/год, решает VP Forest Resources; (2) целлюлозно-бумажные — Suzano, UPM, Stora Enso; (3) гослесслужбы (USFS, провинции Канады, скандинавские агентства) — крупные тендеры; (4) девелоперы carbon-проектов и покупатели кредитов (Microsoft — крупнейший покупатель nature-based removals); (5) страховщики и утилиты (пересечение с wildfire).

**Основные use cases.**
1. Инвентаризация древостоя (satellite+lidar вместо полевой таксации): экономия — полевой замер стоит $3–10/акр, дистанционный <$1 [оценка].
2. Планирование заготовки и цепочки поставок (Remsoft — оптимизационное ядро).
3. Forest carbon MRV: baseline, additionality, мониторинг утечек — Pachama, Chloris, Sylvera-рейтинги.
4. Прогноз и раннее обнаружение пожаров (OroraTech — 10+ тепловизионных спутников, «цифровой двойник пожара»).
5. Фитосанитарный мониторинг (короед в Центральной Европе — ущерб млрд €/год).
6. EUDR-трейсабилити древесины и незаконные рубки.
7. Оценка лесных активов при сделках M&A/кредитовании.

**Крупнейшие боли.**
- Кризис доверия к forest-carbon-кредитам (скандалы с завышенными baseline у Verra-проектов 2023 г.) обвалил объёмы VCM; спрос сместился к «качеству» — премия за верифицируемые кредиты, но общий пул денег на MRV пока мал ($1,04 млрд весь спот-рынок).
- Пожары: страховые убытки от wildfire в США $10–20 млрд/год в пиковые годы [оценка] — платят в первую очередь утилиты и страховщики, а не лесовладельцы.
- Инвентаризация раз в 5–10 лет вместо continuous monitoring; нет «single source of truth» по биомассе.
- Низкая цифровизация среднего лесовладельца; в США 10M+ семейных лесовладений — длинный, бедный хвост.

**Существующие софтверные решения.** Категории: планирование/оптимизация (Remsoft — стратегический инвестор Banneker Partners, купила Lim Geomatics в 2025; Trimble Forestry/CFForest); инвентаризация remote sensing (Treemetrics, Katam, Planet Forest Carbon Diligence — биомасса/высота полога 3–30 м); carbon-платформы (Pachama — $79M привлечено, Chloris Geospatial, NCX — pivot от маркетплейса к land-advisory); рейтинги кредитов (Sylvera — ~$96M привлечено, BeZero); wildfire (OroraTech — Series B €37M, законтрактовано с VC ~€100M за год; Pano AI — камеры, $89M).

**Лидеры рынка.** Фрагментированный рынок без компании >$100M выручки в чисто геопространственном слое: Remsoft [оценка $20–40M], Trimble Forestry [оценка $50–100M в составе Trimble], Esri (ArcGIS — де-факто стандарт GIS в гослесслужбах), OroraTech [оценка выручка €15–30M], Pachama/Sylvera [оценка <$20M каждая].

**Вывод для инвестора.** Сам по себе лес — маленький и медленный софтверный рынок ($1,5 млрд, фрагментация, госзаказчики), на нём $1B ARR не построить. Ценность лесных данных монетизируется в смежных вертикалях: wildfire-риск для утилит и страховщиков, carbon для корпоративных покупателей, EUDR для CPG. Правильная ставка — «биомасса/пожарный риск как data layer», продаваемый в utilities/insurance/commodities, где лес — источник данных, но не источник выручки. Отдельная опция — консолидация legacy-игроков (Remsoft-путь) под PE-стратегию.

---

### Горнодобыча

**TAM.**
| Уровень | Оценка | Источник / комментарий |
|---|---|---|
| Выручка мировой горнодобычи | ~$2,4–2,8 трлн/год; топ-40 майнеров ~$850 млрд | PwC Mine [оценка по данным до 2025] |
| Бюджеты на геологоразведку (nonferrous) | $12–13 млрд/год | S&P Global Market Intelligence [оценка 2024–2025] |
| Mining software (весь) | $3,3–12 млрд (2025) — разброс из-за включения fleet management и ERP; ядро geology & mine planning **$3,8 млрд (2025)** | MRFR / Dataintelo (generic, с осторожностью) |
| **SAM геопространственного софта/аналитики** (3D-геомоделирование, AI-таргетинг, InSAR-мониторинг, ESG) | **$1,2–2 млрд (2025) [оценка]** | geology & mine planning — по сути geospatial; + InSAR-сервисы + exploration AI |

**CAGR.** Geology & mine planning software 8,3% (2025–2034, Dataintelo, generic); InSAR-мониторинг и AI-разведка — 20%+ [оценка], драйвер — критические минералы и tailings-регуляторика.

**Основные клиенты.** (1) Мейджоры (BHP, Rio Tinto, Vale, Glencore, Barrick) — enterprise-скейл InSAR-программы уже внедрены; бюджет на digital у мейджора $100M–1B/год, решают Head of Geoscience / Head of Tailings & Geotech; (2) юниоры (тысячи компаний на ASX/TSX-V) — платят за Leapfrog/Micromine из бюджета разведки, чувствительны к циклу; (3) инжиниринговые консультанты (SRK, WSP, Stantec); (4) регуляторы и страховщики (GISTM-комплаенс по хвостохранилищам); (5) трейдеры и госразведки — мониторинг добычи конкурентов/санкционных объектов.

**Основные use cases.**
1. 3D-геологическое моделирование и оценка ресурсов (Seequent Leapfrog — стандарт implicit modelling).
2. AI-таргетинг разведки: мультимодальные данные (геофизика, геохимия, EO) → вероятностные карты рудных тел (KoBold, Earth AI, VerAI, Fleet Space ExoSphere).
3. InSAR-мониторинг хвостохранилищ и бортов карьеров (точность мм/год; после Brumadinho — стандарт GISTM требует мониторинга всех дамб).
4. ESG/комплаенс: пыление, водные объекты, рекультивация, нелегальная добыча (артельная золотодобыча в Амазонии).
5. Мониторинг активности рудников для трейдинга (стоки, отвалы, ЖД-вагоны).
6. Планирование логистики и mine progress vs план.

**Крупнейшие боли.**
- Падающая результативность разведки: стоимость одного значимого открытия выросла кратно за 20 лет; дефицит меди к 2035 оценивается в миллионы тонн/год — готовность платить за все, что повышает hit rate.
- Катастрофы хвостохранилищ: Brumadinho (2019, 270 погибших) обошёлся Vale в ~$7 млрд компенсаций + GISTM-комплаенс для всей отрасли — прямой бюджет на мониторинг.
- Данные разведки разрознены (бумажные керны, legacy-форматы) — AI-таргетинг упирается в data engineering.
- Циклчность: софт для юниоров умирает вместе с финансированием юниоров в даунцикле.

**Существующие софтверные решения.** Категории: geology & mine planning (Seequent/Bentley, Micromine, Maptek, Datamine, Hexagon Mining, Dassault GEOVIA); AI-разведка (KoBold Metals, Earth AI, VerAI, Fleet Space — Series D по оценке ~A$800M [оценка]); InSAR/геотехника (TRE ALTAMIRA — в составе CLS, SkyGeo, Sensornets, GroundProbe-радары); ESG-мониторинг (Descartes Labs → EarthDaily, Satellite Vu — тепловизия).

**Лидеры рынка.** По доле в geology & mine planning (оценки generic-отчётов, порядок величин): Hexagon Mining ~18%, Maptek ~12%, Micromine ~9%, Seequent ~8% — топ-4 вендора держат ~50%+. Seequent куплена Bentley за $1,05 млрд (2021), выручка [оценка] $250–350M — главный бенчмарк экзита. KoBold Metals: оценка $4,4 млрд (ноябрь 2025), привлечено $1,2+ млрд — но это НЕ софтверная компания: она оставляет себе доли в месторождениях (Замбия, медь).

**Вывод для инвестора.** KoBold — главный урок кластера: если твой алгоритм находит месторождение на $10+ млрд, продавать его как SaaS за $200K/год — ошибка на три порядка; захват стоимости через владение активом/роялти бьёт любую подписку. Чисто софтверная возможность здесь — «Seequent 2.0»: облачный, AI-native стек геоданных с сетевым эффектом на данных бурения, экзит $1–3 млрд стратегу (Bentley, Hexagon, Dassault). InSAR-мониторинг дамб — отличный регуляторно-обязательный wedge ($50–500K/объект/год), но потолок ниши [оценка] $300–500M.

---

### Нефть и газ

**TAM.**
| Уровень | Оценка | Источник / комментарий |
|---|---|---|
| Выручка отрасли O&G | ~$4–5 трлн/год [оценка] | контекст |
| O&G софт (весь) | $31 млрд (2025) → $45 млрд (2035) | WiseGuy/generic, с осторожностью; включает ERP/операции |
| Upstream analytics платформы | $13,4 млрд (2025), CAGR 25% — завышено | ResearchIntelo (generic); наша согласованная оценка upstream-геонаук софта **$5–7 млрд**, якорь — SLB Digital c ARR Delfi >$1 млрд |
| Methane detection & monitoring (все технологии: сенсоры, авиация, спутники) | $3,8 млрд (2025) → $8,9 млрд (2034), CAGR 9,9% | IntelEvo (generic); спутниковая часть ~$1,2 млрд к 2034 |
| **SAM геопространственной аналитики** (methane, pipeline monitoring, EO-инсайты для трейдинга) | **$0,5–0,9 млрд (2025) [оценка]** | суммарные выручки GHGSat/Kayrros/Ursa/Insight M/OSK + geoscience-EO-слой |

**CAGR.** Ядро O&G софта: 4–7%; спутниковый methane/emissions-сегмент: 15–25% [оценка] — единственный быстрорастущий кусок, драйвер регуляторный.

**Основные клиенты.** (1) Супермейджоры и НОК (Shell, TotalEnergies, ADNOC, Aramco): OGMP 2.0-обязательства, бюджеты на emissions-мониторинг $5–50M/год, решает VP HSE/Sustainability + Chief Digital; (2) midstream-операторы (Williams и ONEOK — стратегические инвесторы Orbital Sidekick): integrity-бюджеты диктуются PHMSA; (3) LNG-экспортёры — EU Methane Regulation 2024/1787: с 1 января 2027 импорт в ЕС требует MRV-эквивалентности (OGMP 2.0 Level 5) — прямой форсинг-механизм для всех поставщиков в Европу; (4) трейдеры/хедж-фонды — покупают EO-оценки запасов в хранилищах (Ursa Space, Kayrros); (5) регуляторы и NGO (UNEP IMEO/MARS, EDF MethaneSAT — некоммерческая конкуренция коммерческим игрокам).

**Основные use cases.**
1. Детекция и квантификация метановых супер-эмиттеров (GHGSat: 12+ спутников, 100+ клиентов).
2. Комплаенс-отчётность OGMP 2.0 L5 / EU Methane Reg — reconciliation снизу-вверх и сверху-вниз.
3. Мониторинг целостности трубопроводов: утечки, подвижки грунта (InSAR), несанкционированные работы в полосе отвода (Orbital Sidekick: 12 000+ миль под мониторингом, ~100 подозрений на метановые и 200 на жидкие утечки).
4. Оценка мировых запасов нефти в резервуарах по теням плавающих крыш — сигналы для трейдинга.
5. Геологоразведка: интеграция EO (геоморфология, сипы) в региональный скрининг.
6. Мониторинг факелов (flaring) по VIIRS.
7. Site intelligence для новых проектов (LNG-терминалы, CCS-площадки).

**Крупнейшие боли.**
- Регуляторная волатильность США: EPA Waste Emissions Charge ($900–1500/т CH₄) отменён Конгрессом через CRA в начале 2025 — рынок комплаенса в США сжался, остались ЕС и добровольные обязательства. Стоимость боли для вендоров: развороты политики убивают pipeline продаж на 12–18 месяцев.
- Для операторов: одна крупная утечка = $1–10M прямых потерь газа + репутационные/регуляторные риски; EU-регуляция грозит ограничением доступа к европейскому рынку LNG.
- Фрагментация измерений: спутник/самолёт/наземный сенсор дают расходящиеся цифры — нужна reconciliation-платформа (пока её нет в масштабе).
- Концентрация покупателей: 20–30 компаний определяют весь спрос; сделки медленные, POC-культура.

**Существующие софтверные решения.** Категории: geoscience-платформы (SLB Delfi, Halliburton DecisionSpace/iEnergy, AspenTech SSE, Ikon, Esri для land management); methane satellite (GHGSat, Kayrros — куплена Energy Aspects в марте 2026, MethaneSAT/EDF, Sentinel-5P-аналитика); авиационная детекция (Insight M, Bridger Photonics); pipeline/asset monitoring (Orbital Sidekick, LiveEO Pipeline, SkyGeo InSAR); trading intelligence (Ursa Space, Kayrros, Kpler — смежно).

**Лидеры рынка.** SLB Digital: ARR Delfi >$1 млрд, доля упомянутой пятёрки (SLB, Halliburton, Baker Hughes, IBM, Microsoft) в upstream-аналитике ~60% (generic-оценка); GHGSat — выручка ~$20M (2023), $179M привлечено — потолок роста виден: даже лидер methane-ниши за 8 лет не дорос до $50M; Kayrros — $84M привлечено, экзит в Energy Aspects (сумма не раскрыта, [оценка] — не венчурный мультипликатор); Orbital Insight — пионер EO-аналитики для O&G-трейдинга — продан в дистрессе Privateer (2024).

**Вывод для инвестора.** Ниша выглядит как «регуляторное золото», но фактическая история — три поучительных экзита ниже ожиданий (Kayrros, Orbital Insight, стагнация GHGSat): узкий круг покупателей, POC-ад, политическая волатильность США. Устойчивый спрос создаёт только EU Methane Regulation (дедлайн 2027, затрагивает всех экспортёров LNG в ЕС) — возможность в reconciliation/комплаенс-платформе поверх любых сенсоров (модель «Avalara для метана»), а не во владении спутниками. Вертикально-интегрированные операторы констелляций в этой нише венчурных исходов не дали.

---

### Электроэнергетика и utilities

**TAM.**
| Уровень | Оценка | Источник / комментарий |
|---|---|---|
| Мировые инвестиции в сети | ~$400 млрд/год (2025) | IEA WEI [оценка] |
| Utility vegetation management (UVM, операционные расходы) | $24,2 млрд (2022) → прогноз $39,2 млрд (2029) | Fortune Business Insights; США — крупнейшая статья O&M, >$100M/год у крупных IOU, Калифорния ~$1 млрд+/год |
| Smart grid analytics софт | $3,7–8,5 млрд (2025), согласованно **~$5 млрд** | SkyQuest vs FMI (generic, расходятся по включению AMI-аналитики) |
| **SAM геопространственной аналитики** (VM-аналитика, wildfire risk, инспекции, siting) | **$1–2 млрд (2025) [оценка], самый быстрорастущий SAM кластера** | доля EO/AI-аналитики в UVM ~2–4% и растёт; + siting/interconnection tools |

**CAGR.** UVM-расходы ~7% (Fortune BI); спутниковая VM-аналитика 25–40% с малой базы [оценка]; siting-софт для renewables/data centers — 30%+ [оценка], драйвер — очередь на interconnection и бум ЦОД.

**Основные клиенты.** (1) ~168 investor-owned utilities США (плюс ~2 800 муниципальных/кооперативов — длинный хвост) и европейские TSO/DSO; бюджет: VM — крупнейшая статья O&M; решают VP Vegetation Management / Chief Safety Officer, после пожаров — совет директоров; regulatory recovery: расходы на mitigation перекладываются в тариф — уникально высокая WTP; (2) девелоперы ВИЭ и data-центров (NextEra, Invenergy, гиперскейлеры) — site selection и interconnection; (3) страховщики утилит и cat-модельеры; (4) операторы ЛЭП-строительства.

**Основные use cases.**
1. Приоритизация обрезки растительности: спутник+AI вместо пеших обходов раз в 3–5 лет; экономия 15–30% VM-бюджета [оценка AiDash/Overstory кейсов] = $15–30M/год для крупного IOU.
2. Wildfire risk: карты риска возгорания от контакта растительности с проводами, обоснование PSPS-отключений.
3. Раннее обнаружение возгораний (OroraTech-спутники, Pano AI-камеры: 250+ агентств, 15 утилит).
4. Storm damage assessment: оценка ущерба за часы вместо дней (было — облёты вертолётами).
5. Siting и interconnection screening для solar/wind/storage/дата-центров (Paces, Nira Energy, Enverus P&R): 80% начатых проектов ВИЭ не доходят до стройки — из-за плохого скрининга земли/сети.
6. Оптимизация трасс новых ЛЭП (Continuum Industries).
7. Инспекция активов: столбы, провисы проводов, состояние коридоров (LiDAR + спутник + дрон fusion).

**Крупнейшие боли.**
- Wildfire liability — экзистенциальная: PG&E прошла банкротство с ~$30 млрд исков (Camp Fire 2018); Hawaiian Electric — $2 млрд по Lahaina; страховая премия утилит взлетела. Любой инструмент, снижающий вероятность «пожара от провода», продаётся на уровне борда.
- VM делается «по календарю», а не по риску: до 40% обрезки — не там, где нужно [оценка].
- Interconnection queue в США >2 ТВт заявок, сроки 4–7 лет: скрининг земли, зонирования и сети — ручной, данные разрознены по округам.
- Дефицит полевых бригад и рост стоимости arborist-часа.
- Legacy GIS: сетевые модели в Esri/Smallworld десятилетней давности, не отражают реальность.

**Существующие софтверные решения.** Категории: satellite VM & wildfire (AiDash — $91,5M привлечено, IVMS 2.0; Overstory — Series B $43M в декабре 2025, 6 из 10 крупнейших утилит Сев. Америки; LiveEO — €72M+ привлечено, строит собственную констелляцию Twinspector 35 см; OroraTech); камеры+AI (Pano AI — $89M); grid GIS/ADMS (Esri ArcGIS Utility Network, GE Vernova GridOS, Schneider, Hexagon, IQGeo); siting/interconnection (Paces — YC, Series A $11M, pivot в agentic AI для power-проектов; Nira Energy, Enverus Power & Renewables, PVcase Prospect); инспекции дронами (Skydio, Sharper Shape).

**Лидеры рынка.** Esri — де-факто монополия базового GIS в utilities (выручка всей Esri [оценка] $1,5–2 млрд); GE Vernova — №1 в grid-софте (Guidehouse DERMS Leaderboard); в спутниковой VM-аналитике лидеры — AiDash и Overstory с [оценка] ARR $30–60M каждая — рынок ещё никем не «закрыт».

**Вывод для инвестора.** Лучшее сочетание в кластере: платёжеспособный клиент с регуляторным механизмом возврата затрат (rate case), экзистенциальная боль (wildfire liability в десятки $ млрд), измеримый ROI (15–30% от крупнейшей статьи O&M) и незанятая позиция лидера — ни AiDash, ни Overstory ещё не пробили $100M ARR. Путь к $1B ARR: от VM-аналитики → к полной «климатической операционке» утилиты (wildfire, storm, флуд, инспекции, siting) — расширение ARPU с $0,5M до $5M+/утилиту; 200 крупных сетевых компаний США+ЕС+Австралии дают математику. Отдельный быстрый рынок — siting/interconnection для ВИЭ и дата-центров, где очередь в 2 ТВт создала острую боль девелоперов.

---

### Телеком (планирование сетей, site selection)

**TAM.**
| Уровень | Оценка | Источник / комментарий |
|---|---|---|
| Выручка телеком-операторов | ~$1,5–1,8 трлн/год; capex ~$300 млрд/год [оценка] | контекст |
| GIS в телекоме / network planning софт | $1,5–1,9 млрд (2025) | SkyQuest / Technavio (generic); RF planning ядро ~$1–1,5 млрд |
| **SAM геопространственного софта** (RF-планирование, fiber design, site selection, network digital twin) | **$2–3 млрд (2025) [оценка]** | шире «GIS в телекоме»: + fiber management (IQGeo, VETRO), + deployment ops (Sitetracker), + геоданные (LuxCarta, 3D-модели городов) |

**CAGR.** 9,8–14,7% (2025–2033, SkyQuest/Technavio, generic); всплеск от US BEAD-программы ($42,45 млрд федеральных субсидий на broadband — вся аллокация геопространственная: карты покрытия FCC BDC, challenge-процессы) и от уплотнения 5G/FWA.

**Основные клиенты.** (1) ~800 мобильных операторов; решает VP Network Planning/CTO; бюджеты на planning-софт $0,5–10M/год на оператора; (2) tower-компании (American Tower, Cellnex, Indus) — site selection и colocation-маркетинг; (3) fiber-строители и ISP (BEAD-получатели, altnets Европы) — fiber design софт; (4) нейтральные хосты/DAS; (5) регуляторы (FCC, Ofcom) — верификация карт покрытия; (6) хедж-фанды/вендоры — конкурентная разведка сетей (Ookla).

**Основные use cases.**
1. RF/coverage-планирование 4G/5G (Forsk Atoll — 9 800+ лицензий, 500+ операторов; Infovista Planet) на 3D-моделях городов (LuxCarta, Maxar).
2. Fiber network design & management: проектирование FTTH-маршрутов с автоматической оптимизацией (IQGeo, Comsof, VETRO FiberMap, 3-GIS, Biarri).
3. Site selection и acquisition вышек: рельеф, зонирование, backhaul, население (Sitetracker, Accruent Siterra + ArcGIS).
4. BEAD/госсубсидии: mapping-комплаенс, challenge-процессы, проектирование под гранты.
5. Network digital twin: инвентаризация активов и «as-built vs as-designed».
6. Crowdsourced coverage intelligence для бенчмарков и планирования (Ookla, Opensignal).
7. FWA-планирование (line-of-sight анализ по 3D-данным).

**Крупнейшие боли.**
- Операторский capex под давлением (ROI 5G не сошёлся) — бюджеты планирования режут; продажи операторам — долгие RFP.
- Данные сети рассинхронизированы: inventory в OSS не совпадает с реальностью на 10–30% [оценка] — интеграционные проекты дорогие.
- BEAD-переразметка 2025 г. (пересмотр программы под technology-neutral) задержала выдачу денег — риск сдвига спроса, но объём сохранён.
- Fiber-строители малы и фрагментированы: тысячи ISP с бюджетом $10–50K/год.
- 3D-геоданные городов дороги; конкуренция с бесплатными госданными.

**Существующие софтверные решения.** Категории: RF planning (Forsk Atoll, Infovista Planet, TEOCO Asset, Siradel); fiber design/management (IQGeo, VETRO, Comsof, 3-GIS, Merkator, Bentley OpenComms); GIS-платформа (Esri Telecom, GE Smallworld — legacy-стандарт, теперь GE Vernova/сторонние); deployment ops (Sitetracker — $207M привлечено, клиенты AT&T, BT, Zayo; Accruent Siterra); coverage intelligence (Ookla/Ziff Davis, Opensignal/Comlinkdata → Tutela); геоданные (LuxCarta, Maxar Precision3D).

**Лидеры рынка.** Fragmented, лидеры маленькие: IQGeo — куплена KKR в 2024 за ~£333M при выручке ~£47M (FY2023) — ~7x revenue, главный бенчмарк экзита ниши; Forsk — частная, [оценка] выручка €40–70M; Infovista — [оценка] $150–200M (вся компания, не только planning); Ookla — [оценка] $100–150M в составе Ziff Davis; Sitetracker — [оценка] $50–100M ARR (внешние трекеры дают $23M — заниженно); GE Smallworld — крупнейшая инсталлированная база в fiber/copper-инвентаризации, медленно умирающая.

**Вывод для инвестора.** Телеком-геософт — рынок «хороших маленьких компаний»: ниши по $50–300M выручки, экзиты в PE по 5–8x (IQGeo → KKR), но никто не построил $1B ARR, потому что операторов мало, они торгуются за каждый доллар и любят кастом. Асимметричная возможность — не операторы, а инфраструктурные владельцы и строители: tower cos, fiber-altnets, BEAD-экосистема + конвергенция с энергосетями (Sitetracker уже продаёт и телекому, и утилитам, и EV-charging) — «geospatial deployment OS для всей линейной инфраструктуры» масштабируется лучше, чем RF-планирование. Как соло-вертикаль для $1B-амбиции — слабый кандидат; как расширение с utilities — сильный.

---

### Сквозные выводы по кластеру

| Вертикаль | SAM геопростр. софта 2025, [оценка] | Рост | Платёжеспособность клиента | Регуляторный драйвер | Лидер пробил $100M ARR? |
|---|---|---|---|---|---|
| Сельское хозяйство | $0,7–1,2 млрд | 12–15% | Низкая (фермер) / средняя (enterprise) | EUDR, CAP, Scope 3 | Только в составе OEM/input-гигантов |
| Лесное хозяйство | $0,5–0,9 млрд | 10–20% | Низко-средняя | EUDR, GISTM-аналоги, carbon | Нет |
| Горнодобыча | $1,2–2 млрд | 8–20% | Высокая (мейджоры) | GISTM (хвосты), critical minerals | Да (Seequent, в составе Bentley) |
| Нефть и газ | $0,5–0,9 млрд | 15–25% (methane) | Высокая, но узкий круг | EU Methane Reg 2027, OGMP 2.0 | Да (SLB Delfi $1B ARR — но это geoscience, не EO) |
| Utilities | $1–2 млрд | 25–40% | Очень высокая (rate recovery) | Wildfire liability, NERC | Нет — гонка открыта |
| Телеком | $2–3 млрд | 10–15% | Средняя | BEAD, coverage-мандаты | Нет (IQGeo ~£47M на экзите) |

Три структурных вывода. Первый: во всём кластере самый привлекательный риск-профиль — utilities: единственная вертикаль, где сочетаются катастрофическая ответственность клиента, регуляторный механизм возврата затрат и отсутствие сложившегося лидера. Второй: устойчивые $100M+ ARR в кластере исторически возникали только вокруг workflow-софта, встроенного в принятие капитальных решений (Delfi, Seequent, mine planning), а не вокруг «продажи инсайтов из космоса» — data-as-a-service компании (GHGSat, Kayrros, Orbital Insight, Gro) системно упирались в $20–50M и уходили с рынка или в стратегов. Третий: везде, где алгоритм создаёт стоимость на порядки больше цены подписки (разведка месторождений, siting дата-центров), рациональна модель участия в активе (KoBold) — фонду и фаундеру стоит закладывать эту опциональность в структуру компании с первого дня.

---

### Источники по кластеру

- Novaspace (экс-Euroconsult), Earth Observation Data & Services Market, 18th ed., 2024–2025 — https://nova.space/press-release/commercial-earth-observation-market-surpasses-8-billion-by-2033/
- EUSPA, EO and GNSS Market Report, Issue 2, 2024 — https://www.euspa.europa.eu/eu-space-programme/eu-space-market-and-users/gnss-and-eo-market-report
- Planet Labs PBC, Form 10-K FY2026 и пресс-релиз Q4 FY2026, март 2026 — https://www.businesswire.com/news/home/20260319782110/en/
- Deere & Co., 4Q/FY2025 earnings release, ноябрь 2025 — https://www.deere.com/assets/pdfs/common/news/deere-4q25-earnings-release.pdf
- AGCO Corp., Form 10-K FY2025 (SEC) и материалы Precision Ag Strategy Update — https://www.sec.gov/Archives/edgar/data/880266/000088026626000010/agco-20251231.htm
- Bayer, «Bayer, John Deere further integrate FieldView and Operations Center», 2025 — https://www.bayer.com/en/us/news-stories/john-deere-and-fieldview
- AgFunderNews, «Ag insights platform Gro Intelligence is closing down», июнь 2024 — https://agfundernews.com/breaking-ag-insights-platform-gro-intelligence-is-closing-down
- Calcalist/Ctech, «Indigo Ag valuation down 94% to $200 million», 2023 — https://www.calcalistech.com/ctechnews/article/syswxgjph
- RealAgriculture, «Farmers Edge receives approval to go private», март 2024 — https://www.realagriculture.com/2024/03/farmers-edge-receives-approval-to-go-private/
- Sylvera, State of Carbon Credits 2025 — https://www.sylvera.com/state-of-carbon-credits
- Ecosystem Marketplace, State of the Voluntary Carbon Market 2025 — https://3298623.fs1.hubspotusercontent-na1.net/hubfs/3298623/SOVCM%202025/
- Remsoft, «Remsoft Secures Strategic Investment from Banneker Partners and Acquires Lim Geomatics», 2025 — https://remsoft.com/news/
- OroraTech, «Series B extended to €37M», май 2025 — https://ororatech.com/resources/news-blog/
- GlobeNewswire, «Pano AI Raises $44M Series B», июнь 2025 — https://www.globenewswire.com/news-release/2025/06/16/3099902/
- TechCrunch, «KoBold used AI to find copper — $537M round», январь 2025; PitchBook/Tracxn профили KoBold (Series C-III $280M, оценка $4,4 млрд, ноябрь 2025) — https://techcrunch.com/2025/01/02/kobold-537m/
- TRE ALTAMIRA (CLS Group), материалы InSAR for Mining / Tailings and Mine Waste 2024 — https://site.tre-altamira.com/
- EUR-Lex, Regulation (EU) 2024/1787 (EU Methane Regulation) — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ%3AL_202401787
- White & Case, «Are you ready for the new EU rules on methane emissions», 2024 — https://www.whitecase.com/insight-alert/
- IEA, Global Methane Tracker 2024 — https://www.iea.org/reports/global-methane-tracker-2024/
- GHGSat corporate/markets, 2025–2026; CB Insights/Tracxn профиль (выручка ~$20M 2023, $179M привлечено) — https://www.ghgsat.com/markets/
- Tracxn/PitchBook, профиль Kayrros (поглощение Energy Aspects, март 2026; $83,9M привлечено) — https://tracxn.com/d/companies/kayrros/
- TechCrunch/Via Satellite, финансирование Orbital Sidekick ($10M + $16M STRATFI), 2023 — https://techcrunch.com/2023/01/31/orbital-sidekick-raises-10m/
- Fortune Business Insights, Utility Vegetation Management Market ($24,2 млрд 2022 → $39,2 млрд 2029) — https://www.fortunebusinessinsights.com/utility-vegetation-management-market-107247
- AiDash, «Intelligent Vegetation Management System 2.0 / $24B utility expense», 2024–2025 — https://www.aidash.com/
- The AI Insider, «Overstory Secures $43M Series B», декабрь 2025 — https://theaiinsider.tech/2025/12/08/overstory-secures-43m/
- Payload/TFN, «LiveEO raises €28M+ for Twinspector constellation», 2025–2026 — https://payloadspace.com/liveeo-raises-e28m-to-fund-its-first-constellation/
- Paces, «Paces Raises $11 Million Series A», июль 2024 — https://www.paces.com/news/paces-raises-11-million-to-accelerate-clean-energy-development
- GE Vernova, GridOS product/press materials, 2024–2025 — https://www.gevernova.com/software/products/gridos
- Forsk, Atoll overview (9 800+ лицензий, 500+ клиентов) — https://www.forsk.com/atoll-overview
- Sitetracker, «$96M Series D», 2022; Tracxn/Clodura профили 2025 — https://www.sitetracker.com/
- SkyQuest / Technavio, GIS in Telecom Sector Market, 2025 (generic, с осторожностью) — https://www.technavio.com/report/gis-market-in-telecom-sector-industry-analysis
- Generic-отчёты по рынкам precision ag / crop monitoring / forestry software / mining software / methane detection / smart grid analytics: Grand View Research, GM Insights, market.us, MRFR, Dataintelo, IntelEvo, SkyQuest, FMI, 2025–2026 — использованы только как вилки с пометкой «generic, с осторожностью»
- Дополнительно использованы знания модели до января 2026 (помечены как [оценка]): выручки Esri, Seequent, Infovista, Ookla; сделка KKR–IQGeo (~£333M, 2024); банкротство PG&E и wildfire-обязательства; S&P Global exploration budgets; PwC Mine; IEA World Energy Investment.
