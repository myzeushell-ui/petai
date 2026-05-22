// Mock data for B2B partner mode (will be replaced by Supabase later)
import { PartnerType } from "../contexts/RoleContext";

export interface Order {
  id: string;
  type: "consultation" | "product" | "service" | "delivery";
  status: "new" | "accepted" | "in_progress" | "completed" | "cancelled";
  customerName: string;
  customerAvatar?: string;
  petName: string;
  petBreed: string;
  petPhoto?: string;
  service: string;
  scheduledFor?: string;
  price: number;
  currency: string;
  notes?: string;
  createdAt: string;
  duration?: number;  // minutes
  address?: string;
  productItems?: { name: string; qty: number; price: number }[];
}

export interface ChatMessage {
  id: string;
  from: "partner" | "customer";
  text: string;
  at: string;
}

export interface ChatThread {
  id: string;
  customerName: string;
  customerAvatar?: string;
  petName: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  messages: ChatMessage[];
}

export interface PartnerProfile {
  type: PartnerType;
  name: string;
  title: string;
  experience: number;
  rating: number;
  reviewCount: number;
  bio: string;
  languages: string[];
  availability: "online" | "offline" | "both";
  location?: string;
  pricePerSession: number;
  responseTime: string;
}

export const mockOrders: Order[] = [
  {
    id: "o1", type: "consultation", status: "new",
    customerName: "Alex Johnson", petName: "Luna", petBreed: "Golden Retriever",
    petPhoto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=80",
    service: "30-min video consultation", scheduledFor: "2026-05-22T14:30:00",
    price: 45, currency: "USD", duration: 30,
    notes: "Concerned about elevated ALT levels in recent bloodwork. Need second opinion.",
    createdAt: "2026-05-22T02:15:00",
  },
  {
    id: "o2", type: "consultation", status: "accepted",
    customerName: "Maria Lopez", petName: "Rex", petBreed: "German Shepherd",
    petPhoto: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&q=80",
    service: "Behavioral assessment", scheduledFor: "2026-05-22T16:00:00",
    price: 55, currency: "USD", duration: 45,
    notes: "Dog showing anxiety, excessive barking at strangers",
    createdAt: "2026-05-21T18:30:00",
  },
  {
    id: "o3", type: "delivery", status: "new",
    customerName: "James Chen", petName: "Whiskers", petBreed: "Maine Coon",
    service: "Premium Cat Food Delivery", price: 89, currency: "USD",
    productItems: [
      { name: "Royal Canin Maine Coon 4kg", qty: 2, price: 35 },
      { name: "Cat Probiotic Supplement", qty: 1, price: 19 },
    ],
    address: "1234 Market St, San Francisco, CA",
    notes: "Leave at door if not home. Cat is indoor-only.",
    createdAt: "2026-05-21T22:00:00",
  },
  {
    id: "o4", type: "service", status: "in_progress",
    customerName: "Sarah Williams", petName: "Bella", petBreed: "Poodle",
    petPhoto: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80",
    service: "Mobile grooming - full service", scheduledFor: "2026-05-22T10:00:00",
    price: 85, currency: "USD", duration: 90,
    address: "456 Oak Ave, Apt 3B",
    notes: "Bella is nervous around blow dryers - go slow.",
    createdAt: "2026-05-20T14:00:00",
  },
  {
    id: "o5", type: "consultation", status: "completed",
    customerName: "David Kim", petName: "Mochi", petBreed: "British Shorthair",
    service: "Nutrition consultation", price: 40, currency: "USD", duration: 30,
    notes: "Helped switch to grain-free diet. Follow-up in 3 weeks.",
    createdAt: "2026-05-18T11:00:00",
  },
  {
    id: "o6", type: "consultation", status: "new",
    customerName: "Emily Brown", petName: "Buddy", petBreed: "Labrador",
    service: "Skin condition check", scheduledFor: "2026-05-23T09:00:00",
    price: 50, currency: "USD", duration: 30,
    notes: "Itchy paws and ears, possible allergy",
    createdAt: "2026-05-22T01:00:00",
  },
];

export const mockChats: ChatThread[] = [
  {
    id: "c1", customerName: "Alex Johnson", petName: "Luna",
    lastMessage: "Thanks doc, I'll switch to low-fat treats tonight!",
    lastAt: "2026-05-22T02:10:00", unread: 1,
    messages: [
      { id: "m1", from: "customer", text: "Hi! Luna's ALT came back at 128. Should I be worried?", at: "2026-05-22T01:30:00" },
      { id: "m2", from: "partner", text: "It's mildly elevated. Try cutting fatty treats for 2 weeks and we'll recheck. Not urgent.", at: "2026-05-22T01:35:00" },
      { id: "m3", from: "customer", text: "Got it. Should I keep giving her fish oil?", at: "2026-05-22T01:40:00" },
      { id: "m4", from: "partner", text: "Yes, fish oil is fine — actually helps liver. Just cut bacon/cheese treats.", at: "2026-05-22T01:45:00" },
      { id: "m5", from: "customer", text: "Thanks doc, I'll switch to low-fat treats tonight!", at: "2026-05-22T02:10:00" },
    ],
  },
  {
    id: "c2", customerName: "Maria Lopez", petName: "Rex",
    lastMessage: "See you tomorrow at 4pm!",
    lastAt: "2026-05-21T19:00:00", unread: 0,
    messages: [
      { id: "m6", from: "customer", text: "Rex barks at everyone who walks past the window. It's getting worse.", at: "2026-05-21T18:00:00" },
      { id: "m7", from: "partner", text: "Sounds like territorial behavior. Let's do an assessment tomorrow.", at: "2026-05-21T18:30:00" },
      { id: "m8", from: "customer", text: "See you tomorrow at 4pm!", at: "2026-05-21T19:00:00" },
    ],
  },
  {
    id: "c3", customerName: "Sarah Williams", petName: "Bella",
    lastMessage: "On my way, see you in 20!",
    lastAt: "2026-05-22T09:40:00", unread: 0,
    messages: [
      { id: "m9", from: "customer", text: "Front door is open, just come in", at: "2026-05-22T09:35:00" },
      { id: "m10", from: "partner", text: "On my way, see you in 20!", at: "2026-05-22T09:40:00" },
    ],
  },
];

export const DEFAULT_PROFILES: Record<PartnerType, PartnerProfile> = {
  veterinarian: {
    type: "veterinarian", name: "Dr. Sarah Chen", title: "DVM, Board Certified Internal Medicine",
    experience: 12, rating: 4.9, reviewCount: 234,
    bio: "Specializing in internal medicine and preventive care for dogs and cats. UC Davis graduate.",
    languages: ["English", "Mandarin"], availability: "both", location: "San Francisco, CA",
    pricePerSession: 45, responseTime: "< 1 hour",
  },
  groomer: {
    type: "groomer", name: "Lisa Wang", title: "National Certified Master Groomer",
    experience: 15, rating: 4.8, reviewCount: 276,
    bio: "Mobile grooming service. Specialized in long-haired breeds and skin-sensitive pets.",
    languages: ["English", "Mandarin"], availability: "offline", location: "Bay Area",
    pricePerSession: 85, responseTime: "Same day",
  },
  trainer: {
    type: "trainer", name: "Alex Thompson", title: "CPDT-KA Certified Trainer",
    experience: 8, rating: 4.9, reviewCount: 312,
    bio: "Positive reinforcement trainer. Puppy basics, behavior modification, agility, sport.",
    languages: ["English", "Spanish"], availability: "both", location: "Austin, TX",
    pricePerSession: 35, responseTime: "< 2 hours",
  },
  nutritionist: {
    type: "nutritionist", name: "Dr. Emily Park", title: "DVM, Veterinary Nutrition Specialist",
    experience: 7, rating: 4.6, reviewCount: 98,
    bio: "Custom diet plans, weight management, raw feeding guidance.",
    languages: ["English", "Korean"], availability: "online", pricePerSession: 40, responseTime: "< 4 hours",
  },
  behaviorist: {
    type: "behaviorist", name: "Dr. James Wilson", title: "DACVB Veterinary Behaviorist",
    experience: 18, rating: 4.8, reviewCount: 156,
    bio: "Helping pets with anxiety, aggression, and complex behavioral issues.",
    languages: ["English"], availability: "online", pricePerSession: 60, responseTime: "< 1 day",
  },
  breeder: {
    type: "breeder", name: "Mark Anderson", title: "AKC Breeder of Merit",
    experience: 20, rating: 4.7, reviewCount: 145,
    bio: "20 years breeding Golden Retrievers. Health-tested lines, COI consultations.",
    languages: ["English"], availability: "both", location: "Denver, CO",
    pricePerSession: 50, responseTime: "Same day",
  },
  seller: {
    type: "seller", name: "PetTech Store", title: "Verified pet supplies seller",
    experience: 5, rating: 4.6, reviewCount: 1247,
    bio: "Premium pet food, accessories, and tech. Ships nationwide. 30-day return policy.",
    languages: ["English"], availability: "online", pricePerSession: 0, responseTime: "< 30 min",
  },
};

export const PARTNER_TYPE_LABELS: Record<PartnerType, { label: string; emoji: string; description: string }> = {
  veterinarian: { label: "Veterinarian", emoji: "👩‍⚕️", description: "DVM, medical care" },
  groomer:      { label: "Groomer",      emoji: "✂️",  description: "Bathing, hair cuts, nails" },
  trainer:      { label: "Trainer",      emoji: "🎓",  description: "Obedience, behavior" },
  nutritionist: { label: "Nutritionist", emoji: "🥗",  description: "Diet, weight, food plans" },
  behaviorist:  { label: "Behaviorist",  emoji: "🧠",  description: "Anxiety, aggression" },
  breeder:      { label: "Breeder",      emoji: "🐕",  description: "Breeding, COI, pedigree" },
  seller:       { label: "Food/Goods Seller", emoji: "🛍️", description: "Sell food, accessories, products" },
};
