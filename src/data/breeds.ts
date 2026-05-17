export interface Breed {
  id: string;
  name: string;
  nameRu: string;
  species: "dog" | "cat";
  group: string;
  size: "small" | "medium" | "large" | "giant";
  weight: string;
  lifespan: string;
  activity: "low" | "medium" | "high" | "very_high";
  grooming: "low" | "medium" | "high";
  trainability: "easy" | "moderate" | "hard";
  goodWithKids: boolean;
  goodWithPets: boolean;
  apartment: boolean;
  shedding: "low" | "medium" | "high";
  healthIssues: string[];
  traits: string[];
  origin: string;
  emoji: string;
}

export const dogBreeds: Breed[] = [
  {
    id: "golden-retriever", name: "Golden Retriever", nameRu: "Золотистый ретривер",
    species: "dog", group: "Sporting", size: "large", weight: "25-34 kg", lifespan: "10-12 лет",
    activity: "high", grooming: "high", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Дисплазия тазобедренного сустава", "Рак", "Болезни сердца"],
    traits: ["Дружелюбный", "Умный", "Преданный", "Терпеливый"],
    origin: "Великобритания", emoji: "🐕"
  },
  {
    id: "labrador", name: "Labrador Retriever", nameRu: "Лабрадор-ретривер",
    species: "dog", group: "Sporting", size: "large", weight: "25-36 kg", lifespan: "10-12 лет",
    activity: "high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Дисплазия", "Ожирение", "Болезни глаз"],
    traits: ["Дружелюбный", "Активный", "Послушный", "Обожает воду"],
    origin: "Канада", emoji: "🦮"
  },
  {
    id: "german-shepherd", name: "German Shepherd", nameRu: "Немецкая овчарка",
    species: "dog", group: "Herding", size: "large", weight: "22-40 kg", lifespan: "9-13 лет",
    activity: "very_high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "high",
    healthIssues: ["Дисплазия", "Дегенеративная миелопатия", "Вздутие"],
    traits: ["Умный", "Верный", "Бесстрашный", "Рабочий"],
    origin: "Германия", emoji: "🐕‍🦺"
  },
  {
    id: "french-bulldog", name: "French Bulldog", nameRu: "Французский бульдог",
    species: "dog", group: "Non-Sporting", size: "small", weight: "8-14 kg", lifespan: "10-12 лет",
    activity: "low", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Брахицефалия", "Проблемы с позвоночником", "Аллергии"],
    traits: ["Игривый", "Адаптивный", "Компаньон", "Упрямый"],
    origin: "Франция", emoji: "🐶"
  },
  {
    id: "poodle", name: "Poodle", nameRu: "Пудель",
    species: "dog", group: "Non-Sporting", size: "medium", weight: "20-32 kg", lifespan: "12-15 лет",
    activity: "high", grooming: "high", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Болезнь Аддисона", "Вздутие", "Дисплазия"],
    traits: ["Очень умный", "Элегантный", "Гипоаллергенный", "Обучаемый"],
    origin: "Германия/Франция", emoji: "🐩"
  },
  {
    id: "husky", name: "Siberian Husky", nameRu: "Сибирский хаски",
    species: "dog", group: "Working", size: "medium", weight: "16-27 kg", lifespan: "12-14 лет",
    activity: "very_high", grooming: "high", trainability: "hard",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "high",
    healthIssues: ["Болезни глаз", "Дисплазия", "Гипотиреоз"],
    traits: ["Независимый", "Дружелюбный", "Энергичный", "Воет вместо лая"],
    origin: "Россия", emoji: "🐺"
  },
  {
    id: "corgi", name: "Pembroke Welsh Corgi", nameRu: "Вельш-корги пемброк",
    species: "dog", group: "Herding", size: "small", weight: "10-14 kg", lifespan: "12-15 лет",
    activity: "high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Дисплазия", "Болезни глаз", "Проблемы с позвоночником"],
    traits: ["Весёлый", "Умный", "Пастуший инстинкт", "Любит внимание"],
    origin: "Уэльс", emoji: "🐕"
  },
  {
    id: "doberman", name: "Doberman Pinscher", nameRu: "Доберман",
    species: "dog", group: "Working", size: "large", weight: "27-45 kg", lifespan: "10-12 лет",
    activity: "very_high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "low",
    healthIssues: ["Кардиомиопатия", "Болезнь фон Виллебранда", "Вздутие"],
    traits: ["Верный", "Бесстрашный", "Умный", "Элегантный"],
    origin: "Германия", emoji: "🐕"
  },
  {
    id: "beagle", name: "Beagle", nameRu: "Бигль",
    species: "dog", group: "Hound", size: "small", weight: "9-11 kg", lifespan: "12-15 лет",
    activity: "high", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Эпилепсия", "Гипотиреоз", "Болезни глаз"],
    traits: ["Любопытный", "Весёлый", "Упрямый", "Отличный нюх"],
    origin: "Великобритания", emoji: "🐕"
  },
  {
    id: "yorkshire-terrier", name: "Yorkshire Terrier", nameRu: "Йоркширский терьер",
    species: "dog", group: "Toy", size: "small", weight: "2-3 kg", lifespan: "13-16 лет",
    activity: "medium", grooming: "high", trainability: "moderate",
    goodWithKids: false, goodWithPets: false, apartment: true, shedding: "low",
    healthIssues: ["Болезни зубов", "Гипогликемия", "Коллапс трахеи"],
    traits: ["Смелый", "Энергичный", "Ласковый", "Маленький защитник"],
    origin: "Великобритания", emoji: "🐕"
  },
  {
    id: "dachshund", name: "Dachshund", nameRu: "Такса",
    species: "dog", group: "Hound", size: "small", weight: "7-15 kg", lifespan: "12-16 лет",
    activity: "medium", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: false, apartment: true, shedding: "medium",
    healthIssues: ["Болезни позвоночника", "Ожирение", "Эпилепсия"],
    traits: ["Храбрый", "Упрямый", "Охотничий инстинкт", "Привязчивый"],
    origin: "Германия", emoji: "🐕"
  },
  {
    id: "shiba-inu", name: "Shiba Inu", nameRu: "Сиба-ину",
    species: "dog", group: "Non-Sporting", size: "small", weight: "8-11 kg", lifespan: "12-15 лет",
    activity: "medium", grooming: "medium", trainability: "hard",
    goodWithKids: false, goodWithPets: false, apartment: true, shedding: "high",
    healthIssues: ["Аллергии", "Дисплазия", "Болезни глаз"],
    traits: ["Независимый", "Чистоплотный", "Упрямый", "Лисья внешность"],
    origin: "Япония", emoji: "🐕"
  },
  {
    id: "boxer", name: "Boxer", nameRu: "Боксёр",
    species: "dog", group: "Working", size: "large", weight: "25-32 kg", lifespan: "10-12 лет",
    activity: "high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: false, shedding: "medium",
    healthIssues: ["Рак", "Кардиомиопатия", "Дисплазия"],
    traits: ["Игривый", "Энергичный", "Верный", "Защитник"],
    origin: "Германия", emoji: "🐕"
  },
  {
    id: "akita", name: "Akita", nameRu: "Акита-ину",
    species: "dog", group: "Working", size: "large", weight: "32-45 kg", lifespan: "10-13 лет",
    activity: "medium", grooming: "high", trainability: "hard",
    goodWithKids: false, goodWithPets: false, apartment: false, shedding: "high",
    healthIssues: ["Дисплазия", "Аутоиммунные болезни", "Вздутие"],
    traits: ["Верный", "Независимый", "Тихий", "Достоинство"],
    origin: "Япония", emoji: "🐕"
  },
  {
    id: "samoyed", name: "Samoyed", nameRu: "Самоед",
    species: "dog", group: "Working", size: "medium", weight: "16-30 kg", lifespan: "12-14 лет",
    activity: "high", grooming: "high", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: false, shedding: "high",
    healthIssues: ["Дисплазия", "Глаукома", "Диабет"],
    traits: ["Улыбчивый", "Дружелюбный", "Пушистый", "Не пахнет"],
    origin: "Россия", emoji: "🐕"
  },
  {
    id: "border-collie", name: "Border Collie", nameRu: "Бордер-колли",
    species: "dog", group: "Herding", size: "medium", weight: "14-20 kg", lifespan: "12-15 лет",
    activity: "very_high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: false, shedding: "medium",
    healthIssues: ["Эпилепсия", "Дисплазия", "Аномалия глаз колли"],
    traits: ["Самый умный", "Трудоголик", "Быстрый", "Нужна работа"],
    origin: "Великобритания", emoji: "🐕‍🦺"
  },
  {
    id: "rottweiler", name: "Rottweiler", nameRu: "Ротвейлер",
    species: "dog", group: "Working", size: "large", weight: "35-60 kg", lifespan: "8-10 лет",
    activity: "medium", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "medium",
    healthIssues: ["Дисплазия", "Рак", "Болезни сердца"],
    traits: ["Уверенный", "Спокойный", "Верный", "Защитник"],
    origin: "Германия", emoji: "🐕"
  },
  {
    id: "cavalier", name: "Cavalier King Charles Spaniel", nameRu: "Кавалер-кинг-чарльз-спаниель",
    species: "dog", group: "Toy", size: "small", weight: "5-8 kg", lifespan: "9-14 лет",
    activity: "medium", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Болезни сердца", "Сирингомиелия", "Болезни глаз"],
    traits: ["Ласковый", "Тихий", "Компаньон", "Адаптивный"],
    origin: "Великобритания", emoji: "🐕"
  },
  {
    id: "australian-shepherd", name: "Australian Shepherd", nameRu: "Австралийская овчарка",
    species: "dog", group: "Herding", size: "medium", weight: "18-29 kg", lifespan: "12-15 лет",
    activity: "very_high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: false, shedding: "high",
    healthIssues: ["Эпилепсия", "Дисплазия", "Проблемы со зрением"],
    traits: ["Умный", "Энергичный", "Пастуший", "Красивый окрас"],
    origin: "США", emoji: "🐕"
  },
  {
    id: "chihuahua", name: "Chihuahua", nameRu: "Чихуахуа",
    species: "dog", group: "Toy", size: "small", weight: "1.5-3 kg", lifespan: "14-16 лет",
    activity: "low", grooming: "low", trainability: "moderate",
    goodWithKids: false, goodWithPets: false, apartment: true, shedding: "low",
    healthIssues: ["Болезни зубов", "Гидроцефалия", "Проблемы с сердцем"],
    traits: ["Дерзкий", "Преданный одному", "Компактный", "Долгожитель"],
    origin: "Мексика", emoji: "🐕"
  },
];

export const catBreeds: Breed[] = [
  {
    id: "british-shorthair", name: "British Shorthair", nameRu: "Британская короткошёрстная",
    species: "cat", group: "Shorthair", size: "medium", weight: "4-8 kg", lifespan: "12-20 лет",
    activity: "low", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Кардиомиопатия", "Поликистоз почек", "Ожирение"],
    traits: ["Спокойный", "Независимый", "Плюшевый", "Не любит ручки"],
    origin: "Великобритания", emoji: "🐱"
  },
  {
    id: "maine-coon", name: "Maine Coon", nameRu: "Мейн-кун",
    species: "cat", group: "Longhair", size: "giant", weight: "5-12 kg", lifespan: "12-15 лет",
    activity: "medium", grooming: "high", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Кардиомиопатия", "Дисплазия тазобедренного", "Поликистоз"],
    traits: ["Дружелюбный гигант", "Собако-кот", "Разговорчивый", "Любит воду"],
    origin: "США", emoji: "🐱"
  },
  {
    id: "scottish-fold", name: "Scottish Fold", nameRu: "Шотландская вислоухая",
    species: "cat", group: "Shorthair", size: "medium", weight: "3-6 kg", lifespan: "11-14 лет",
    activity: "low", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Остеохондродисплазия", "Кардиомиопатия", "Артрит"],
    traits: ["Тихий", "Ласковый", "Сложенные уши", "Сидит как человек"],
    origin: "Шотландия", emoji: "🐱"
  },
  {
    id: "siamese", name: "Siamese", nameRu: "Сиамская",
    species: "cat", group: "Shorthair", size: "medium", weight: "3-5 kg", lifespan: "12-20 лет",
    activity: "high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Астма", "Болезни сердца", "Косоглазие"],
    traits: ["Очень разговорчивый", "Привязчивый", "Умный", "Требует внимания"],
    origin: "Таиланд", emoji: "🐱"
  },
  {
    id: "persian", name: "Persian", nameRu: "Персидская",
    species: "cat", group: "Longhair", size: "medium", weight: "3-7 kg", lifespan: "12-17 лет",
    activity: "low", grooming: "high", trainability: "hard",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Поликистоз почек", "Проблемы с дыханием", "Болезни глаз"],
    traits: ["Спокойный", "Ленивый", "Пушистый", "Мебель с глазами"],
    origin: "Иран", emoji: "🐱"
  },
  {
    id: "bengal", name: "Bengal", nameRu: "Бенгальская",
    species: "cat", group: "Shorthair", size: "medium", weight: "4-7 kg", lifespan: "12-16 лет",
    activity: "very_high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "low",
    healthIssues: ["Кардиомиопатия", "PRA", "Вывих коленной чашечки"],
    traits: ["Дикий вид", "Гиперактивный", "Умный", "Любит воду"],
    origin: "США", emoji: "🐱"
  },
  {
    id: "ragdoll", name: "Ragdoll", nameRu: "Рэгдолл",
    species: "cat", group: "Longhair", size: "large", weight: "4-9 kg", lifespan: "12-17 лет",
    activity: "low", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Кардиомиопатия", "Мочекаменная болезнь", "Ожирение"],
    traits: ["Тряпичная кукла", "Ласковый", "Следует за хозяином", "Расслабленный"],
    origin: "США", emoji: "🐱"
  },
  {
    id: "sphynx", name: "Sphynx", nameRu: "Сфинкс",
    species: "cat", group: "Hairless", size: "medium", weight: "3-6 kg", lifespan: "8-14 лет",
    activity: "high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Кардиомиопатия", "Кожные инфекции", "Чувствительность к холоду"],
    traits: ["Нет шерсти", "Горячий", "Ласковый до навязчивости", "Клоун"],
    origin: "Канада", emoji: "🐱"
  },
  {
    id: "abyssinian", name: "Abyssinian", nameRu: "Абиссинская",
    species: "cat", group: "Shorthair", size: "medium", weight: "3-5 kg", lifespan: "12-15 лет",
    activity: "very_high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Почечный амилоидоз", "Болезни зубов", "Вывих коленной чашечки"],
    traits: ["Любопытный", "Игривый", "Акробат", "Не сидит на месте"],
    origin: "Эфиопия", emoji: "🐱"
  },
  {
    id: "russian-blue", name: "Russian Blue", nameRu: "Русская голубая",
    species: "cat", group: "Shorthair", size: "medium", weight: "3-5 kg", lifespan: "15-20 лет",
    activity: "medium", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Мочекаменная болезнь", "Ожирение"],
    traits: ["Тихий", "Элегантный", "Привязчивый к одному", "Долгожитель"],
    origin: "Россия", emoji: "🐱"
  },
  {
    id: "norwegian-forest", name: "Norwegian Forest Cat", nameRu: "Норвежская лесная",
    species: "cat", group: "Longhair", size: "large", weight: "4-9 kg", lifespan: "14-16 лет",
    activity: "medium", grooming: "high", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Кардиомиопатия", "Дисплазия", "Гликогеноз IV типа"],
    traits: ["Ласковый", "Независимый", "Любит высоту", "Водостойкая шерсть"],
    origin: "Норвегия", emoji: "🐱"
  },
  {
    id: "sphinx-don", name: "Don Sphynx", nameRu: "Донской сфинкс",
    species: "cat", group: "Hairless", size: "medium", weight: "3-5 kg", lifespan: "12-15 лет",
    activity: "medium", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Кожные проблемы", "Болезни зубов", "Чувствительность к холоду"],
    traits: ["Ласковый", "Инопланетный вид", "Любит тепло", "Общительный"],
    origin: "Россия", emoji: "🐱"
  },
];

export const allBreeds = [...dogBreeds, ...catBreeds];
