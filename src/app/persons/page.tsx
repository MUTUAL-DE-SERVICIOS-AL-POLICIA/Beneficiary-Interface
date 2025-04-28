"use client";
import { getPersons } from "@/api/person/api";
import { TableComponent } from "@/components/persons";
import { personTableHeaders as headerColumns } from "@/config/static";
import { usePersons } from "@/utils/hooks/usePersons";

export default function Persons() {
  const { error, personsData, total } = usePersons();

  return (
    <TableComponent
      data={personsData}
      error={error}
      getData={getPersons}
      headerColumns={headerColumns}
      startPage={1}
      startRowsPerPage={10}
      total={total}
    />
  );
}
