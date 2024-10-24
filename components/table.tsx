'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { faEllipsisVertical, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Pagination } from '@nextui-org/pagination';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
} from '@nextui-org/table';
import { useDebounce } from 'use-debounce';
import { Card } from '@nextui-org/card';

export interface Column {
  id: number;
  key?: string;
  name: string;
  sortable?: boolean;
}

interface PropsTable {
  data: any;
  total: number;
  headerColumns: Column[];
  startPage: number;
  startRowsPerPage: number;
  getData: (rowsPerPage: number, page?: number, searchValue?: string | undefined) => Promise<any>;
}

export const TableComponent = ({
  headerColumns,
  data,
  total,
  startPage,
  startRowsPerPage,
  getData,
}: PropsTable) => {
  const router = useRouter();

  const [filterValue, setFilterValue] = useState<string>('');
  const [page, setPage] = useState(startPage);
  const [rowsPerPage, setRowsPerPage] = useState(startRowsPerPage);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'first_name', //TODO
    direction: 'ascending',
  });
  const [filtered, setFiltered] = useState<Item[]>(data);
  const [all, setAll] = useState<number>(total);

  type Item = (typeof data)[0];

  const hasSearchFilter = Boolean(filterValue);
  const pages = Math.ceil(all / rowsPerPage);

  const [debouncedFilterValue] = useDebounce(filterValue, 200);

  const handleViewPerson = (id: number) => {
    // router.push(`/beneficiary/${id}`);
    router.push(`/beneficiary/${id}`);
  };

  useEffect(() => {
    const fetchFilteredItems = async () => {
      if (hasSearchFilter) {
        const searchValue = debouncedFilterValue.toLowerCase();
        const { persons, total } = await getData(rowsPerPage, page, searchValue);
        setFiltered(persons);
        setAll(total);
      } else {
        setAll(total);
      }
    };

    fetchFilteredItems();
  }, [debouncedFilterValue, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...filtered].sort((a: Item, b: Item) => {
      const first = a[sortDescriptor.column as keyof Item] as number;
      const second = b[sortDescriptor.column as keyof Item] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, filtered]);

  const handlePageChange = async (newPage: number) => {
    const searchValue = hasSearchFilter ? debouncedFilterValue.toLowerCase() : undefined;
    const { persons } = await getData(rowsPerPage, newPage, searchValue);
    setFiltered(persons);
    setPage(newPage);
  };

  /* PAGINATION COMPONENT */
  const bottomContent = useMemo(() => {
    const classNames = {
      wrapper: 'gap-1',
      cursor: 'bg-foreground text-background font-bold w-15 text-small px-1 py-0',
      item: 'w-15 px-1 text-small',
    };
    return (
      <div data-testid="pagination" className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          color="default"
          variant="light"
          page={page}
          total={pages}
          classNames={classNames}
          onChange={handlePageChange}
        />
      </div>
    );
  }, [page, pages, filterValue, rowsPerPage]);

  /* SEARCH COMPONENT */
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
      setFilterValue('');
    }
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
    setFiltered(data);
    setRowsPerPage(10);
  }, [data]);

  const topContent = useMemo(() => {
    const classNames = {
      base: 'w-full sm:max-w-[44%]',
      inputWrapper: 'border-1',
    };
    const isDisabled = all < rowsPerPage;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 item-end">
          <Input
            isClearable
            size="sm"
            variant="bordered"
            placeholder="Buscar por ..."
            value={filterValue}
            classNames={classNames}
            onClear={onClear}
            onValueChange={onSearchChange}
            startContent={<FontAwesomeIcon className="text-sm" size="sm" icon={faSearch} />}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-700 text text-small">
            Total: <b>{all}</b>
          </span>
          <label className="flex items-center text default-400 text-small">
            Filas por página:
            <select
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
              className="text-default-700 text-small text-black dark:text-white"
              disabled={isDisabled}
            >
              <option value={startRowsPerPage}>{startRowsPerPage}</option>
              <option value={startRowsPerPage + 5}>{startRowsPerPage + 5}</option>
              <option value={startRowsPerPage + 10}>{startRowsPerPage + 10}</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, all, rowsPerPage]);

  const renderCell = useCallback((item: Item, columnKey: any) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'actions':
        return (
          <div className="relative flex justify-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button data-testid="show" isIconOnly radius="full" size="sm" variant="light">
                  <FontAwesomeIcon size="sm" icon={faEllipsisVertical} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu data-testid="menu">
                <DropdownItem onClick={() => handleViewPerson(item.id)}>Ver persona</DropdownItem>
                <DropdownItem>Editar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const classNames = useMemo(
    () => ({
      wrapper: ['max-h-[382px]', 'max-w-3xl'],
      th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
      td: [
        'group-data-[first=true]:first:before:rounded-none',
        'group-data-[first=true]:last:before:rounded-none',
        'group-data-[middle=true]:before:rounded-none',
        'group-data-[last=true]:first:before:rounded-none',
        'group-data-[last=true]:last:before:rounded-none',
      ],
    }),
    [],
  );

  return (
    <Card className="border-small rounded-small border-default-100 dark:border-default-200 p-10">
      <Table
        isCompact
        removeWrapper
        shadow="lg"
        aria-label="Table of content"
        selectionMode="single"
        classNames={classNames}
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        data-testid="beneficiaries-table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column: Column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.sortable}
              className="text-default-900 font-semibold"
              align={column.key == 'identityCard' ? 'end' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'Sin datos'} items={sortedItems}>
          {(item: Column) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="text-default-600">{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
