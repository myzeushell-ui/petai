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
    id: "ml-001", type: "puppy", title: "Golden Retriever puppies — champion line",
    description: "4 boys and 2 girls. Sire is AKC champion. Full paperwork, vaccinations, microchip.",
    price: 1200, currency: "$", images: [], breed: "Golden Retriever", species: "dog",
    age: "2 mo", gender: "male", location: "New York", sellerName: "Golden Valley Kennel",
    sellerRating: 4.9, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-10T10:00:00Z", emoji: "🐕",
    tags: ["champion", "paperwork", "shipping"],
  },
  {
    id: "ml-002", type: "puppy", title: "Labrador puppy — yellow boy",
    description: "Male, born April 15. Playful, healthy, age-appropriate vaccines done.",
    price: 800, currency: "$", images: [], breed: "Labrador Retriever", species: "dog",
    age: "1.5 mo", gender: "male", location: "Boston", sellerName: "Labrador House",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-08T14:00:00Z", emoji: "🦮",
    tags: ["yellow", "playful", "paperwork"],
  },
  {
    id: "ml-003", type: "puppy", title: "Husky puppies — blue-eyed litter",
    description: "Black and white, blue eyes. 3 males. Parents OFA tested and clear.",
    price: 950, currency: "$", images: [], breed: "Siberian Husky", species: "dog",
    age: "2.5 mo", gender: "male", location: "Denver", sellerName: "Northern Wind",
    sellerRating: 4.8, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-05T09:00:00Z", emoji: "🐺",
    tags: ["blue eyes", "OFA", "Siberian"],
  },
  {
    id: "ml-004", type: "puppy", title: "Pembroke Corgi — red and white boy",
    description: "Cheerful, well-socialized. Vaccinated, microchipped. Sales contract included.",
    price: 1100, currency: "$", images: [], breed: "Corgi", species: "dog",
    age: "3 mo", gender: "male", location: "New York", sellerName: "CorgiLand",
    sellerRating: 4.9, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-12T11:00:00Z", emoji: "🐕",
    tags: ["Pembroke", "red", "socialized"],
  },
  {
    id: "ml-005", type: "puppy", title: "German Shepherd — working line",
    description: "Puppies from working parents with training. 2 females. Black and tan.",
    price: 1000, currency: "$", images: [], breed: "German Shepherd", species: "dog",
    age: "2 mo", gender: "female", location: "Atlanta", sellerName: "K9 Elite",
    sellerRating: 4.6, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-03T08:00:00Z", emoji: "🐕‍🦺",
    tags: ["working line", "training", "elite"],
  },
  {
    id: "ml-006", type: "puppy", title: "French Bulldog — cream girl",
    description: "Female, cream coat. Compact, healthy. Perfect apartment dog.",
    price: 1400, currency: "$", images: [], breed: "French Bulldog", species: "dog",
    age: "3.5 mo", gender: "female", location: "New York", sellerName: "FrenchieClub",
    sellerRating: 4.5, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-11T16:00:00Z", emoji: "🐶",
    tags: ["cream", "apartment", "compact"],
  },
  {
    id: "ml-007", type: "puppy", title: "Pomeranian — snow-white boy",
    description: "Male, white coat. Pomeranian type. Adult weight ~5 lb.",
    price: 1800, currency: "$", images: [], breed: "Pomeranian", species: "dog",
    age: "4 mo", gender: "male", location: "Seattle", sellerName: "White Cloud",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-07T13:00:00Z", emoji: "🐾",
    tags: ["Pomeranian", "white", "mini"],
  },
  {
    id: "ml-008", type: "puppy", title: "Standard Dachshund — black and tan",
    description: "Female, smooth coat. Wonderful temperament, affectionate. AKC registered.",
    price: 600, currency: "$", images: [], breed: "Dachshund", species: "dog",
    age: "2 mo", gender: "female", location: "Houston", sellerName: "DachsHaus",
    sellerRating: 4.4, sellerVerified: false, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-09T10:00:00Z", emoji: "🌭",
    tags: ["smooth coat", "standard", "AKC"],
  },
  {
    id: "ml-009", type: "puppy", title: "Beagle — tri-color boy",
    description: "Energetic, cheerful. Vaccinated, parasite-treated. Great with kids.",
    price: 700, currency: "$", images: [], breed: "Beagle", species: "dog",
    age: "2.5 mo", gender: "male", location: "Chicago", sellerName: "BeaglePack",
    sellerRating: 4.6, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: false, healthChecked: true, createdAt: "2026-05-06T12:00:00Z", emoji: "🐕",
    tags: ["tri-color", "kid-friendly", "energetic"],
  },
  {
    id: "ml-010", type: "puppy", title: "Pug — apricot boy",
    description: "Affectionate, calm. Perfect for family life. Clear on genetic panel.",
    price: 850, currency: "$", images: [], breed: "Pug", species: "dog",
    age: "3 mo", gender: "male", location: "Phoenix", sellerName: "PugLife",
    sellerRating: 4.5, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-04T15:00:00Z", emoji: "🐶",
    tags: ["apricot", "family", "gen panel"],
  },
  // — Kittens —
  {
    id: "ml-011", type: "kitten", title: "British Shorthair kittens — blue",
    description: "Male and female. Plush coat, sturdy build. TICA paperwork.",
    price: 450, currency: "$", images: [], breed: "British Shorthair", species: "cat",
    age: "3 mo", gender: "male", location: "New York", sellerName: "BritPremium",
    sellerRating: 4.8, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-10T09:00:00Z", emoji: "🐱",
    tags: ["blue", "TICA", "plush"],
  },
  {
    id: "ml-012", type: "kitten", title: "Maine Coon — polydactyl boy",
    description: "Large, affectionate giant. Parents HCM and PKD tested clear.",
    price: 750, currency: "$", images: [], breed: "Maine Coon", species: "cat",
    age: "4 mo", gender: "male", location: "Boston", sellerName: "MegaCoon",
    sellerRating: 4.9, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-08T11:00:00Z", emoji: "🦁",
    tags: ["polydactyl", "HCM/PKD tested", "large"],
  },
  {
    id: "ml-013", type: "kitten", title: "Scottish Fold — silver girl",
    description: "Female, true fold. Cute folded ears, sweetest temperament. Litter trained.",
    price: 500, currency: "$", images: [], breed: "Scottish Fold", species: "cat",
    age: "2.5 mo", gender: "female", location: "New York", sellerName: "ScotFold",
    sellerRating: 4.6, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-11T14:00:00Z", emoji: "🐱",
    tags: ["fold", "silver", "litter trained"],
  },
  {
    id: "ml-014", type: "kitten", title: "Bengal — marble boy",
    description: "Male, vivid marble pattern. Active, playful. TICA registered.",
    price: 950, currency: "$", images: [], breed: "Bengal", species: "cat",
    age: "3 mo", gender: "male", location: "Atlanta", sellerName: "BengalWild",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-07T10:00:00Z", emoji: "🐆",
    tags: ["marble", "TICA", "active"],
  },
  {
    id: "ml-015", type: "kitten", title: "Sphynx — blue-eyed girl",
    description: "Female, blue eyes. Warm, velvety skin. Hypoallergenic option.",
    price: 600, currency: "$", images: [], breed: "Sphynx", species: "cat",
    age: "3.5 mo", gender: "female", location: "Seattle", sellerName: "NakedBeauty",
    sellerRating: 4.5, sellerVerified: false, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-09T08:00:00Z", emoji: "🐱",
    tags: ["blue-eyed", "hypoallergenic", "velvet"],
  },
  // — Services —
  {
    id: "ml-016", type: "service", title: "Cardiology consultation — online",
    description: "Online consult, ECG and echo review. 15 years of experience.",
    price: 55, currency: "$", images: [], breed: "All", species: "dog",
    location: "Online", sellerName: "Dr. A. Ivanova", sellerRating: 4.9,
    sellerVerified: true, createdAt: "2026-05-01T10:00:00Z", emoji: "🩺",
    tags: ["cardiologist", "online", "ECG"],
  },
  {
    id: "ml-017", type: "service", title: "Dog trainer — behavior coaching",
    description: "In-home visits. Aggression, fear, destructive behavior. Humane methods.",
    price: 75, currency: "$", images: [], breed: "All", species: "dog",
    location: "New York", sellerName: "D. Petrov, trainer", sellerRating: 4.8,
    sellerVerified: true, createdAt: "2026-05-02T10:00:00Z", emoji: "🎓",
    tags: ["behavior", "in-home", "humane"],
  },
  {
    id: "ml-018", type: "service", title: "Animal behaviorist — online",
    description: "Behavior assessment, socialization advice. 60-min video call.",
    price: 40, currency: "$", images: [], breed: "All", species: "dog",
    location: "Online", sellerName: "M. Lebedeva", sellerRating: 4.7,
    sellerVerified: true, createdAt: "2026-05-03T10:00:00Z", emoji: "🧠",
    tags: ["behaviorist", "online", "socialization"],
  },
  {
    id: "ml-019", type: "service", title: "Veterinary dermatologist",
    description: "Allergies, dermatitis, skin and coat issues. In-clinic visit.",
    price: 60, currency: "$", images: [], breed: "All", species: "dog",
    location: "Boston", sellerName: "ZooDoctor Clinic", sellerRating: 4.6,
    sellerVerified: true, createdAt: "2026-05-04T10:00:00Z", emoji: "🔬",
    tags: ["dermatologist", "allergy", "skin"],
  },
  {
    id: "ml-020", type: "service", title: "Mobile grooming — all breeds",
    description: "On-site grooming. Bath, cut, nails, ears. Professional cosmetics.",
    price: 50, currency: "$", images: [], breed: "All", species: "dog",
    location: "New York", sellerName: "PetSpa Mobile", sellerRating: 4.8,
    sellerVerified: true, createdAt: "2026-05-05T10:00:00Z", emoji: "✂️",
    tags: ["grooming", "mobile", "all breeds"],
  },
  // — Products —
  {
    id: "ml-021", type: "product", title: "PetAI Smart Collar",
    description: "GPS tracker, temperature, activity, voice AI analysis. Bluetooth + LTE.",
    price: 129, currency: "$", images: [], breed: "All", species: "dog",
    location: "Ships nationwide", sellerName: "PetAI Store", sellerRating: 5.0,
    sellerVerified: true, createdAt: "2026-05-01T10:00:00Z", emoji: "📡",
    tags: ["GPS", "temperature", "voice AI", "collar"],
  },
  {
    id: "ml-022", type: "product", title: "Smart feeder with camera",
    description: "Wi-Fi, app-controlled, HD camera, owner voice recording.",
    price: 109, currency: "$", images: [], breed: "All", species: "dog",
    location: "Ships nationwide", sellerName: "SmartPet Tech", sellerRating: 4.6,
    sellerVerified: true, createdAt: "2026-05-06T10:00:00Z", emoji: "🤖",
    tags: ["feeder", "camera", "Wi-Fi"],
  },
  {
    id: "ml-023", type: "product", title: "Water fountain — 2.5 L",
    description: "Silent pump, charcoal filter, suitable for dogs and cats.",
    price: 39, currency: "$", images: [], breed: "All", species: "dog",
    location: "Ships nationwide", sellerName: "PetGadgets", sellerRating: 4.5,
    sellerVerified: true, createdAt: "2026-05-07T10:00:00Z", emoji: "💧",
    tags: ["water", "fountain", "filter"],
  },
  {
    id: "ml-024", type: "product", title: "Orthopedic bed — XL for large breeds",
    description: "Memory foam, removable cover, anti-slip base. XL (40×32 in).",
    price: 79, currency: "$", images: [], breed: "All", species: "dog",
    location: "Ships nationwide", sellerName: "ComfyPet", sellerRating: 4.7,
    sellerVerified: true, createdAt: "2026-05-08T10:00:00Z", emoji: "🛏️",
    tags: ["bed", "orthopedic", "XL"],
  },
  {
    id: "ml-025", type: "product", title: "Pro grooming kit — 12 piece",
    description: "FURminator, scissors, nail clippers, comb, slicker brush. In hard case.",
    price: 45, currency: "$", images: [], breed: "All", species: "dog",
    location: "Ships nationwide", sellerName: "GroomKit", sellerRating: 4.4,
    sellerVerified: false, createdAt: "2026-05-09T10:00:00Z", emoji: "💇",
    tags: ["grooming", "kit", "FURminator"],
  },
  // — More puppies —
  {
    id: "ml-026", type: "puppy", title: "Akita Inu — red boy",
    description: "Japanese Akita, direct import line. FCI papers. Strong, confident.",
    price: 1500, currency: "$", images: [], breed: "Akita", species: "dog",
    age: "3 mo", gender: "male", location: "New York", sellerName: "AkitaJP",
    sellerRating: 4.8, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-01T10:00:00Z", emoji: "🐕",
    tags: ["Akita", "FCI", "import"],
  },
  {
    id: "ml-027", type: "puppy", title: "Yorkshire Terrier — mini girl",
    description: "Baby-face, silky coat. Adult weight ~4 lb. Sweet and gentle.",
    price: 950, currency: "$", images: [], breed: "Yorkshire Terrier", species: "dog",
    age: "4 mo", gender: "female", location: "New York", sellerName: "YorkieWorld",
    sellerRating: 4.6, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-02T10:00:00Z", emoji: "🐾",
    tags: ["mini", "baby-face", "silk coat"],
  },
  {
    id: "ml-028", type: "kitten", title: "Abyssinian — ruddy color",
    description: "Male, ruddy coat. Active, curious. Champion bloodlines.",
    price: 650, currency: "$", images: [], breed: "Abyssinian", species: "cat",
    age: "3 mo", gender: "male", location: "New York", sellerName: "AbyCats",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: false,
    pedigree: true, healthChecked: true, createdAt: "2026-05-03T10:00:00Z", emoji: "🐱",
    tags: ["ruddy", "champion", "active"],
  },
  {
    id: "ml-029", type: "puppy", title: "Samoyed — snowy smile",
    description: "2 males, fluffy and healthy. Socialized with kids.",
    price: 1300, currency: "$", images: [], breed: "Samoyed", species: "dog",
    age: "2.5 mo", gender: "male", location: "Denver", sellerName: "SamoyedSmile",
    sellerRating: 4.9, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-04T10:00:00Z", emoji: "☁️",
    tags: ["white", "smile", "kids"],
  },
  {
    id: "ml-030", type: "puppy", title: "Shiba Inu — red boy",
    description: "Classic 'Shiba smile'. Purebred, AKC registered. Basic obedience trained.",
    price: 1400, currency: "$", images: [], breed: "Shiba Inu", species: "dog",
    age: "3.5 mo", gender: "male", location: "New York", sellerName: "ShibaUS",
    sellerRating: 4.7, sellerVerified: true, vaccinated: true, microchipped: true,
    pedigree: true, healthChecked: true, createdAt: "2026-05-05T10:00:00Z", emoji: "🦊",
    tags: ["Shiba", "red", "trained"],
  },
];

export type MarketplaceFilter = "all" | "puppy" | "kitten" | "service" | "product";

export function filterListings(filter: MarketplaceFilter): MarketplaceListing[] {
  if (filter === "all") return marketplaceListings;
  return marketplaceListings.filter((l) => l.type === filter);
}
