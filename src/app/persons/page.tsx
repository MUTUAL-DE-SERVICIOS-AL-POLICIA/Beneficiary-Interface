import { Card } from "@heroui/card";

import { TableComponent } from "@/components/persons";
import { AlertServer } from "@/components/common";
import { getUserContext } from "@/api/auth/context";
import { hubPublicUrl } from "@/utils/helpers/urls";

interface Column {
  id: number;
  key?: string;
  name: string;
  sortable?: boolean;
}

export default async function Persons() {
  const { permissions } = await getUserContext();
  const canReadPersons = permissions.some(
    (permission) => permission.resource === "persons" && permission.scopes.includes("read"),
  );
  if (!canReadPersons) {
    return (
      <AlertServer
        color="warning"
        description="No tiene permiso para consultar personas."
        href={hubPublicUrl("/apphub").toString()}
      />
    );
  }
  const personTableHeaders: Column[] = [
    { id: 1, name: "PRIMER NOMBRE", key: "firstName", sortable: true },
    { id: 2, name: "SEGUNDO NOMBRE", key: "secondName", sortable: true },
    { id: 3, name: "APELLIDO PATERNO", key: "lastName", sortable: true },
    { id: 4, name: "APELLIDO MATERNO", key: "mothersLastName", sortable: true },
    { id: 5, name: "CARNET IDENTIDAD", key: "identityCard", sortable: true },
    { id: 6, name: "GENERO", key: "gender" },
    { id: 7, name: "ACCIÓN", key: "actions" },
  ];

  return (
    <section className="flex justify-center md:flex-row flex-wrap gap-1 h-[calc(100vh-90px)]">
      <Card className="flex-1 rounded-small border-default-100 dark:border-default-200 p-2 h-full w-full overflow-y-auto">
        <TableComponent
          headerColumns={personTableHeaders}
          startPage={1}
          startRowsMay={14}
          startRowsMen={10}
        />
      </Card>
    </section>
  );
}
