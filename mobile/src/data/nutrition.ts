export interface NutritionPlan {
  petId: string;
  dailyCalories: number;
  protein: number;
  fat: number;
  fiber: number;
  meals: number;
  recommendations: string[];
  avoid: string[];
}

export interface FoodItem {
  id: string;
  name: string;
  brand: string;
  type: "dry" | "wet" | "raw" | "supplement";
  species: "dog" | "cat";
  rating: number;
  price: number;
  proteinPercent: number;
  fatPercent: number;
  fiberPercent: number;
  topIngredients: string[];
  emoji: string;
}

const plans: NutritionPlan[] = [
  {
    petId: "luna",
    dailyCalories: 1450,
    protein: 28,
    fat: 14,
    fiber: 4,
    meals: 2,
    recommendations: [
      "Feed 2 cups of premium kibble split into 2 meals (morning + evening)",
      "Add 1 tbsp salmon oil daily for coat and joint health",
      "Limit treats to <10% of daily calories (~145 kcal max)",
      "Include omega-3 rich foods (salmon, sardines) 2-3x per week",
      "Always provide fresh water",
    ],
    avoid: ["Chocolate", "Grapes/Raisins", "Onions/Garlic", "Xylitol", "Macadamia nuts", "Excessive table scraps"],
  },
  {
    petId: "mochi",
    dailyCalories: 250,
    protein: 35,
    fat: 18,
    fiber: 3,
    meals: 3,
    recommendations: [
      "High-protein wet food, 3 small meals per day",
      "Hairball prevention paste 2x per week",
      "Encourage water intake — fountain or wet food helps",
      "Limit dry kibble to maintain urinary tract health",
      "Keep treats minimal (<5% of calories)",
    ],
    avoid: ["Dog food", "Onions/Garlic", "Raw fish (long-term)", "Milk (most cats are lactose intolerant)", "Chocolate", "Caffeine"],
  },
];

const foodItems: FoodItem[] = [
  {
    id: "f1", name: "Adult Large Breed", brand: "Hill's Science Diet", type: "dry", species: "dog",
    rating: 4.7, price: 65, proteinPercent: 26, fatPercent: 13, fiberPercent: 4,
    topIngredients: ["Chicken", "Brown Rice", "Whole Grain Wheat", "Cracked Pearled Barley"],
    emoji: "🥣",
  },
  {
    id: "f2", name: "Pro Plan Sport All Life Stages", brand: "Purina", type: "dry", species: "dog",
    rating: 4.6, price: 58, proteinPercent: 30, fatPercent: 20, fiberPercent: 3,
    topIngredients: ["Chicken", "Brewers Rice", "Corn Gluten Meal", "Whole Grain Wheat"],
    emoji: "🥣",
  },
  {
    id: "f3", name: "Salmon & Sweet Potato", brand: "Wellness Core", type: "dry", species: "dog",
    rating: 4.8, price: 78, proteinPercent: 34, fatPercent: 16, fiberPercent: 4,
    topIngredients: ["Deboned Salmon", "Whitefish Meal", "Sweet Potatoes", "Peas"],
    emoji: "🥩",
  },
  {
    id: "f4", name: "Indoor Cat Adult", brand: "Royal Canin", type: "dry", species: "cat",
    rating: 4.5, price: 42, proteinPercent: 28, fatPercent: 12, fiberPercent: 6,
    topIngredients: ["Chicken By-Product Meal", "Brown Rice", "Wheat Gluten", "Corn"],
    emoji: "🥣",
  },
  {
    id: "f5", name: "True Acre Pâté Chicken", brand: "Wellness", type: "wet", species: "cat",
    rating: 4.7, price: 28, proteinPercent: 11, fatPercent: 7, fiberPercent: 1,
    topIngredients: ["Chicken", "Chicken Broth", "Chicken Liver", "Turkey"],
    emoji: "🍖",
  },
  {
    id: "f6", name: "Salmon Oil for Pets", brand: "Zesty Paws", type: "supplement", species: "dog",
    rating: 4.6, price: 22, proteinPercent: 0, fatPercent: 99, fiberPercent: 0,
    topIngredients: ["Wild Alaskan Salmon Oil", "Omega-3 EPA & DHA", "Vitamin E"],
    emoji: "💧",
  },
];

export function getNutritionPlan(petId: string): NutritionPlan {
  return plans.find((p) => p.petId === petId) ?? plans[0];
}

export function getFoodRecommendations(species: "dog" | "cat"): FoodItem[] {
  return foodItems.filter((f) => f.species === species);
}
