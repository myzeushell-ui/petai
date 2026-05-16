import type { Pet, User } from "@/types";

export const demoUser: User = {
  id: "demo-user-001",
  name: "Alex Johnson",
  email: "alex@demo.petai.app",
  avatarUrl: undefined,
  pets: ["pet-001", "pet-002"],
};

export const demoPets: Pet[] = [
  {
    id: "pet-001",
    name: "Luna",
    species: "dog",
    breed: "Golden Retriever",
    age: 4,
    weight: 28.5,
    weightUnit: "kg",
    gender: "female",
    neutered: true,
    color: "#F59E0B",
    ownerId: "demo-user-001",
    createdAt: "2022-03-15T10:00:00Z",
    healthScore: 87,
  },
  {
    id: "pet-002",
    name: "Mochi",
    species: "cat",
    breed: "British Shorthair",
    age: 2,
    weight: 4.2,
    weightUnit: "kg",
    gender: "male",
    neutered: true,
    color: "#6366F1",
    ownerId: "demo-user-001",
    createdAt: "2024-01-10T10:00:00Z",
    healthScore: 92,
  },
];

export const primaryPet = demoPets[0];
