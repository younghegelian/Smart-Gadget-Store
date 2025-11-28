import React, { createContext, useContext, useState, ReactNode } from "react";
import { Laptop } from "@/data/laptops";

interface CompareContextType {
  selectedLaptops: Laptop[];
  addToCompare: (laptop: Laptop) => void;
  removeFromCompare: (laptopId: string) => void;
  clearCompare: () => void;
  isInCompare: (laptopId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLaptops, setSelectedLaptops] = useState<Laptop[]>([]);

  const addToCompare = (laptop: Laptop) => {
    if (selectedLaptops.length < 3 && !isInCompare(laptop.id)) {
      setSelectedLaptops([...selectedLaptops, laptop]);
    }
  };

  const removeFromCompare = (laptopId: string) => {
    setSelectedLaptops(selectedLaptops.filter((l) => l.id !== laptopId));
  };

  const clearCompare = () => {
    setSelectedLaptops([]);
  };

  const isInCompare = (laptopId: string) => {
    return selectedLaptops.some((l) => l.id === laptopId);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedLaptops,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
