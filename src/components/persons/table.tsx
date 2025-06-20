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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { PersonInfoIcon, SearchIcon } from "@/components/common";
import { Column } from "@/utils/interfaces";

interface PropsTable {
  data: any;
  total: number;
  headerColumns: Column[];
  startPage: number;
  getData: (
    rowsPerPage: number,
    page?: number,
    searchValue?: string | undefined,
    orderBy?: string | undefined,
    order?: string | undefined,
  ) => Promise<any>;
  error: boolean;
}

export const TableComponent = ({ headerColumns, data, total, startPage, getData, error }: PropsTable) => {
  const router = useRouter();

  const [filterValue, setFilterValue] = useState<string>("");
  const [page, setPage] = useState(startPage);
  const [startRowsPerPage, setStartRowsPerPage] = useState(15);
  const [rowsPerPage, setRowsPerPage] = useState(startRowsPerPage);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [filtered, setFiltered] = useState<Item[]>(data);
  const [all, setAll] = useState<number>(Number.isFinite(total) ? total : 0);

  type Item = (typeof data)[0];

  const hasSearchFilter = Boolean(filterValue);
  const pages = Math.ceil(all / rowsPerPage);

  const [debouncedFilterValue] = useDebounce(filterValue, 200);

  useEffect(() => {
    if (error) {
      addToast({
        title: "Ocurrió un error",
        description: "Error al obtener los datos",
        color: "danger",
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
    }

    return;
  }, [error]);
  useEffect(() => {
    const updateRowsPerPage = () => {
      const width = window.innerWidth;

      if (width >= 1536) {
        setRowsPerPage(15);
        setStartRowsPerPage(15);
      } else {
        setRowsPerPage(8);
        setStartRowsPerPage(8);
      }
    };

    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);

    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);
  useEffect(() => {
    const fetchFilteredItems = async () => {
      try {
        const { persons, total } = await getData(
          rowsPerPage,
          page,
          hasSearchFilter ? debouncedFilterValue.toLowerCase() : undefined,
          sortDescriptor.column.toString(),
          sortDescriptor.direction.toString() == "ascending" ? "ASC" : "DESC",
        );

        setFiltered(persons);
        setAll(Number.isFinite(total) ? total : 0);
      } catch {
        addToast({
          title: "Ocurrió un error",
          description: "Error al obtener los datos",
          color: "danger",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });

        return;
      }
    };

    fetchFilteredItems();
  }, [debouncedFilterValue, rowsPerPage, sortDescriptor]);

  const handlePageChange = async (newPage: number) => {
    try {
      const searchValue = hasSearchFilter ? debouncedFilterValue.toLowerCase() : undefined;
      const { persons } = await getData(
        rowsPerPage,
        newPage,
        searchValue,
        sortDescriptor.column.toString(),
        sortDescriptor.direction.toString() == "ascending" ? "ASC" : "DESC",
      );

      setFiltered(persons);
      setPage(newPage);
    } catch {
      addToast({
        title: "Ocurrió un error",
        description: "Error al cambiar de página",
        color: "danger",
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });

      return;
    }
  };

  const bottomContent = useMemo(() => {
    const classNames = {
      wrapper: "gap-1",
      cursor: "bg-foreground text-background font-bold w-15 text-small px-1 py-0",
      item: "w-15 px-1 text-small",
    };

    return (
      <div className="py-2 px-2 flex justify-between items-center" data-testid="pagination">
        <Pagination
          showControls
          classNames={classNames}
          color="default"
          page={page}
          total={pages}
          variant="light"
          onChange={handlePageChange}
        />
      </div>
    );
  }, [page, pages, filterValue, rowsPerPage, sortDescriptor]);

  const onRowsPerPageChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    const newRowsPerPage = Number(e.target.value);

    setRowsPerPage(Number(newRowsPerPage));
    const { persons } = await getData(newRowsPerPage);

    setFiltered(persons);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setFiltered(data);
    setRowsPerPage(10);
  }, [data]);

  const topContent = useMemo(() => {
    const classNames = {
      base: "w-full sm:max-w-[44%]",
      inputWrapper: "border-1",
    };
    const isDisabled = all < rowsPerPage;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 item-end">
          <Input
            isClearable
            classNames={classNames}
            placeholder="Buscar por nombres, apellidos o carnet de identidad"
            size="sm"
            startContent={<SearchIcon />}
            value={filterValue}
            variant="bordered"
            onClear={onClear}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-700 text text-small">
            Total: <b>{all}</b>
          </span>
          <label className="flex items-center text default-400 text-small">
            Filas por página:
            <select
              className="text-default-700 text-small text-black dark:text-white"
              disabled={isDisabled}
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
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
    );
  }, [filterValue, all, rowsPerPage]);

  const renderCell = useCallback((item: Item, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex justify-center gap-2">
            <Tooltip content="ver" placement="right">
              <Button
                isIconOnly
                size="sm"
                variant="bordered"
                onPress={() => router.push(`/persons/${item.uuidColumn}`)}
              >
                <PersonInfoIcon />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <Table
      isCompact
      removeWrapper
      aria-label="Table of content"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={classNames}
      data-testid="persons-table"
      selectionMode="single"
      shadow="lg"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column: Column) => (
          <TableColumn
            key={column.key}
            align={column.key == "identityCard" ? "end" : "start"}
            allowsSorting={column.sortable}
            className="text-default-900 font-semibold"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"Sin datos"} items={[...filtered]}>
        {(item: Column) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell className="text-default-600">{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
