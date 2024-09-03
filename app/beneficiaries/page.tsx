"use client"
import { Input } from "@nextui-org/input";
import { SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "@nextui-org/pagination";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";


export default function Beneficiaries({ _beneficiaries } : any) {

   useEffect(() => {
      try {
         const fetchBeneficiaries = async () => {
            const response = await fetch('http://192.168.2.194:3080/api/persons');
            if (!response.ok) {
               throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setBeneficiaries(data);
         };
         fetchBeneficiaries();
      } catch(e) {
         console.log("error")
         console.log(e)
      }
   }, [])

   const router = useRouter()

   const [beneficiaries, setBeneficiaries] = useState<any[]>([]);

   const [ filterValue, setFilterValue ] = useState("")
   const [ page, setPage ] = useState(1)
   const [ rowsPerPage, setRowsPerPage ] = useState(4)
   const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({
      column: "first_name",
      direction: "ascending"
   })

   type Beneficiary = typeof beneficiaries[0]

   const pages = Math.ceil(beneficiaries.length / rowsPerPage)
   const hasSearchFilter = Boolean(filterValue)

   const filteredItems = useMemo(() => {
      let filteredBeneficiaries = [...beneficiaries]
      if(hasSearchFilter) {
         filteredBeneficiaries = filteredBeneficiaries.filter((beneficiary) =>
            beneficiary.first_name.toLowerCase().includes(filterValue.toLocaleLowerCase())
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
      return [...items].sort((a: Beneficiary, b: Beneficiary) => {
         const first = a[sortDescriptor.column as keyof Beneficiary] as number;
         const second = b[sortDescriptor.column as keyof Beneficiary] as number;
         const cmp = first < second ? -1 : first > second ? 1 : 0;
         return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
   }, [sortDescriptor, items]);

   const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value))
      setPage(1)
   }, [])

   const onSearchChange = useCallback((value?: string) => {
      if(value) {
         setFilterValue(value)
         setPage(1)
      } else {
         setFilterValue("")
      }
   }, [])

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
                  value={filterValue}
                  onClear={() => setFilterValue("")}
                  onValueChange={onSearchChange}
               />
            </div>
            <div className="flex justify-between items-center">
               <span className="text-default-400 text-small"> Total {beneficiaries.length}</span>
               <label className="flex items-center text default-400 text-small">
                  Filas por página:
                  <select
                     className="bg-transparent outline-none text-default-400 text-small"
                     onChange={onRowsPerPageChange}
                  >
                     <option value="5">5</option>
                     <option value="10">10</option>
                     <option value="15">15</option>
                  </select>
               </label>
            </div>
         </div>
      )
   }, [filterValue, onSearchChange, beneficiaries.length, hasSearchFilter, onRowsPerPageChange ])

   const bottomContent = useMemo(() => {
      const classNames = {
         cursor: "bg-foreground text-background"
      }
      return (
         <div data-testid="pagination" className="py-2 px-2 flex justify-between items-center">
            <Pagination
               showControls
               classNames={classNames}
               color="default"
               isDisabled={hasSearchFilter}
               page={page}
               variant="light"
               total={pages}
               onChange={setPage}
            />
         </div>
      )
   }, [items.length, page, hasSearchFilter, pages])

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

   const handleViewPerson = (id: number) => {
      router.push(`/beneficiary/${id}`)
   }

   const renderCell = useCallback((beneficiary:any , columnKey:any) => {
      const cellValue = beneficiary[columnKey]
      switch(columnKey) {
         case "actions":
            return (
               <div className="relative flex justify-end items-center gap-2">
                  <Dropdown className="bg-background border-1 border-default-200">
                     <DropdownTrigger>
                        <Button data-testid="show" isIconOnly radius='full' size="sm" variant="light">
                           <FontAwesomeIcon  size="sm" icon={faEllipsisVertical}/>
                        </Button>
                     </DropdownTrigger>
                     <DropdownMenu data-testid="menu">
                        <DropdownItem onClick={() => handleViewPerson(beneficiary.id)}>Ver persona</DropdownItem>
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
         sortDescriptor={sortDescriptor}
         onSortChange={setSortDescriptor}
         shadow="md"
      >
         <TableHeader columns={headerColumns}>
            {(column:any) => (
               <TableColumn
                  key={column.key}
                  align={column.key === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
               >
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
