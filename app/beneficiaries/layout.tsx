import { getPersons } from "@/api/person/api";
import { PersonsProvider } from "@/context/PersonsContext";
import { ReactNode } from "react";

export default async function BeneficiariesLayout({ children }: { children: ReactNode }) {
  const { error, persons, total } = await getPersons();

  return (
    <PersonsProvider persons={persons} total={total} error={error}>
      <div>{children}</div>
    </PersonsProvider>
  );
}
