"use client";
import React, { createContext } from "react";

import { Person, PersonAffiliate } from "@/domain";

interface PersonContextProps {
  personData: Person;
  personAffiliateData: PersonAffiliate[];
  error: boolean;
}

export const PersonContext = createContext<PersonContextProps | undefined>(undefined);

export const PersonProvider: React.FC<{
  person: Person;
  personAffiliate: PersonAffiliate[];
  error: boolean;
  children: React.ReactNode;
}> = ({ person, personAffiliate, error, children }) => {
  return (
    <PersonContext.Provider
      value={{
        personData: person,
        personAffiliateData: personAffiliate,
        error: error,
      }}
    >
      {children}
    </PersonContext.Provider>
  );
};
