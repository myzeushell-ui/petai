import React, { createContext, useContext, useState } from "react";
import { Pet } from "../types";
import { demoPets } from "../data/demoPets";

interface PetContextType {
  activePet: Pet;
  pets: Pet[];
  switchPet: (id: string) => void;
}

const PetContext = createContext<PetContextType>({
  activePet: demoPets[0],
  pets: demoPets,
  switchPet: () => {},
});

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState(demoPets[0].id);
  const activePet = demoPets.find((p) => p.id === activeId) ?? demoPets[0];

  return (
    <PetContext.Provider value={{ activePet, pets: demoPets, switchPet: setActiveId }}>
      {children}
    </PetContext.Provider>
  );
}

export const usePet = () => useContext(PetContext);
