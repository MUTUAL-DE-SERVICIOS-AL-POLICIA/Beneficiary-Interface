"use client";
import { getPersons } from "@/api/person/api";
import { TableComponent } from "@/components/persons";
import { usePersons } from "@/utils/hooks/usePersons";
import { subtitle } from "../../components/common";
import { Fragment } from "react";

interface Column {
  id: number;
  key?: string;
  name: string;
  sortable?: boolean;
}
export default function Persons() {
  const { error, personsData, total } = usePersons();
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
    <Fragment>
      <span className={subtitle({ fullWidth: true })}>Personas registradas</span>
      <TableComponent
        data={personsData}
        error={error}
        getData={getPersons}
        headerColumns={personTableHeaders}
        startPage={1}
        startRowsPerPage={10}
        total={total}
      />
    </Fragment>
  );
}
