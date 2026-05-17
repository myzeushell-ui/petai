export interface Consultant {
  id: string;
  name: string;
  specialty: ConsultantSpecialty;
  title: string;
  experience: number;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  duration: string;
  availability: "online" | "offline" | "both";
  location?: string;
  languages: string[];
  bio: string;
  emoji: string;
  nextAvailable: string;
  tags: string[];
}

export type ConsultantSpecialty =
  | "veterinarian"
  | "cardiologist"
  | "dermatologist"
  | "surgeon"
  | "nutritionist"
  | "behaviorist"
  | "trainer"
  | "groomer"
  | "breeder_consultant";

export const specialtyLabels: Record<ConsultantSpecialty, string> = {
  veterinarian: "Veterinarian",
  cardiologist: "Cardiologist",
  dermatologist: "Dermatologist",
  surgeon: "Surgeon",
  nutritionist: "Nutritionist",
  behaviorist: "Behaviorist",
  trainer: "Dog Trainer",
  groomer: "Groomer",
  breeder_consultant: "Breeding Consultant",
};

export const specialtyEmoji: Record<ConsultantSpecialty, string> = {
  veterinarian: "🩺",
  cardiologist: "❤️",
  dermatologist: "🔬",
  surgeon: "🏥",
  nutritionist: "🥗",
  behaviorist: "🧠",
  trainer: "🎓",
  groomer: "✂️",
  breeder_consultant: "🐾",
};

export const consultants: Consultant[] = [
  {
    id: "cons-001", name: "Dr. Anna Ivanova", specialty: "veterinarian",
    title: "General practice veterinarian", experience: 12, rating: 4.9, reviewCount: 247,
    price: 35, currency: "$", duration: "45 min", availability: "both",
    location: "New York", languages: ["English"],
    bio: "Specialist in small companion animals. Holistic approach to diagnostics.",
    emoji: "🩺", nextAvailable: "2026-05-18T10:00:00Z",
    tags: ["general practice", "diagnostics", "lab work"],
  },
  {
    id: "cons-002", name: "Dr. Sergey Kozlov", specialty: "cardiologist",
    title: "Veterinary cardiologist, PhD", experience: 18, rating: 4.9, reviewCount: 189,
    price: 55, currency: "$", duration: "60 min", availability: "both",
    location: "Boston", languages: ["English"],
    bio: "Small-animal cardiology. ECG, echocardiogram, Holter monitoring. PhD.",
    emoji: "❤️", nextAvailable: "2026-05-20T14:00:00Z",
    tags: ["heart", "ECG", "echo", "PhD"],
  },
  {
    id: "cons-003", name: "Maria Lebedeva", specialty: "behaviorist",
    title: "Animal behaviorist, R+ certified", experience: 8, rating: 4.8, reviewCount: 156,
    price: 40, currency: "$", duration: "60 min", availability: "online",
    languages: ["English"],
    bio: "Correcting aggression, fear and destructive behavior. R+ humane methods only.",
    emoji: "🧠", nextAvailable: "2026-05-18T16:00:00Z",
    tags: ["aggression", "fear", "R+", "online"],
  },
  {
    id: "cons-004", name: "Dmitry Petrov", specialty: "trainer",
    title: "Dog trainer, AKC certified", experience: 15, rating: 4.8, reviewCount: 312,
    price: 65, currency: "$", duration: "90 min", availability: "offline",
    location: "New York", languages: ["English"],
    bio: "Basic and sport obedience. Show prep. Problem-behavior coaching.",
    emoji: "🎓", nextAvailable: "2026-05-19T09:00:00Z",
    tags: ["obedience", "shows", "in-person"],
  },
  {
    id: "cons-005", name: "Dr. Elena Smirnova", specialty: "dermatologist",
    title: "Veterinary dermatologist", experience: 10, rating: 4.7, reviewCount: 134,
    price: 50, currency: "$", duration: "45 min", availability: "both",
    location: "Chicago", languages: ["English"],
    bio: "Allergies, dermatitis, ear mites, coat issues. Allergy panels.",
    emoji: "🔬", nextAvailable: "2026-05-19T11:00:00Z",
    tags: ["allergy", "skin", "coat", "panels"],
  },
  {
    id: "cons-006", name: "Olga Nikitina", specialty: "nutritionist",
    title: "Veterinary nutritionist", experience: 7, rating: 4.8, reviewCount: 98,
    price: 30, currency: "$", duration: "30 min", availability: "online",
    languages: ["English"],
    bio: "Custom diet plans, weight management, therapeutic diets. BARF and kibble.",
    emoji: "🥗", nextAvailable: "2026-05-18T12:00:00Z",
    tags: ["diet", "BARF", "weight", "ration"],
  },
  {
    id: "cons-007", name: "Dr. Alexey Morozov", specialty: "surgeon",
    title: "Veterinary surgeon, orthopedic specialist", experience: 20, rating: 4.9, reviewCount: 278,
    price: 75, currency: "$", duration: "60 min", availability: "offline",
    location: "Boston", languages: ["English"],
    bio: "Orthopedics, neurosurgery, minimally invasive surgery. Trained in Germany.",
    emoji: "🏥", nextAvailable: "2026-05-21T10:00:00Z",
    tags: ["orthopedics", "surgery", "dysplasia"],
  },
  {
    id: "cons-008", name: "Natalya Volkova", specialty: "breeder_consultant",
    title: "Breeding consultant, AKC judge", experience: 25, rating: 4.9, reviewCount: 167,
    price: 60, currency: "$", duration: "60 min", availability: "online",
    languages: ["English"],
    bio: "Mating matchmaking, COI analysis, whelping prep. 25 years in the breed.",
    emoji: "🐾", nextAvailable: "2026-05-18T18:00:00Z",
    tags: ["breeding", "COI", "mating", "AKC"],
  },
  {
    id: "cons-009", name: "Victoria Kuznetsova", specialty: "groomer",
    title: "Master groomer, international class", experience: 11, rating: 4.7, reviewCount: 203,
    price: 50, currency: "$", duration: "120 min", availability: "offline",
    location: "New York", languages: ["English"],
    bio: "Breed-specific and creative grooming, hand-stripping, show prep.",
    emoji: "✂️", nextAvailable: "2026-05-18T10:00:00Z",
    tags: ["grooming", "shows", "hand-stripping"],
  },
  {
    id: "cons-010", name: "Dr. Igor Belov", specialty: "veterinarian",
    title: "Exotic animal veterinarian", experience: 9, rating: 4.6, reviewCount: 87,
    price: 45, currency: "$", duration: "45 min", availability: "online",
    languages: ["English"],
    bio: "Rabbits, birds, reptiles, ferrets. Online consultations nationwide.",
    emoji: "🦜", nextAvailable: "2026-05-19T15:00:00Z",
    tags: ["exotics", "rabbits", "birds", "online"],
  },
];

export function getConsultantsBySpecialty(specialty: ConsultantSpecialty): Consultant[] {
  return consultants.filter((c) => c.specialty === specialty);
}

export function getTopConsultants(limit = 5): Consultant[] {
  return [...consultants].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, limit);
}
