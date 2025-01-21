import { PersonsContext } from "@/context/PersonsContext";
import { useContext } from "react";

export const usePersons = () => {
  const context = useContext(PersonsContext);

  if (context === undefined) {
    throw new Error("usePersons debe usarse con un PersonsProvider");
  }
  return context;
};
