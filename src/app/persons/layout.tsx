import { ReactNode } from "react";

import { PersonsProvider } from "@/utils/context/PersonsContext";
import { getPersons } from "@/api/person/api";

export const dynamic = "force-dynamic";

export default async function PersonsLayout({ children }: { children: ReactNode }) {
  const { error, persons, total } = await getPersons(10, 1, "", "id");

  return (
    <PersonsProvider error={error} persons={persons} total={total}>
      <div>{children}</div>
    </PersonsProvider>
  );
}
