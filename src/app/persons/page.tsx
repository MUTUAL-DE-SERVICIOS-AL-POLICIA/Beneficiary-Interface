import { getPersons } from "@/api/person";
import { TableComponent } from "@/components/persons";

interface Column {
  id: number;
  key?: string;
  name: string;
  sortable?: boolean;
}
export default async function Persons() {
  const { error, persons, total } = await getPersons(10, 1, "", "id");

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
    <TableComponent
      data={persons}
      error={error}
      getData={getPersons}
      headerColumns={personTableHeaders}
      startPage={1}
      startRowsPerPage={10}
      total={total}
    />
  );
}
