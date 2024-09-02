"use client"
import { Input } from "@nextui-org/input";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "@nextui-org/pagination";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";

export default function Beneficiaries() {

   const [beneficiaries, setBeneficiaries] = useState<any[]>([]);

   const [ filterValue, setFilterValue ] = useState("")
   const [ page, setPage ] = useState(1)
   const [ rowsPerPage, setRowsPerPage ] = useState(2)
   const [ sortDescriptor, setSortDescriptor ] = useState({
      column: "age",
      direction: "ascending"
   })
   const hasSearchFilter = Boolean(filterValue)

   useEffect(() => {
      const fetchUsers = async () => {
         const response = await fetch('/api/persons');
         const data = await response.json();
         setBeneficiaries(data);
      };
      fetchUsers();
   }, [])

   const filteredItems = useMemo(() => {
      let filteredBeneficiaries = [...beneficiaries]

      if(hasSearchFilter) {
         filteredBeneficiaries = filteredBeneficiaries.filter((beneficiarie) => 
            beneficiarie.name.toLowerCase().includes(filterValue.toLocaleLowerCase())
         )
      }
      return filteredBeneficiaries
   }, [beneficiaries, filterValue])

   const items = useMemo(() => {
      const start = (page - 1) * rowsPerPage
      const end = start + rowsPerPage

      return filteredItems.slice(start, end)
   }, [page, filteredItems, rowsPerPage])

   const sortedItems = useMemo(() => {
      return [...items].sort((a, b) => {
         const first = a[sortDescriptor.column];
         const second = b[sortDescriptor.column];
         const cmp = first < second ? -1 : first > second ? 1 : 0;
         return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
   }, [sortDescriptor, items]);

   const topContent = useMemo(() => {
      const classNames = {
         base: "w-full sm:max-w-[44%]",
         inputWrapper: "border-1"
      }
      return (
         <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
               <Input
                  isClearable
                  classNames={classNames}
                  placeholder="Buscar por..."
                  size="sm"
                  variant="bordered"
                  startContent={<FontAwesomeIcon size="sm" icon={faSearch} />}
               />
            </div>
         </div>
      )
   }, [])

   const bottomContent = useMemo(() => {
      const classNames = {
         cursor: "bg-foreground text-brackground"
      }
      return (
         <div data-testid="pagination" className="py-2 px-2 flex justify-between items-center">
            <Pagination
               showControls
               classNames={classNames}
               color="default"
               variant="light"
               total={12}
            />
            <span className="text-small text-default-400">
               Todos los items seleccionados
            </span>
         </div>
      )
   }, [])

   const classNames = useMemo(
      () => ({
         wrapper: ["max-h-[382px]", "max-w-3xl"],
         th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
         td: [
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            "group-data-[middle=true]:before:rounded-none",
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none"
         ]
      }),
      [],
   )

   const renderCell = useCallback((beneficiary:any , columnKey:any) => {
      const cellValue = beneficiary[columnKey]
      switch(columnKey) {
         case "actions":
            return (
               <div className="relative flex justify-end items-center gap-2">
                  <Dropdown className="bg-background border-1 border-default-200">
                     <DropdownTrigger>
                        <Button isIconOnly radius='full' size="sm" variant="light">
                        </Button>
                     </DropdownTrigger>
                     <DropdownMenu>
                        <DropdownItem>Ver persona</DropdownItem>
                        <DropdownItem>Editar</DropdownItem>
                     </DropdownMenu>
                  </Dropdown>
               </div>
            )
         default:
            return cellValue
      }
   }, [])

   const headerColumns = [
      { id: 1, name: 'PRIMER NOMBRE', sortable: true, key: 'first_name' },
      { id: 2, name: 'SEGUNDO NOMBRE', sortable: true, key: 'second_name'},
      { id: 3, name: 'APELLIDO PATERNO', sortable: true, key: 'last_name' },
      { id: 4, name: 'APELLIDO MATERNO', sortable: true, key: 'mothers_last_name' },
      { id: 5, name: 'CARNET IDENTIDAD', key: 'identity_card'},
      { id: 6, name: 'PARENTESCO', key: 'gender' },
      { id: 7, name: 'ACCION', key: 'actions'}
   ]

   return (
      <Table
         isCompact
         removeWrapper
         checkboxesProps={{
            classNames: {
               wrapper: "after:bg-foreground after:text-background text-background"
            }
         }}
         aria-label="Table of beneficiaries"
         classNames={classNames}
         topContent={topContent}
         topContentPlacement="outside"
         bottomContent={bottomContent}
         bottomContentPlacement="outside"
         data-testid="beneficiaries-table"
      >
         <TableHeader columns={headerColumns}>
            {(column:any) => (
               <TableColumn key={column.key}>
                  {column.name}
               </TableColumn>
            )}
         </TableHeader>
         <TableBody emptyContent={"Sin datos"} items={sortedItems}>
            {(item:any) => (
               <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
               </TableRow>
            )}
         </TableBody>
      </Table>
   )
}
