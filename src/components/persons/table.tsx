"use client";
import type { SortDescriptor } from "@heroui/react";

import { Button, Pagination, SearchField, Table, Tooltip, toast } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { getPersons } from "@/api/person";
import { PersonInfoIcon } from "@/components";
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

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const filter = hasSearchFilter ? debouncedFilterValue.toLowerCase() : undefined;
      const { error, persons, total } = await getPersons(
        rowsPerPage,
        page,
        filter,
        String(sortDescriptor.column),
        sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
      );

      if (cancelled) return;

      if (error) {
        toast.danger("Error al obtener los datos de la tabla");

        return;
      }

      setFiltered(persons);
      setTotalItems(total || 0);
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [page, rowsPerPage, debouncedFilterValue, hasSearchFilter, sortDescriptor]);

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
          <Tooltip>
            <Button
              isIconOnly
              aria-label="Ver persona"
              size="sm"
              variant="secondary"
              onPress={() => router.push(`${pathname}/${item.uuidColumn}`)}
            >
              <PersonInfoIcon />
            </Button>
            <Tooltip.Content showArrow placement="right">
              <Tooltip.Arrow />
              <span>Ver</span>
            </Tooltip.Content>
          </Tooltip>
        </div>
      );
    }

    return item[columnKey as keyof any];
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <SearchField
          fullWidth
          aria-label="Buscar personas"
          name="persons-search"
          value={filterValue}
          onChange={handleSearchChange}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Buscar por Carnet de Identidad, Nombres o Apellidos" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <div className="flex items-center justify-between gap-4">
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
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Tabla de personas"
            className="min-w-full"
            selectionMode="single"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header columns={headerColumns}>
              {(column: Column) => (
                <Table.Column
                  key={column.key ?? String(column.id)}
                  allowsSorting={column.sortable}
                  className={column.key === "identityCard" ? "text-end" : "text-start"}
                  id={column.key ?? String(column.id)}
                  isRowHeader={column.key === "firstName"}
                >
                  {column.sortable
                    ? ({ sortDirection }: { sortDirection: "ascending" | "descending" | undefined }) => (
                        <Table.SortableColumnHeader sortDirection={sortDirection}>
                          {column.name}
                        </Table.SortableColumnHeader>
                      )
                    : column.name}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body
              items={filtered}
              renderEmptyState={() => <div className="p-4 text-center">Sin datos</div>}
            >
              {(item: any) => (
                <Table.Row key={item.id} id={item.id}>
                  <Table.Collection items={headerColumns}>
                    {(column) => (
                      <Table.Cell className={column.key === "identityCard" ? "text-end" : undefined}>
                        {renderCell(item, column.key ?? String(column.id))}
                      </Table.Cell>
                    )}
                  </Table.Collection>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        {totalPages > 1 && (
          <Table.Footer className="flex justify-end px-2 py-3">
            <Pagination size="sm">
              <Pagination.Summary>
                Página {page} de {totalPages}
              </Pagination.Summary>
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={page <= 1}
                    onPress={() => handlePageChange(Math.max(1, page - 1))}
                  >
                    <Pagination.PreviousIcon />
                    <span>Anterior</span>
                  </Pagination.Previous>
                </Pagination.Item>
                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={page >= totalPages}
                    onPress={() => handlePageChange(Math.min(totalPages, page + 1))}
                  >
                    <span>Siguiente</span>
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </Table.Footer>
        )}
      </Table>
    </div>
  );
};
