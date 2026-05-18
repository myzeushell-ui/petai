import { MarketplaceListing } from "../types";

export const marketplaceListings: MarketplaceListing[] = [
  {
    id: "m1", type: "puppy", title: "Golden Retriever Puppies", description: "AKC registered, health tested parents, 3 males available",
    price: 2500, currency: "USD", breed: "Golden Retriever", species: "dog", age: "8 weeks", gender: "male",
    location: "Austin, TX", sellerName: "Sunshine Goldens", sellerRating: 4.9, sellerVerified: true,
    vaccinated: true, microchipped: true, pedigree: true, healthChecked: true, createdAt: "2026-05-10", emoji: "🐕", tags: ["AKC", "Health Tested"],
  },
  {
    id: "m2", type: "puppy", title: "French Bulldog Puppy", description: "Rare blue merle, DNA tested, vet checked, ready for new home",
    price: 4500, currency: "USD", breed: "French Bulldog", species: "dog", age: "10 weeks", gender: "female",
    location: "Miami, FL", sellerName: "Royal Frenchies", sellerRating: 4.7, sellerVerified: true,
    vaccinated: true, microchipped: true, pedigree: true, healthChecked: true, createdAt: "2026-05-12", emoji: "🐶", tags: ["Rare Color", "DNA Tested"],
  },
  {
    id: "m3", type: "kitten", title: "British Shorthair Kittens", description: "Blue and lilac colors, TICA registered, socialized with kids",
    price: 1800, currency: "USD", breed: "British Shorthair", species: "cat", age: "12 weeks", gender: "female",
    location: "Seattle, WA", sellerName: "Misty Paws Cattery", sellerRating: 5.0, sellerVerified: true,
    vaccinated: true, microchipped: false, pedigree: true, healthChecked: true, createdAt: "2026-05-08", emoji: "🐈", tags: ["TICA", "Socialized"],
  },
  {
    id: "m4", type: "service", title: "Mobile Pet Grooming", description: "Full grooming service at your door — bath, haircut, nails, ears",
    price: 85, currency: "USD", location: "San Francisco, CA", sellerName: "Paws & Claws Mobile",
    sellerRating: 4.8, sellerVerified: true, createdAt: "2026-05-01", emoji: "✂️", tags: ["Mobile", "Full Service"],
  },
  {
    id: "m5", type: "product", title: "Smart Pet Camera", description: "360° HD camera with treat dispenser, two-way audio, night vision",
    price: 79, currency: "USD", location: "Ships nationwide", sellerName: "PetTech Store",
    sellerRating: 4.6, sellerVerified: true, createdAt: "2026-04-28", emoji: "📷", tags: ["Smart Home", "Best Seller"],
  },
  {
    id: "m6", type: "puppy", title: "Corgi Puppies", description: "Pembroke Welsh Corgi, tri-color, champion bloodline",
    price: 3200, currency: "USD", breed: "Pembroke Welsh Corgi", species: "dog", age: "9 weeks", gender: "male",
    location: "Denver, CO", sellerName: "Rocky Mountain Corgis", sellerRating: 4.8, sellerVerified: true,
    vaccinated: true, microchipped: true, pedigree: true, healthChecked: true, createdAt: "2026-05-14", emoji: "🐕", tags: ["Champion Line"],
  },
];
