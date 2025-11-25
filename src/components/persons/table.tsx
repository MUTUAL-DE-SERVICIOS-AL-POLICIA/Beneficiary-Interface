"use client";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { addToast } from "@heroui/toast";
import { Tooltip } from "@heroui/tooltip";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { getPersons } from "@/api/person";
import { PersonInfoIcon, SearchIcon } from "@/components";
import { Column } from "@/utils/interfaces";

interface PropsTable {
  headerColumns: Column[];
  startPage: number;
  startRowsMay: number;
  startRowsMen: number;
}

export const TableComponent = ({ headerColumns, startPage, startRowsMay, startRowsMen }: PropsTable) => {
  const router = useRouter();
  const pathname = usePathname();

  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(startPage);
  const [rowsPerPage, setRowsPerPage] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1536 ? startRowsMay : startRowsMen,
  );
  const [startRowsPerPage, setStartRowsPerPage] = useState(startRowsMay);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [filtered, setFiltered] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [debouncedFilterValue] = useDebounce(filterValue, 200);
  const hasSearchFilter = Boolean(filterValue);
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const fetchData = useCallback(
    async (options?: { page?: number; rows?: number; filter?: string }) => {
      const p = options?.page ?? page;
      const rpp = options?.rows ?? rowsPerPage;
      const filter = options?.filter ?? (hasSearchFilter ? debouncedFilterValue.toLowerCase() : undefined);

      const { error, persons, total } = await getPersons(
        rpp,
        p,
        filter,
        sortDescriptor.column.toString(),
        sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
      );

      if (error) {
        addToast({
          title: "Error",
          description: "No se pudieron obtener los datos",
          color: "danger",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });
      }

      setFiltered(persons);
      setTotalItems(total || 0);
    },
    [debouncedFilterValue, page, rowsPerPage, sortDescriptor, hasSearchFilter],
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setRowsPerPage(startRowsMay);
        setStartRowsPerPage(startRowsMay);
      } else {
        setRowsPerPage(startRowsMen);
        setStartRowsPerPage(startRowsMen);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [startRowsMay, startRowsMen]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRows = Number(e.target.value);

    setRowsPerPage(newRows);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setFilterValue(value || "");
    setPage(1);
  };

  const renderCell = (item: any, columnKey: any) => {
    if (columnKey === "actions") {
      return (
        <div className="flex justify-center gap-2">
          <Tooltip content="Ver" placement="right">
            <Button
              isIconOnly
              size="sm"
              variant="bordered"
              onPress={() => router.push(`${pathname}/${item.uuidColumn}`)}
            >
              <PersonInfoIcon />
            </Button>
          </Tooltip>
        </div>
      );
    }

    return item[columnKey as keyof any];
  };

  return (
    <Table
      isCompact
      removeWrapper
      aria-label="Table of content"
      bottomContent={<Pagination showControls page={page} total={totalPages} onChange={handlePageChange} />}
      selectionMode="single"
      shadow="lg"
      sortDescriptor={sortDescriptor}
      topContent={
        <div className="flex flex-col gap-4">
          <Input
            isClearable
            placeholder="Buscar por Carnet de Identidad, Nombres o Apellidos"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => handleSearchChange("")}
            onValueChange={handleSearchChange}
          />
          <div className="flex justify-between items-center">
            <span>
              Total: <b>{totalItems}</b>
            </span>
            <label className="flex items-center gap-2">
              Filas por página:
              <select
                className="text-default-700 text-small dark:text-white"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value={startRowsPerPage}>{startRowsPerPage}</option>
                <option value={Math.ceil((startRowsPerPage * 2) / 10) * 10}>
                  {Math.ceil((startRowsPerPage * 2) / 10) * 10}
                </option>
                <option value={Math.ceil((startRowsPerPage * 3) / 10) * 10}>
                  {Math.ceil((startRowsPerPage * 3) / 10) * 10}
                </option>
              </select>
            </label>
          </div>
        </div>
      }
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column: Column) => (
          <TableColumn
            key={column.key}
            align={column.key === "identityCard" ? "end" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="Sin datos" items={filtered}>
        {(item: Column) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
