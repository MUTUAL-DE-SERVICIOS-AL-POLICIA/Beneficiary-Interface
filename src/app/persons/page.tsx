"use client";
import { getPersons } from "@/api/person/api";
import { TableComponent } from "@/components/persons";
import { personTableHeaders as headerColumns } from "@/utils/static";
import { usePersons } from "@/utils/hooks/usePersons";
import { subtitle } from "../../components/common";
import { Fragment } from "react";

export default function Persons() {
  const { error, personsData, total } = usePersons();

  return (
    <Fragment>
      <span className={subtitle({ fullWidth: true })}>Personas registradas</span>
      <TableComponent
        data={personsData}
        error={error}
        getData={getPersons}
        headerColumns={headerColumns}
        startPage={1}
        startRowsPerPage={10}
        total={total}
      />
    </Fragment>
  );
}
