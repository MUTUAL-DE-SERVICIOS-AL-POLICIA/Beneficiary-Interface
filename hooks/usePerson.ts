import { PersonContext } from "@/context/PersonContext";
import { useContext } from "react";

export const usePerson = () => {
  const context = useContext(PersonContext);

  if (context === undefined) {
    throw new Error("usePerson debe usarse con un PersonProvider");
  }

  return context;
};
