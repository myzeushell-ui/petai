export interface Breed {
  id: string;
  name: string;
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
    id: "golden-retriever", name: "Golden Retriever",
species: "dog", group: "Sporting", size: "large", weight: "25-34 kg", lifespan: "10-12 years",
    activity: "high", grooming: "high", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Hip dysplasia", "Cancer", "Heart disease"],
    traits: ["Friendly", "Smart", "Loyal", "Patient"],
    origin: "United Kingdom", emoji: "🐕"
  },
  {
    id: "labrador", name: "Labrador Retriever",
species: "dog", group: "Sporting", size: "large", weight: "25-36 kg", lifespan: "10-12 years",
    activity: "high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Hip dysplasia", "Obesity", "Eye disease"],
    traits: ["Friendly", "Active", "Obedient", "Loves water"],
    origin: "Canada", emoji: "🦮"
  },
  {
    id: "german-shepherd", name: "German Shepherd",
species: "dog", group: "Herding", size: "large", weight: "22-40 kg", lifespan: "9-13 years",
    activity: "very_high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "high",
    healthIssues: ["Hip dysplasia", "Degenerative myelopathy", "Bloat"],
    traits: ["Smart", "Loyal", "Fearless", "Working"],
    origin: "Germany", emoji: "🐕‍🦺"
  },
  {
    id: "french-bulldog", name: "French Bulldog",
species: "dog", group: "Non-Sporting", size: "small", weight: "8-14 kg", lifespan: "10-12 years",
    activity: "low", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Brachycephaly", "Spinal issues", "Allergies"],
    traits: ["Playful", "Adaptable", "Companion", "Stubborn"],
    origin: "France", emoji: "🐶"
  },
  {
    id: "poodle", name: "Poodle",
species: "dog", group: "Non-Sporting", size: "medium", weight: "20-32 kg", lifespan: "12-15 years",
    activity: "high", grooming: "high", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Addison's disease", "Bloat", "Hip dysplasia"],
    traits: ["Very smart", "Elegant", "Hypoallergenic", "Trainable"],
    origin: "Germany / France", emoji: "🐩"
  },
  {
    id: "husky", name: "Siberian Husky",
species: "dog", group: "Working", size: "medium", weight: "16-27 kg", lifespan: "12-14 years",
    activity: "very_high", grooming: "high", trainability: "hard",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "high",
    healthIssues: ["Eye disease", "Hip dysplasia", "Hypothyroidism"],
    traits: ["Independent", "Friendly", "Energetic", "Howls instead of barking"],
    origin: "Russia", emoji: "🐺"
  },
  {
    id: "corgi", name: "Pembroke Welsh Corgi",
species: "dog", group: "Herding", size: "small", weight: "10-14 kg", lifespan: "12-15 years",
    activity: "high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Hip dysplasia", "Eye disease", "Spinal issues"],
    traits: ["Cheerful", "Smart", "Herding instinct", "Loves attention"],
    origin: "Wales", emoji: "🐕"
  },
  {
    id: "doberman", name: "Doberman Pinscher",
species: "dog", group: "Working", size: "large", weight: "27-45 kg", lifespan: "10-12 years",
    activity: "very_high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "low",
    healthIssues: ["Cardiomyopathy", "von Willebrand disease", "Bloat"],
    traits: ["Loyal", "Fearless", "Smart", "Elegant"],
    origin: "Germany", emoji: "🐕"
  },
  {
    id: "beagle", name: "Beagle",
species: "dog", group: "Hound", size: "small", weight: "9-11 kg", lifespan: "12-15 years",
    activity: "high", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Epilepsy", "Hypothyroidism", "Eye disease"],
    traits: ["Curious", "Cheerful", "Stubborn", "Great nose"],
    origin: "United Kingdom", emoji: "🐕"
  },
  {
    id: "yorkshire-terrier", name: "Yorkshire Terrier",
species: "dog", group: "Toy", size: "small", weight: "2-3 kg", lifespan: "13-16 years",
    activity: "medium", grooming: "high", trainability: "moderate",
    goodWithKids: false, goodWithPets: false, apartment: true, shedding: "low",
    healthIssues: ["Dental disease", "Hypoglycemia", "Tracheal collapse"],
    traits: ["Brave", "Energetic", "Affectionate", "Tiny guardian"],
    origin: "United Kingdom", emoji: "🐕"
  },
  {
    id: "dachshund", name: "Dachshund",
species: "dog", group: "Hound", size: "small", weight: "7-15 kg", lifespan: "12-16 years",
    activity: "medium", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: false, apartment: true, shedding: "medium",
    healthIssues: ["Spinal disorders", "Obesity", "Epilepsy"],
    traits: ["Courageous", "Stubborn", "Hunting instinct", "Affectionate"],
    origin: "Germany", emoji: "🐕"
  },
  {
    id: "shiba-inu", name: "Shiba Inu",
species: "dog", group: "Non-Sporting", size: "small", weight: "8-11 kg", lifespan: "12-15 years",
    activity: "medium", grooming: "medium", trainability: "hard",
    goodWithKids: false, goodWithPets: false, apartment: true, shedding: "high",
    healthIssues: ["Allergies", "Hip dysplasia", "Eye disease"],
    traits: ["Independent", "Tidy", "Stubborn", "Fox-like look"],
    origin: "Japan", emoji: "🐕"
  },
  {
    id: "boxer", name: "Boxer",
species: "dog", group: "Working", size: "large", weight: "25-32 kg", lifespan: "10-12 years",
    activity: "high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: false, shedding: "medium",
    healthIssues: ["Cancer", "Cardiomyopathy", "Hip dysplasia"],
    traits: ["Playful", "Energetic", "Loyal", "Guardian"],
    origin: "Germany", emoji: "🐕"
  },
  {
    id: "akita", name: "Akita",
species: "dog", group: "Working", size: "large", weight: "32-45 kg", lifespan: "10-13 years",
    activity: "medium", grooming: "high", trainability: "hard",
    goodWithKids: false, goodWithPets: false, apartment: false, shedding: "high",
    healthIssues: ["Hip dysplasia", "Autoimmune disease", "Bloat"],
    traits: ["Loyal", "Independent", "Quiet", "Dignified"],
    origin: "Japan", emoji: "🐕"
  },
  {
    id: "samoyed", name: "Samoyed",
species: "dog", group: "Working", size: "medium", weight: "16-30 kg", lifespan: "12-14 years",
    activity: "high", grooming: "high", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: false, shedding: "high",
    healthIssues: ["Hip dysplasia", "Glaucoma", "Diabetes"],
    traits: ["Smiling", "Friendly", "Fluffy", "No odor"],
    origin: "Russia", emoji: "🐕"
  },
  {
    id: "border-collie", name: "Border Collie",
species: "dog", group: "Herding", size: "medium", weight: "14-20 kg", lifespan: "12-15 years",
    activity: "very_high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: false, shedding: "medium",
    healthIssues: ["Epilepsy", "Hip dysplasia", "Collie eye anomaly"],
    traits: ["Smartest", "Workaholic", "Fast", "Needs a job"],
    origin: "United Kingdom", emoji: "🐕‍🦺"
  },
  {
    id: "rottweiler", name: "Rottweiler",
species: "dog", group: "Working", size: "large", weight: "35-60 kg", lifespan: "8-10 years",
    activity: "medium", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "medium",
    healthIssues: ["Hip dysplasia", "Cancer", "Heart disease"],
    traits: ["Confident", "Calm", "Loyal", "Guardian"],
    origin: "Germany", emoji: "🐕"
  },
  {
    id: "cavalier", name: "Cavalier King Charles Spaniel",
species: "dog", group: "Toy", size: "small", weight: "5-8 kg", lifespan: "9-14 years",
    activity: "medium", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Heart disease", "Syringomyelia", "Eye disease"],
    traits: ["Affectionate", "Quiet", "Companion", "Adaptable"],
    origin: "United Kingdom", emoji: "🐕"
  },
  {
    id: "australian-shepherd", name: "Australian Shepherd",
species: "dog", group: "Herding", size: "medium", weight: "18-29 kg", lifespan: "12-15 years",
    activity: "very_high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: false, shedding: "high",
    healthIssues: ["Epilepsy", "Hip dysplasia", "Vision problems"],
    traits: ["Smart", "Energetic", "Herding", "Beautiful coat"],
    origin: "USA", emoji: "🐕"
  },
  {
    id: "chihuahua", name: "Chihuahua",
species: "dog", group: "Toy", size: "small", weight: "1.5-3 kg", lifespan: "14-16 years",
    activity: "low", grooming: "low", trainability: "moderate",
    goodWithKids: false, goodWithPets: false, apartment: true, shedding: "low",
    healthIssues: ["Dental disease", "Hydrocephalus", "Heart problems"],
    traits: ["Sassy", "Devoted to one", "Compact", "Long-lived"],
    origin: "Mexico", emoji: "🐕"
  },
];

export const catBreeds: Breed[] = [
  {
    id: "british-shorthair", name: "British Shorthair",
species: "cat", group: "Shorthair", size: "medium", weight: "4-8 kg", lifespan: "12-20 years",
    activity: "low", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Cardiomyopathy", "Polycystic kidney disease", "Obesity"],
    traits: ["Calm", "Independent", "Plush", "Dislikes being held"],
    origin: "United Kingdom", emoji: "🐱"
  },
  {
    id: "maine-coon", name: "Maine Coon",
species: "cat", group: "Longhair", size: "giant", weight: "5-12 kg", lifespan: "12-15 years",
    activity: "medium", grooming: "high", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Cardiomyopathy", "Hip dysplasia", "Polycystic disease"],
    traits: ["Friendly giant", "Dog-like cat", "Talkative", "Loves water"],
    origin: "USA", emoji: "🐱"
  },
  {
    id: "scottish-fold", name: "Scottish Fold",
species: "cat", group: "Shorthair", size: "medium", weight: "3-6 kg", lifespan: "11-14 years",
    activity: "low", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Osteochondrodysplasia", "Cardiomyopathy", "Arthritis"],
    traits: ["Quiet", "Affectionate", "Folded ears", "Sits like a human"],
    origin: "Scotland", emoji: "🐱"
  },
  {
    id: "siamese", name: "Siamese",
species: "cat", group: "Shorthair", size: "medium", weight: "3-5 kg", lifespan: "12-20 years",
    activity: "high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Asthma", "Heart disease", "Strabismus"],
    traits: ["Very talkative", "Affectionate", "Smart", "Demands attention"],
    origin: "Thailand", emoji: "🐱"
  },
  {
    id: "persian", name: "Persian",
species: "cat", group: "Longhair", size: "medium", weight: "3-7 kg", lifespan: "12-17 years",
    activity: "low", grooming: "high", trainability: "hard",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Polycystic kidney disease", "Breathing issues", "Eye disease"],
    traits: ["Calm", "Lazy", "Fluffy", "Furniture with eyes"],
    origin: "Iran", emoji: "🐱"
  },
  {
    id: "bengal", name: "Bengal",
species: "cat", group: "Shorthair", size: "medium", weight: "4-7 kg", lifespan: "12-16 years",
    activity: "very_high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: false, apartment: false, shedding: "low",
    healthIssues: ["Cardiomyopathy", "PRA", "Patellar luxation"],
    traits: ["Wild look", "Hyperactive", "Smart", "Loves water"],
    origin: "USA", emoji: "🐱"
  },
  {
    id: "ragdoll", name: "Ragdoll",
species: "cat", group: "Longhair", size: "large", weight: "4-9 kg", lifespan: "12-17 years",
    activity: "low", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "medium",
    healthIssues: ["Cardiomyopathy", "Urolithiasis", "Obesity"],
    traits: ["Ragdoll", "Affectionate", "Follows owner", "Relaxed"],
    origin: "USA", emoji: "🐱"
  },
  {
    id: "sphynx", name: "Sphynx",
species: "cat", group: "Hairless", size: "medium", weight: "3-6 kg", lifespan: "8-14 years",
    activity: "high", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Cardiomyopathy", "Skin infections", "Cold sensitivity"],
    traits: ["Hairless", "Warm body", "Clingy affectionate", "Clown"],
    origin: "Canada", emoji: "🐱"
  },
  {
    id: "abyssinian", name: "Abyssinian",
species: "cat", group: "Shorthair", size: "medium", weight: "3-5 kg", lifespan: "12-15 years",
    activity: "very_high", grooming: "low", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Renal amyloidosis", "Dental disease", "Patellar luxation"],
    traits: ["Curious", "Playful", "Acrobat", "Never sits still"],
    origin: "Ethiopia", emoji: "🐱"
  },
  {
    id: "russian-blue", name: "Russian Blue",
species: "cat", group: "Shorthair", size: "medium", weight: "3-5 kg", lifespan: "15-20 years",
    activity: "medium", grooming: "low", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Urolithiasis", "Obesity"],
    traits: ["Quiet", "Elegant", "Bonds with one", "Long-lived"],
    origin: "Russia", emoji: "🐱"
  },
  {
    id: "norwegian-forest", name: "Norwegian Forest Cat",
species: "cat", group: "Longhair", size: "large", weight: "4-9 kg", lifespan: "14-16 years",
    activity: "medium", grooming: "high", trainability: "moderate",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "high",
    healthIssues: ["Cardiomyopathy", "Hip dysplasia", "Type IV glycogen storage disease"],
    traits: ["Affectionate", "Independent", "Loves heights", "Water-resistant coat"],
    origin: "Norway", emoji: "🐱"
  },
  {
    id: "sphinx-don", name: "Don Sphynx",
species: "cat", group: "Hairless", size: "medium", weight: "3-5 kg", lifespan: "12-15 years",
    activity: "medium", grooming: "medium", trainability: "easy",
    goodWithKids: true, goodWithPets: true, apartment: true, shedding: "low",
    healthIssues: ["Skin issues", "Dental disease", "Cold sensitivity"],
    traits: ["Affectionate", "Alien look", "Loves warmth", "Social"],
    origin: "Russia", emoji: "🐱"
  },
];

export const allBreeds = [...dogBreeds, ...catBreeds];
