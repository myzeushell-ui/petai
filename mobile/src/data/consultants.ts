import { Consultant } from "../types";

export const consultants: Consultant[] = [
  {
    id: "c1", name: "Dr. Sarah Chen", specialty: "veterinarian", title: "DVM, Board Certified",
    experience: 12, rating: 4.9, reviewCount: 234, price: 45, currency: "USD", duration: 30,
    availability: "both", location: "San Francisco, CA", languages: ["English", "Mandarin"],
    bio: "Specializing in internal medicine and preventive care for dogs and cats.",
    emoji: "👩‍⚕️", nextAvailable: "Today", tags: ["Top Rated", "Same Day"],
  },
  {
    id: "c2", name: "Dr. James Wilson", specialty: "cardiologist", title: "DVM, DACVIM (Cardiology)",
    experience: 18, rating: 4.8, reviewCount: 156, price: 55, currency: "USD", duration: 45,
    availability: "online", languages: ["English"],
    bio: "Veterinary cardiologist with extensive experience in echocardiography and cardiac interventions.",
    emoji: "🫀", nextAvailable: "Tomorrow", tags: ["Specialist"],
  },
  {
    id: "c3", name: "Dr. Maria Rodriguez", specialty: "dermatologist", title: "DVM, DACVD",
    experience: 10, rating: 4.7, reviewCount: 189, price: 50, currency: "USD", duration: 30,
    availability: "both", location: "Los Angeles, CA", languages: ["English", "Spanish"],
    bio: "Expert in allergies, skin infections, and autoimmune skin diseases.",
    emoji: "🔬", nextAvailable: "Today", tags: ["Same Day"],
  },
  {
    id: "c4", name: "Alex Thompson", specialty: "trainer", title: "CPDT-KA Certified",
    experience: 8, rating: 4.9, reviewCount: 312, price: 35, currency: "USD", duration: 60,
    availability: "both", location: "Austin, TX", languages: ["English"],
    bio: "Positive reinforcement trainer. Puppy basics, behavior modification, agility.",
    emoji: "🎓", nextAvailable: "Today", tags: ["Top Rated", "Popular"],
  },
  {
    id: "c5", name: "Dr. Emily Park", specialty: "nutritionist", title: "DVM, Nutrition Specialist",
    experience: 7, rating: 4.6, reviewCount: 98, price: 40, currency: "USD", duration: 30,
    availability: "online", languages: ["English", "Korean"],
    bio: "Custom diet plans, weight management, and raw feeding guidance.",
    emoji: "🥗", nextAvailable: "Wed", tags: ["Diet Plans"],
  },
  {
    id: "c6", name: "Lisa Wang", specialty: "groomer", title: "National Certified Master Groomer",
    experience: 15, rating: 4.8, reviewCount: 276, price: 20, currency: "USD", duration: 15,
    availability: "online", languages: ["English", "Mandarin"],
    bio: "Breed-specific grooming consultation and skin care advice.",
    emoji: "✂️", nextAvailable: "Today", tags: ["Quick Consult"],
  },
];
