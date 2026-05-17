"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { demoPets } from "@/data/demoPets";
import type { Pet } from "@/types";

interface PetContextValue {
  activePet: Pet;
  setActivePet: (pet: Pet) => void;
  pets: Pet[];
}

const PetContext = createContext<PetContextValue>({
  activePet: demoPets[0],
  setActivePet: () => {},
  pets: demoPets,
});

export function PetProvider({ children }: { children: ReactNode }) {
  const [activePet, setActivePet] = useState<Pet>(demoPets[0]);
  return (
    <PetContext.Provider value={{ activePet, setActivePet, pets: demoPets }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  return useContext(PetContext);
}
