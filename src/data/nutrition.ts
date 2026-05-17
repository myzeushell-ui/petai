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
      "Large-breed puppy food with controlled calcium",
      "Glucosamine supplement to support joints",
      "Gradual switch to adult food at 12-18 months",
      "Scheduled feeding, not free-feeding",
      "Omega-3 for brain development",
    ],
    avoid: ["Excess calcium", "Large weight-bearing bones", "Chocolate", "Grapes", "Onion"],
  },
  {
    id: "dog-adult-large-high",
    species: "dog", ageGroup: "adult", size: "large", activityLevel: "high",
    dailyCalories: "1600-2400 kcal",
    protein: "25-30%", fat: "12-18%", fiber: "3-5%",
    meals: 2,
    recommendations: [
      "Premium food with named meat as first ingredient",
      "Omega-3 and Omega-6 for skin and coat",
      "Glucosamine / chondroitin for joints",
      "Probiotics for digestion",
      "Portion control — obesity risk",
    ],
    avoid: ["Corn-first kibble", "Artificial colors", "BHA / BHT preservatives"],
  },
  {
    id: "dog-adult-medium-medium",
    species: "dog", ageGroup: "adult", size: "medium", activityLevel: "medium",
    dailyCalories: "800-1200 kcal",
    protein: "22-28%", fat: "10-15%", fiber: "3-5%",
    meals: 2,
    recommendations: [
      "Balanced food for medium breeds",
      "Daily dental chews",
      "Seasonal vitamins (vit. D in winter)",
      "Fresh water always available",
    ],
    avoid: ["Raw pork", "Avocado", "Salty foods"],
  },
  {
    id: "dog-senior-large-low",
    species: "dog", ageGroup: "senior", size: "large", activityLevel: "low",
    dailyCalories: "1200-1600 kcal",
    protein: "20-25%", fat: "8-12%", fiber: "5-8%",
    meals: 2,
    recommendations: [
      "Senior dog formula — lower calories",
      "Enhanced joint support (glucosamine + MSM)",
      "Antioxidants for cognitive function",
      "L-carnitine for heart support",
      "Easily digestible protein",
    ],
    avoid: ["High-calorie treats", "Fatty foods", "Large portions"],
  },
  {
    id: "cat-adult-medium-medium",
    species: "cat", ageGroup: "adult", size: "medium", activityLevel: "medium",
    dailyCalories: "200-300 kcal",
    protein: "30-40%", fat: "15-20%", fiber: "2-4%",
    meals: 2,
    recommendations: [
      "High-protein meat-based food",
      "Mix of dry and wet food",
      "Taurine — must be in the formula",
      "Encourage water intake (fountain works)",
      "Portion control to prevent obesity",
    ],
    avoid: ["Dog food", "Cow milk (lactose)", "Raw fish", "Onion", "Garlic"],
  },
  {
    id: "cat-kitten-small-high",
    species: "cat", ageGroup: "puppy", size: "small", activityLevel: "high",
    dailyCalories: "250-400 kcal",
    protein: "35-45%", fat: "18-25%", fiber: "2-3%",
    meals: 4,
    recommendations: [
      "Dedicated kitten formula up to 12 months",
      "High protein for muscle growth",
      "DHA for brain and vision development",
      "Small kibble or paté texture",
      "Gradual switch to adult food at 12 months",
    ],
    avoid: ["Adult food", "Raw meat", "Cow milk"],
  },
];

export const foodItems: FoodItem[] = [
  {
    id: "food-1", name: "Royal Canin Golden Retriever Adult",
    brand: "Royal Canin", type: "dry", species: "dog", rating: 4.6, price: "$58 / 26 lb",
    proteinPercent: 25, fatPercent: 14, fiberPercent: 3.5,
    topIngredients: ["Chicken", "Rice", "Corn", "Animal fats"],
    suitableFor: ["Golden Retriever", "Labrador", "Large breeds"],
    emoji: "🥩",
  },
  {
    id: "food-2", name: "Acana Heritage Free-Run Poultry",
    brand: "Acana", type: "dry", species: "dog", rating: 4.8, price: "$78 / 25 lb",
    proteinPercent: 31, fatPercent: 17, fiberPercent: 5,
    topIngredients: ["Free-run chicken", "Turkey", "Eggs", "Lentils"],
    suitableFor: ["All breeds", "Active dogs"],
    emoji: "🍗",
  },
  {
    id: "food-3", name: "Hill's Science Diet Adult",
    brand: "Hill's", type: "dry", species: "dog", rating: 4.5, price: "$52 / 26 lb",
    proteinPercent: 23, fatPercent: 15, fiberPercent: 3,
    topIngredients: ["Chicken", "Barley", "Rice", "Soybean meal"],
    suitableFor: ["Medium breeds", "Low-activity dogs"],
    emoji: "🥣",
  },
  {
    id: "food-4", name: "Orijen Original",
    brand: "Orijen", type: "dry", species: "dog", rating: 4.9, price: "$99 / 25 lb",
    proteinPercent: 38, fatPercent: 18, fiberPercent: 5,
    topIngredients: ["Fresh chicken", "Turkey", "Flounder", "Eggs", "Liver"],
    suitableFor: ["All breeds", "Active", "Working dogs"],
    emoji: "⭐",
  },
  {
    id: "food-5", name: "Royal Canin British Shorthair",
    brand: "Royal Canin", type: "dry", species: "cat", rating: 4.7, price: "$44 / 9 lb",
    proteinPercent: 34, fatPercent: 19, fiberPercent: 5.6,
    topIngredients: ["Poultry", "Rice", "Animal fats", "Corn"],
    suitableFor: ["British Shorthair", "Larger cats"],
    emoji: "🐟",
  },
  {
    id: "food-6", name: "Farmina N&D Prime Chicken & Pomegranate",
    brand: "Farmina", type: "dry", species: "cat", rating: 4.8, price: "$62 / 11 lb",
    proteinPercent: 44, fatPercent: 20, fiberPercent: 1.8,
    topIngredients: ["Fresh chicken", "Dehydrated chicken", "Peas", "Pomegranate"],
    suitableFor: ["All cat breeds", "Active cats"],
    emoji: "🥘",
  },
  {
    id: "food-7", name: "Grandorf Lamb & Rice Adult",
    brand: "Grandorf", type: "dry", species: "dog", rating: 4.6, price: "$67 / 26 lb",
    proteinPercent: 27, fatPercent: 15, fiberPercent: 3,
    topIngredients: ["Dehydrated lamb", "Rice", "Turkey fat", "Brewer's yeast"],
    suitableFor: ["Sensitive digestion", "Medium and large breeds"],
    emoji: "🐑",
  },
  {
    id: "food-8", name: "Brit Care Salmon & Potato",
    brand: "Brit", type: "dry", species: "dog", rating: 4.4, price: "$47 / 26 lb",
    proteinPercent: 25, fatPercent: 15, fiberPercent: 3,
    topIngredients: ["Salmon", "Potato", "Chicken fat", "Apples"],
    suitableFor: ["Allergy-prone dogs", "Sensitive skin"],
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
    .filter((f) => !breed || f.suitableFor.some((s) => s.toLowerCase().includes(breed.toLowerCase()) || s === "All breeds" || s === "All cat breeds"))
    .sort((a, b) => b.rating - a.rating);
}
