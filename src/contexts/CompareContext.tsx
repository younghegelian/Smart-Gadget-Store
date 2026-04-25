// src/contexts/CompareContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

export type CompactLaptop = {
  id: string;        // slug or unique id
  name?: string;
  brand?: string;
  image?: string;
  price?: number;
  currency?: string;
  slug?: string;
  url?: string;
  // keep it open for other fields if you pass entire object
  [k: string]: any;
};

type CompareContextType = {
  selectedLaptops: CompactLaptop[];
  addToCompare: (l: CompactLaptop) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const LS_KEY = "app_compare_list_v1";

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLaptops, setSelectedLaptops] = useState<CompactLaptop[]>([]);

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setSelectedLaptops(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to read compare list", e);
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(selectedLaptops));
    } catch (e) {
      console.warn("Failed to save compare list", e);
    }
  }, [selectedLaptops]);

  const addToCompare = (l: CompactLaptop) => {
    setSelectedLaptops((prev) => {
      // prevent duplicates by id
      if (!l.id) return prev;
      if (prev.some((p) => p.id === l.id)) return prev;
      return [...prev, l];
    });
  };

  const removeFromCompare = (id: string) => {
    setSelectedLaptops((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCompare = () => setSelectedLaptops([]);

  const isInCompare = (id: string) => selectedLaptops.some((p) => p.id === id);

  return (
    <CompareContext.Provider value={{ selectedLaptops, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};
