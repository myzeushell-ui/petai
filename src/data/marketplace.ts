export interface MarketplaceListing {
  id: string;
  type: "puppy" | "kitten" | "adult" | "service" | "product";
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  breed: string;
  species: "dog" | "cat";
  age?: string;
  gender?: "male" | "female";
  location: string;
  sellerName: string;
  sellerRating: number;
  sellerVerified: boolean;
  vaccinated?: boolean;
  microchipped?: boolean;
  pedigree?: boolean;
  healthChecked?: boolean;
  createdAt: string;
  emoji: string;
  tags: string[];
}

export const marketplaceListings: MarketplaceListing[] = [
  // — Puppies —
  {
    id: "ml-001", type: "puppy", title: "Щенки золотистого ретривера — помёт от чемпиона",
    description: "4 мальчика и 2 девочки. Отец — чемпион РКФ. Полный пакет документов, ветпаспорт, чип.",
    price: 80000, currency: "₽", images: [], breed: "Golden Retriever", species: "dog",
    age: "2 мес.", gender: "male", location: "Москва", sellerName: "Золотая Долина",
    sellerRating: 4.9, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-10T10:00:00Z", emoji: "🐕",
    tags: ["чемпион", "документы", "доставка"],
  },
  {
    id: "ml-002", type: "puppy", title: "Щенок лабрадора палевый",
    description: "Мальчик, родился 15 апреля. Игривый, здоровый, привит по возрасту.",
    price: 45000, currency: "₽", images: [], breed: "Labrador Retriever", species: "dog",
    age: "1.5 мес.", gender: "male", location: "Санкт-Петербург", sellerName: "Labrador House",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-08T14:00:00Z", emoji: "🦮",
    tags: ["палевый", "игривый", "документы"],
  },
  {
    id: "ml-003", type: "puppy", title: "Хаски — голубоглазые щенки",
    description: "Чёрно-белые, голубые глаза. 3 мальчика. Родители здоровы, тесты OFA.",
    price: 55000, currency: "₽", images: [], breed: "Siberian Husky", species: "dog",
    age: "2.5 мес.", gender: "male", location: "Новосибирск", sellerName: "Северный Ветер",
    sellerRating: 4.8, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-05T09:00:00Z", emoji: "🐺",
    tags: ["голубые глаза", "OFA", "сибирский"],
  },
  {
    id: "ml-004", type: "puppy", title: "Корги пемброк — рыже-белый мальчик",
    description: "Весёлый, социализированный. Привит, с чипом. Договор купли-продажи.",
    price: 70000, currency: "₽", images: [], breed: "Corgi", species: "dog",
    age: "3 мес.", gender: "male", location: "Москва", sellerName: "CorgiLand",
    sellerRating: 4.9, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-12T11:00:00Z", emoji: "🐕",
    tags: ["пемброк", "рыжий", "социализирован"],
  },
  {
    id: "ml-005", type: "puppy", title: "Немецкая овчарка — рабочая линия",
    description: "Щенки от рабочих родителей с дрессировкой. 2 девочки. Чёрно-подпалые.",
    price: 60000, currency: "₽", images: [], breed: "German Shepherd", species: "dog",
    age: "2 мес.", gender: "female", location: "Краснодар", sellerName: "K9 Elite",
    sellerRating: 4.6, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-03T08:00:00Z", emoji: "🐕‍🦺",
    tags: ["рабочая линия", "дрессировка", "элита"],
  },
  {
    id: "ml-006", type: "puppy", title: "Французский бульдог — кремовый малыш",
    description: "Девочка, кремовый окрас. Компактная, здоровая. Идеальна для квартиры.",
    price: 90000, currency: "₽", images: [], breed: "French Bulldog", species: "dog",
    age: "3.5 мес.", gender: "female", location: "Москва", sellerName: "FrenchieClub",
    sellerRating: 4.5, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-11T16:00:00Z", emoji: "🐶",
    tags: ["кремовый", "квартира", "компакт"],
  },
  {
    id: "ml-007", type: "puppy", title: "Шпиц миниатюрный — белоснежный",
    description: "Мальчик, белый окрас. Померанский тип. Вес взрослого ~2.5 кг.",
    price: 120000, currency: "₽", images: [], breed: "Pomeranian", species: "dog",
    age: "4 мес.", gender: "male", location: "Екатеринбург", sellerName: "White Cloud",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-07T13:00:00Z", emoji: "🐾",
    tags: ["померанский", "белый", "мини"],
  },
  {
    id: "ml-008", type: "puppy", title: "Такса стандартная — чёрно-подпалая",
    description: "Девочка, гладкошёрстная. Отличный характер, ласковая. Метрика РКФ.",
    price: 35000, currency: "₽", images: [], breed: "Dachshund", species: "dog",
    age: "2 мес.", gender: "female", location: "Казань", sellerName: "DachsHaus",
    sellerRating: 4.4, sellerVerified: false, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-09T10:00:00Z", emoji: "🌭",
    tags: ["гладкошёрстная", "стандартная", "метрика"],
  },
  {
    id: "ml-009", type: "puppy", title: "Бигль — трёхцветный мальчик",
    description: "Энергичный, весёлый. Привит, обработан от паразитов. Любит детей.",
    price: 40000, currency: "₽", images: [], breed: "Beagle", species: "dog",
    age: "2.5 мес.", gender: "male", location: "Нижний Новгород", sellerName: "BeaglePack",
    sellerRating: 4.6, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: false, healthChecked: true, createdAt: "2026-05-06T12:00:00Z", emoji: "🐕",
    tags: ["трёхцветный", "дети", "энергичный"],
  },
  {
    id: "ml-010", type: "puppy", title: "Мопс — абрикосовый мальчик",
    description: "Ласковый, спокойный. Идеален для семьи. Генетические тесты чистые.",
    price: 50000, currency: "₽", images: [], breed: "Pug", species: "dog",
    age: "3 мес.", gender: "male", location: "Самара", sellerName: "PugLife",
    sellerRating: 4.5, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-04T15:00:00Z", emoji: "🐶",
    tags: ["абрикосовый", "семья", "гентесты"],
  },
  // — Kittens —
  {
    id: "ml-011", type: "kitten", title: "Британские котята — голубой окрас",
    description: "Мальчик и девочка. Плюшевая шерсть, крепкие. С документами WCF.",
    price: 25000, currency: "₽", images: [], breed: "British Shorthair", species: "cat",
    age: "3 мес.", gender: "male", location: "Москва", sellerName: "BritPremium",
    sellerRating: 4.8, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-10T09:00:00Z", emoji: "🐱",
    tags: ["голубой", "WCF", "плюшевый"],
  },
  {
    id: "ml-012", type: "kitten", title: "Мейн-кун — полидакт мальчик",
    description: "Крупный, ласковый гигант. Родители тестированы на HCM и PKD.",
    price: 45000, currency: "₽", images: [], breed: "Maine Coon", species: "cat",
    age: "4 мес.", gender: "male", location: "Санкт-Петербург", sellerName: "MegaCoon",
    sellerRating: 4.9, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-08T11:00:00Z", emoji: "🦁",
    tags: ["полидакт", "HCM/PKD тест", "крупный"],
  },
  {
    id: "ml-013", type: "kitten", title: "Шотландская вислоухая — серебристая",
    description: "Девочка, фолд. Прижатые ушки, милейший характер. Приучена к лотку.",
    price: 30000, currency: "₽", images: [], breed: "Scottish Fold", species: "cat",
    age: "2.5 мес.", gender: "female", location: "Москва", sellerName: "ScotFold",
    sellerRating: 4.6, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-11T14:00:00Z", emoji: "🐱",
    tags: ["вислоухая", "серебристая", "лоток"],
  },
  {
    id: "ml-014", type: "kitten", title: "Бенгальский кот — мраморный",
    description: "Мальчик, яркий мраморный рисунок. Активный, игривый. TICA регистрация.",
    price: 60000, currency: "₽", images: [], breed: "Bengal", species: "cat",
    age: "3 мес.", gender: "male", location: "Краснодар", sellerName: "BengalWild",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-07T10:00:00Z", emoji: "🐆",
    tags: ["мраморный", "TICA", "активный"],
  },
  {
    id: "ml-015", type: "kitten", title: "Сфинкс канадский — голубоглазый",
    description: "Девочка, голубые глаза. Тёплая, бархатистая кожа. Гипоаллергенный вариант.",
    price: 35000, currency: "₽", images: [], breed: "Sphynx", species: "cat",
    age: "3.5 мес.", gender: "female", location: "Екатеринбург", sellerName: "NakedBeauty",
    sellerRating: 4.5, sellerVerified: false, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-09T08:00:00Z", emoji: "🐱",
    tags: ["голубоглазый", "гипоаллергенный", "бархат"],
  },
  // — Services —
  {
    id: "ml-016", type: "service", title: "Консультация ветеринара-кардиолога",
    description: "Онлайн-консультация, разбор ЭКГ и ЭхоКГ. Стаж 15 лет.",
    price: 3500, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Онлайн", sellerName: "Др. Иванова А.С.", sellerRating: 4.9,
    sellerVerified: true, createdAt: "2026-05-01T10:00:00Z", emoji: "🩺",
    tags: ["кардиолог", "онлайн", "ЭКГ"],
  },
  {
    id: "ml-017", type: "service", title: "Кинолог — коррекция поведения",
    description: "Выезд на дом. Агрессия, страхи, деструктивное поведение. Гуманные методы.",
    price: 5000, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Москва", sellerName: "Кинолог Петров Д.", sellerRating: 4.8,
    sellerVerified: true, createdAt: "2026-05-02T10:00:00Z", emoji: "🎓",
    tags: ["поведение", "выезд", "гуманный"],
  },
  {
    id: "ml-018", type: "service", title: "Зоопсихолог — онлайн консультация",
    description: "Разбор проблем поведения, рекомендации по социализации. Видеозвонок 60 мин.",
    price: 2500, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Онлайн", sellerName: "Зоопсихолог Мария Л.", sellerRating: 4.7,
    sellerVerified: true, createdAt: "2026-05-03T10:00:00Z", emoji: "🧠",
    tags: ["зоопсихолог", "онлайн", "социализация"],
  },
  {
    id: "ml-019", type: "service", title: "Ветеринар-дерматолог",
    description: "Аллергии, дерматиты, проблемы кожи и шерсти. Очная консультация.",
    price: 4000, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Санкт-Петербург", sellerName: "Клиника Зоодоктор", sellerRating: 4.6,
    sellerVerified: true, createdAt: "2026-05-04T10:00:00Z", emoji: "🔬",
    tags: ["дерматолог", "аллергия", "кожа"],
  },
  {
    id: "ml-020", type: "service", title: "Груминг с выездом — все породы",
    description: "Мобильный груминг-салон. Стрижка, мытьё, когти, уши. Профессиональная косметика.",
    price: 3000, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Москва", sellerName: "PetSpa Mobile", sellerRating: 4.8,
    sellerVerified: true, createdAt: "2026-05-05T10:00:00Z", emoji: "✂️",
    tags: ["груминг", "выезд", "все породы"],
  },
  // — Products —
  {
    id: "ml-021", type: "product", title: "Умный ошейник PetAI Smart Collar",
    description: "GPS-трекер, температура, активность, анализ голоса. Bluetooth + LTE.",
    price: 8900, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Доставка по РФ", sellerName: "PetAI Store", sellerRating: 5.0,
    sellerVerified: true, createdAt: "2026-05-01T10:00:00Z", emoji: "📡",
    tags: ["GPS", "температура", "голос AI", "ошейник"],
  },
  {
    id: "ml-022", type: "product", title: "Автокормушка с камерой",
    description: "Wi-Fi, управление через приложение, камера HD, запись голоса хозяина.",
    price: 7500, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Доставка по РФ", sellerName: "SmartPet Tech", sellerRating: 4.6,
    sellerVerified: true, createdAt: "2026-05-06T10:00:00Z", emoji: "🤖",
    tags: ["кормушка", "камера", "Wi-Fi"],
  },
  {
    id: "ml-023", type: "product", title: "Фонтанчик для воды — 2.5 л",
    description: "Бесшумный мотор, угольный фильтр, подходит для собак и кошек.",
    price: 2900, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Доставка по РФ", sellerName: "PetGadgets", sellerRating: 4.5,
    sellerVerified: true, createdAt: "2026-05-07T10:00:00Z", emoji: "💧",
    tags: ["вода", "фонтанчик", "фильтр"],
  },
  {
    id: "ml-024", type: "product", title: "Ортопедический лежак — крупные породы",
    description: "Memory foam, съёмный чехол, антискольжение. Размер XL (100×80 см).",
    price: 5400, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Доставка по РФ", sellerName: "ComfyPet", sellerRating: 4.7,
    sellerVerified: true, createdAt: "2026-05-08T10:00:00Z", emoji: "🛏️",
    tags: ["лежак", "ортопедический", "XL"],
  },
  {
    id: "ml-025", type: "product", title: "Набор для груминга Pro — 12 предметов",
    description: "Фурминатор, ножницы, когтерез, расчёска, пуходёрка. В кейсе.",
    price: 3200, currency: "₽", images: [], breed: "Все", species: "dog",
    location: "Доставка по РФ", sellerName: "GroomKit", sellerRating: 4.4,
    sellerVerified: false, createdAt: "2026-05-09T10:00:00Z", emoji: "💇",
    tags: ["груминг", "набор", "фурминатор"],
  },
  // — More puppies to reach 30 —
  {
    id: "ml-026", type: "puppy", title: "Акита-ину — рыжий мальчик",
    description: "Японская акита, прямой импорт линии. Документы FCI. Крепкий, уверенный.",
    price: 95000, currency: "₽", images: [], breed: "Akita", species: "dog",
    age: "3 мес.", gender: "male", location: "Москва", sellerName: "AkitaJP",
    sellerRating: 4.8, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-01T10:00:00Z", emoji: "🐕",
    tags: ["акита", "FCI", "импорт"],
  },
  {
    id: "ml-027", type: "puppy", title: "Йоркширский терьер — мини девочка",
    description: "Беби-фейс, шелковистая шерсть. Вес взрослой ~2 кг. Ласковая.",
    price: 65000, currency: "₽", images: [], breed: "Yorkshire Terrier", species: "dog",
    age: "4 мес.", gender: "female", location: "Москва", sellerName: "YorkieWorld",
    sellerRating: 4.6, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-02T10:00:00Z", emoji: "🐾",
    tags: ["мини", "беби-фейс", "шёлк"],
  },
  {
    id: "ml-028", type: "kitten", title: "Абиссинская кошка — дикий окрас",
    description: "Мальчик, окрас ruddy. Подвижный, любопытный. Чемпионные линии.",
    price: 40000, currency: "₽", images: [], breed: "Abyssinian", species: "cat",
    age: "3 мес.", gender: "male", location: "Москва", sellerName: "AbyCats",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-03T10:00:00Z", emoji: "🐱",
    tags: ["дикий окрас", "чемпион", "активный"],
  },
  {
    id: "ml-029", type: "puppy", title: "Самоед — белоснежная улыбка",
    description: "2 мальчика, пушистые, здоровые. Социализированы с детьми.",
    price: 75000, currency: "₽", images: [], breed: "Samoyed", species: "dog",
    age: "2.5 мес.", gender: "male", location: "Новосибирск", sellerName: "SamoyedSmile",
    sellerRating: 4.9, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-04T10:00:00Z", emoji: "☁️",
    tags: ["белый", "улыбка", "дети"],
  },
  {
    id: "ml-030", type: "puppy", title: "Шиба-ину — рыжий мальчик",
    description: "Типичная 'улыбка шиба'. Чистокровный, документы РКФ. Обучен базе.",
    price: 85000, currency: "₽", images: [], breed: "Shiba Inu", species: "dog",
    age: "3.5 мес.", gender: "male", location: "Москва", sellerName: "ShibaRu",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-05T10:00:00Z", emoji: "🦊",
    tags: ["шиба", "рыжий", "обучен"],
  },
];

export type MarketplaceFilter = "all" | "puppy" | "kitten" | "service" | "product";

export function filterListings(filter: MarketplaceFilter): MarketplaceListing[] {
  if (filter === "all") return marketplaceListings;
  return marketplaceListings.filter((l) => l.type === filter);
}
