export interface NutritionPlan {
  id: string;
  species: "dog" | "cat";
  ageGroup: "puppy" | "adult" | "senior";
  size: "small" | "medium" | "large" | "giant";
  activityLevel: "low" | "medium" | "high";
  dailyCalories: string;
  protein: string;
  fat: string;
  fiber: string;
  meals: number;
  recommendations: string[];
  avoid: string[];
}

export interface FoodItem {
  id: string;
  name: string;
  nameRu: string;
  brand: string;
  type: "dry" | "wet" | "raw" | "supplement";
  species: "dog" | "cat" | "both";
  rating: number;
  price: string;
  proteinPercent: number;
  fatPercent: number;
  fiberPercent: number;
  topIngredients: string[];
  suitableFor: string[];
  emoji: string;
}

export const nutritionPlans: NutritionPlan[] = [
  {
    id: "dog-puppy-large-high",
    species: "dog", ageGroup: "puppy", size: "large", activityLevel: "high",
    dailyCalories: "1200-1800 kcal",
    protein: "28-32%", fat: "15-20%", fiber: "3-5%",
    meals: 3,
    recommendations: [
      "Корм для щенков крупных пород с контролем кальция",
      "Добавки глюкозамина для поддержки суставов",
      "Постепенный переход на взрослый корм в 12-18 мес.",
      "Кормление по часам, не свободный доступ",
      "Омега-3 для развития мозга",
    ],
    avoid: ["Избыток кальция", "Кости крупные трубчатые", "Шоколад", "Виноград", "Лук"],
  },
  {
    id: "dog-adult-large-high",
    species: "dog", ageGroup: "adult", size: "large", activityLevel: "high",
    dailyCalories: "1600-2400 kcal",
    protein: "25-30%", fat: "12-18%", fiber: "3-5%",
    meals: 2,
    recommendations: [
      "Корм премиум-класса с мясом в первом ингредиенте",
      "Омега-3 и Омега-6 для шерсти и кожи",
      "Глюкозамин/хондроитин для суставов",
      "Пробиотики для пищеварения",
      "Контроль порций — риск ожирения",
    ],
    avoid: ["Кукуруза как основа", "Искусственные красители", "BHA/BHT консерванты"],
  },
  {
    id: "dog-adult-medium-medium",
    species: "dog", ageGroup: "adult", size: "medium", activityLevel: "medium",
    dailyCalories: "800-1200 kcal",
    protein: "22-28%", fat: "10-15%", fiber: "3-5%",
    meals: 2,
    recommendations: [
      "Сбалансированный корм для средних пород",
      "Ежедневные дентальные лакомства",
      "Сезонные витамины (D зимой)",
      "Свежая вода всегда в доступе",
    ],
    avoid: ["Сырая свинина", "Авокадо", "Солёные продукты"],
  },
  {
    id: "dog-senior-large-low",
    species: "dog", ageGroup: "senior", size: "large", activityLevel: "low",
    dailyCalories: "1200-1600 kcal",
    protein: "20-25%", fat: "8-12%", fiber: "5-8%",
    meals: 2,
    recommendations: [
      "Корм для пожилых собак — меньше калорий",
      "Усиленная поддержка суставов (глюкозамин + MSM)",
      "Антиоксиданты для когнитивной функции",
      "L-карнитин для поддержки сердца",
      "Легкоусвояемый белок",
    ],
    avoid: ["Высококалорийные лакомства", "Жирная пища", "Большие порции"],
  },
  {
    id: "cat-adult-medium-medium",
    species: "cat", ageGroup: "adult", size: "medium", activityLevel: "medium",
    dailyCalories: "200-300 kcal",
    protein: "30-40%", fat: "15-20%", fiber: "2-4%",
    meals: 2,
    recommendations: [
      "Высокобелковый корм на основе мяса",
      "Комбинация сухого и влажного корма",
      "Таурин — обязательно в составе",
      "Достаточное потребление воды (фонтанчик)",
      "Контроль порций для профилактики ожирения",
    ],
    avoid: ["Корм для собак", "Молоко (лактоза)", "Сырая рыба", "Лук", "Чеснок"],
  },
  {
    id: "cat-kitten-small-high",
    species: "cat", ageGroup: "puppy", size: "small", activityLevel: "high",
    dailyCalories: "250-400 kcal",
    protein: "35-45%", fat: "18-25%", fiber: "2-3%",
    meals: 4,
    recommendations: [
      "Специальный корм для котят до 12 месяцев",
      "Высокий белок для роста мышц",
      "DHA для развития мозга и зрения",
      "Мелкие крокеты или паштет",
      "Постепенный переход на взрослый корм к 12 мес.",
    ],
    avoid: ["Взрослый корм", "Сырое мясо", "Коровье молоко"],
  },
];

export const foodItems: FoodItem[] = [
  {
    id: "food-1", name: "Royal Canin Golden Retriever Adult", nameRu: "Роял Канин Голден Ретривер",
    brand: "Royal Canin", type: "dry", species: "dog", rating: 4.6, price: "4 200 ₽ / 12 кг",
    proteinPercent: 25, fatPercent: 14, fiberPercent: 3.5,
    topIngredients: ["Курица", "Рис", "Кукуруза", "Животные жиры"],
    suitableFor: ["Golden Retriever", "Лабрадор", "Крупные породы"],
    emoji: "🥩",
  },
  {
    id: "food-2", name: "Acana Heritage Free-Run Poultry", nameRu: "Акана Свободная Птица",
    brand: "Acana", type: "dry", species: "dog", rating: 4.8, price: "5 600 ₽ / 11.4 кг",
    proteinPercent: 31, fatPercent: 17, fiberPercent: 5,
    topIngredients: ["Курица свободного выгула", "Индейка", "Яйца", "Чечевица"],
    suitableFor: ["Все породы", "Активные собаки"],
    emoji: "🍗",
  },
  {
    id: "food-3", name: "Hill's Science Diet Adult", nameRu: "Хиллс Сайнс Дайет",
    brand: "Hill's", type: "dry", species: "dog", rating: 4.5, price: "3 800 ₽ / 12 кг",
    proteinPercent: 23, fatPercent: 15, fiberPercent: 3,
    topIngredients: ["Курица", "Ячмень", "Рис", "Соевая мука"],
    suitableFor: ["Средние породы", "Малоактивные собаки"],
    emoji: "🥣",
  },
  {
    id: "food-4", name: "Orijen Original", nameRu: "Ориджен Оригинал",
    brand: "Orijen", type: "dry", species: "dog", rating: 4.9, price: "7 200 ₽ / 11.4 кг",
    proteinPercent: 38, fatPercent: 18, fiberPercent: 5,
    topIngredients: ["Свежая курица", "Индейка", "Камбала", "Яйца", "Печень"],
    suitableFor: ["Все породы", "Активные", "Рабочие собаки"],
    emoji: "⭐",
  },
  {
    id: "food-5", name: "Royal Canin British Shorthair", nameRu: "Роял Канин Британская",
    brand: "Royal Canin", type: "dry", species: "cat", rating: 4.7, price: "3 200 ₽ / 4 кг",
    proteinPercent: 34, fatPercent: 19, fiberPercent: 5.6,
    topIngredients: ["Птица", "Рис", "Животные жиры", "Кукуруза"],
    suitableFor: ["British Shorthair", "Крупные коты"],
    emoji: "🐟",
  },
  {
    id: "food-6", name: "Farmina N&D Prime Chicken & Pomegranate", nameRu: "Фармина N&D Курица и Гранат",
    brand: "Farmina", type: "dry", species: "cat", rating: 4.8, price: "4 500 ₽ / 5 кг",
    proteinPercent: 44, fatPercent: 20, fiberPercent: 1.8,
    topIngredients: ["Свежая курица", "Дегидр. курица", "Горох", "Гранат"],
    suitableFor: ["Все породы кошек", "Активные коты"],
    emoji: "🥘",
  },
  {
    id: "food-7", name: "Grandorf Lamb & Rice Adult", nameRu: "Грандорф Ягнёнок и Рис",
    brand: "Grandorf", type: "dry", species: "dog", rating: 4.6, price: "4 900 ₽ / 12 кг",
    proteinPercent: 27, fatPercent: 15, fiberPercent: 3,
    topIngredients: ["Дегидр. ягнёнок", "Рис", "Жир индейки", "Пивные дрожжи"],
    suitableFor: ["Чувствительное пищеварение", "Средние и крупные породы"],
    emoji: "🐑",
  },
  {
    id: "food-8", name: "Brit Care Salmon & Potato", nameRu: "Брит Кейр Лосось и Картофель",
    brand: "Brit", type: "dry", species: "dog", rating: 4.4, price: "3 400 ₽ / 12 кг",
    proteinPercent: 25, fatPercent: 15, fiberPercent: 3,
    topIngredients: ["Лосось", "Картофель", "Куриный жир", "Яблоки"],
    suitableFor: ["Аллергики", "Чувствительная кожа"],
    emoji: "🐟",
  },
];

export function getNutritionPlan(
  species: "dog" | "cat",
  age: number,
  size: "small" | "medium" | "large" | "giant",
  activity: "low" | "medium" | "high"
): NutritionPlan | undefined {
  const ageGroup = species === "dog"
    ? (age < 1 ? "puppy" : age >= 8 ? "senior" : "adult")
    : (age < 1 ? "puppy" : age >= 10 ? "senior" : "adult");

  return nutritionPlans.find(
    (p) => p.species === species && p.ageGroup === ageGroup && p.size === size && p.activityLevel === activity
  ) ?? nutritionPlans.find(
    (p) => p.species === species && p.ageGroup === ageGroup
  );
}

export function getFoodRecommendations(species: "dog" | "cat", breed?: string): FoodItem[] {
  return foodItems
    .filter((f) => f.species === species || f.species === "both")
    .filter((f) => !breed || f.suitableFor.some((s) => s.toLowerCase().includes(breed.toLowerCase()) || s === "Все породы" || s === "Все породы кошек"))
    .sort((a, b) => b.rating - a.rating);
}
