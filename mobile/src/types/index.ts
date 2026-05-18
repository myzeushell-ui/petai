export interface Pet {
  id: string;
  name: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "other";
  breed: string;
  age: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  gender: "male" | "female";
  neutered: boolean;
  avatarUrl?: string;
  color: string;
  ownerId: string;
  createdAt: string;
  healthScore: number;
  emoji: string;
}

export interface HealthEvent {
  id: string;
  petId: string;
  type: "vaccination" | "checkup" | "surgery" | "medication" | "symptom" | "lab" | "note";
  title: string;
  description: string;
  date: string;
  vetName?: string;
  clinicName?: string;
  severity?: "low" | "medium" | "high";
  resolved?: boolean;
}

export interface LabPanel {
  name: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: "normal" | "low" | "high" | "critical";
}

export interface LabResult {
  id: string;
  petId: string;
  testName: string;
  testDate: string;
  labName: string;
  status: "normal" | "abnormal" | "borderline" | "critical";
  aiAnalysis?: string;
  uploadedAt: string;
  panels: LabPanel[];
}

export interface Reminder {
  id: string;
  petId: string;
  type: "medication" | "vaccination" | "checkup" | "grooming" | "custom";
  title: string;
  description?: string;
  dueDate: string;
  recurring: boolean;
  recurringInterval?: "daily" | "weekly" | "monthly" | "yearly";
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export interface AIInsight {
  id: string;
  petId: string;
  type: "health_alert" | "recommendation" | "trend" | "praise";
  title: string;
  body: string;
  confidence: number;
  generatedAt: string;
  sources?: string[];
  actionable: boolean;
  action?: string;
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface VetReport {
  id: string;
  petId: string;
  visitDate: string;
  vetName: string;
  clinicName: string;
  clinicAddress?: string;
  chiefComplaint: string;
  diagnosis: string[];
  treatment: string[];
  prescriptions: Prescription[];
  followUpDate?: string;
  notes: string;
  aiSummary?: string;
}

export interface Breed {
  id: string;
  name: string;
  species: "dog" | "cat";
  group: string;
  size: "small" | "medium" | "large" | "giant";
  weight: string;
  lifespan: string;
  activity: "low" | "moderate" | "high" | "very high";
  grooming: "low" | "moderate" | "high";
  trainability: "easy" | "moderate" | "stubborn";
  goodWithKids: boolean;
  goodWithPets: boolean;
  apartment: boolean;
  shedding: "low" | "moderate" | "high";
  healthIssues: string[];
  traits: string[];
  origin: string;
  emoji: string;
  description: string;
}

export interface MarketplaceListing {
  id: string;
  type: "puppy" | "kitten" | "adult" | "service" | "product";
  title: string;
  description: string;
  price: number;
  currency: string;
  breed?: string;
  species?: string;
  age?: string;
  gender?: string;
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

export interface Consultant {
  id: string;
  name: string;
  specialty: string;
  title: string;
  experience: number;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  duration: number;
  availability: "online" | "offline" | "both";
  location?: string;
  languages: string[];
  bio: string;
  emoji: string;
  nextAvailable: string;
  tags: string[];
}

export type HealthScoreCategory = "excellent" | "good" | "fair" | "poor";

export function getHealthScoreCategory(score: number): HealthScoreCategory {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  return "poor";
}
