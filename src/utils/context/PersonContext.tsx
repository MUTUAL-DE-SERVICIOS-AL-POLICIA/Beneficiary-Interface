"use client";
import React, { createContext, useContext, ReactNode } from "react";

import { Person, FinancialEntity, PensionEntity, CityBirth } from "@/utils/interfaces";

interface PersonContextProps {
  person: Person;
  affiliateId: string;
  financialEntity: FinancialEntity;
  pensionEntity: PensionEntity;
  cityBirth: CityBirth;
}

const PersonContext = createContext<PersonContextProps | undefined>(undefined);

PersonContext.displayName = "PersonContext";

export const PersonProvider: React.FC<{
  person: Person;
  affiliateId: string;
  financialEntity: FinancialEntity;
  pensionEntity: PensionEntity;
  cityBirth: CityBirth;
  children: ReactNode;
}> = ({ person, financialEntity, pensionEntity, cityBirth, affiliateId, children }) => (
  <PersonContext.Provider value={{ person, financialEntity, pensionEntity, cityBirth, affiliateId }}>
    {children}
  </PersonContext.Provider>
);

export const usePerson = () => {
  const context = useContext(PersonContext);

  if (!context) {
    throw new Error("usePerson debe usarse dentro de un PersonProvider");
  }

  return context;
};
