"use client";
import { useContext } from "react";

import { PersonsContext } from "@/context/PersonsContext";

export const usePersons = () => {
  const context = useContext(PersonsContext);

  if (context === undefined) {
    throw new Error("usePersons debe usarse con un PersonsProvider");
  }

  return context;
};
