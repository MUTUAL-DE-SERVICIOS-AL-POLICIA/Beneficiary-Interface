"use client";
import { createContext } from "react";

interface PersonsContextProps {
  personsData: any;
  total: number;
  error: boolean;
}

export const PersonsContext = createContext<PersonsContextProps | undefined>(undefined);

export const PersonsProvider: React.FC<{
  persons: any;
  total: number;
  error: boolean;
  children: React.ReactNode;
}> = ({ persons, total, error, children }) => {
  return (
    <PersonsContext.Provider
      value={{
        personsData: persons,
        total: total,
        error: error,
      }}
    >
      {children}
    </PersonsContext.Provider>
  );
};
