"use client";
import { TableComponent } from "@/components/table";
import { getPersons } from "@/api/person/api";
import { beneficiaryTableHeaders as headerColumns } from "@/config/static";
import { usePersons } from "@/hooks/useContext";

export default function Beneficiaries() {
  const { error, personsData, total } = usePersons();
  return (
    <TableComponent
      headerColumns={headerColumns}
      data={personsData}
      total={total}
      startPage={1}
      startRowsPerPage={10}
      getData={getPersons}
      error={error}
    />
  );
}
