"use client"
import { useCallback, useEffect, useMemo, useState             } from 'react';
import { useRouter                                             } from 'next/navigation';
import { getBeneficiaries                                      } from '@/app/beneficiaries/service';

import { faEllipsisVertical, faSearch                          } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon                                       } from '@fortawesome/react-fontawesome';

import { Pagination                                            } from '@nextui-org/pagination';
import { Input                                                 } from '@nextui-org/input';
import { Button                                                } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Table, TableColumn, TableHeader, TableBody, TableRow,
         TableCell, SortDescriptor                             } from '@nextui-org/table';


export interface Column {
   id       : number
   key?     : string
   name     : string
   sortable?: boolean
}

interface PropsTable {
   data             : any
   total            : number
   headerColumns    : Column[]
   startPage        : number
   startRowsPerPage : number
}

export const TableComponent = ({ headerColumns, data, total, startPage, startRowsPerPage }: PropsTable ) => {

   const router = useRouter()

   const [ filterValue   , setFilterValue    ] = useState("")
   const [ page          , setPage           ] = useState(startPage)
   const [ rowsPerPage   , setRowsPerPage    ] = useState(startRowsPerPage)
   const [ rows          , setRows           ] = useState(data)
   const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({
      column:    "first_name", //TODO
      direction: "ascending"
   })

   type Item = typeof data[0]

   const hasSearchFilter = Boolean(filterValue)
   const pages           = Math.ceil(total / rowsPerPage)

   const filtered = useMemo(() => {
      let filteredItems = [...rows]
      if(hasSearchFilter) {
         filteredItems = filteredItems.filter((item) =>
            item.first_name.toLowerCase().includes(filterValue.toLocaleLowerCase()) //TODO
         )
      }
      return filteredItems
   }, [ rows, filterValue ])

   const sortedItems = useMemo(() => {
      return [...filtered].sort((a: Item, b: Item) => {
         const first  = a[sortDescriptor.column as keyof Item] as number
         const second = b[sortDescriptor.column as keyof Item] as number
         const cmp    = first < second ? -1 : first > second ? 1 : 0
         return sortDescriptor.direction === "descending" ? -cmp : cmp
      })
   }, [ sortDescriptor, rows ])

   const handleViewPerson = (id: number) => {
      router.push(`/beneficiary/${id}`)
   }

   const handlePageChange = async (newPage: number) => {
      const { persons } =  await getBeneficiaries(rowsPerPage, newPage)
      setRows(persons)
      setPage(newPage)
   }

   /* PAGINATION COMPONENT */
   const bottomContent = useMemo(() => {
      const classNames = {
         cursor: "bg-foreground text-background"
      }
      return (
         <div
            data-testid="pagination"
            className  ='py-2 px-2 flex justify-between items-center'
         >
            <Pagination
               showControls
               color     ="default"
               variant   ="light"
               page      ={page}
               total     ={pages}
               classNames={classNames}
               isDisabled={hasSearchFilter}
               onChange  ={handlePageChange}
            />
         </div>
      )
   }, [ rows.length, page, hasSearchFilter, pages, handlePageChange ])

   /* SEARCH COMPONENT */
   const onRowsPerPageChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newRowsPerPage = Number(e.target.value)
      setRowsPerPage(Number(newRowsPerPage))
      const { persons } = await getBeneficiaries(newRowsPerPage)
      setRows(persons)
   }, [])

   const onSearchChange = useCallback((value?: string) => {
      if(value) {
         setFilterValue(value)
         setPage(1)
      } else
         setFilterValue("")
   }, [])

   const topContent = useMemo(() => {
      const classNames = {
         base:         "w-full sm:max-w-[44%]",
         inputWrapper: "border-1"
      }
      return (
         <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 item-end">
               <Input
                  isClearable
                  size         ="sm"
                  variant      ="bordered"
                  placeholder  ="Buscar por ..."
                  value        ={filterValue}
                  classNames   ={classNames}
                  onClear      ={() => setFilterValue("")}
                  onValueChange={onSearchChange}
                  startContent ={<FontAwesomeIcon size="sm" icon={faSearch} />}
               />
            </div>
            <div className="flex justify-between items-center">
               <span className="text-default-400 text-small"> <b>Total: </b>{total}</span>
               <label className="flex items-center text default-400 text-small">
                  Filas por página:
                  <select
                     onChange ={onRowsPerPageChange}
                     className="bg-transparent outline-none text-default-400 text-small"
                  >
                     <option value={startRowsPerPage     }>{startRowsPerPage     }</option>
                     <option value={startRowsPerPage + 5 }>{startRowsPerPage + 5 }</option>
                     <option value={startRowsPerPage + 10}>{startRowsPerPage + 10}</option>
                  </select>
               </label>
            </div>
         </div>
      )
   }, [ filterValue, onSearchChange, data.length, hasSearchFilter, onRowsPerPageChange ])

   const renderCell = useCallback((item:Item, columnKey:any) => {
      const cellValue = item[columnKey]
      switch(columnKey) {
         case "actions":
            return (
               <div className="relative flex justify-center gap-2">
                  <Dropdown className="bg-background border-1 border-default-200">
                     <DropdownTrigger>
                        <Button data-testid="show" isIconOnly radius='full' size="sm" variant="light">
                           <FontAwesomeIcon size="sm" icon={faEllipsisVertical} />
                        </Button>
                     </DropdownTrigger>
                     <DropdownMenu data-testid="menu">
                        <DropdownItem onClick={() => handleViewPerson(item.id)}>Ver persona</DropdownItem>
                        <DropdownItem>Editar</DropdownItem>
                     </DropdownMenu>
                  </Dropdown>
               </div>
            )
         default:
            return cellValue
      }
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
      []
   )

   return (
      <Table
         isCompact
         removeWrapper
         shadow                ='lg'
         aria-label            ="Table of content"
         selectionMode         ='single'
         classNames            ={classNames}
         topContent            ={topContent}
         topContentPlacement   ='outside'
         bottomContent         ={bottomContent}
         bottomContentPlacement='outside'
         data-testid           ="beneficiaries-table"
         sortDescriptor        ={sortDescriptor}
         onSortChange          ={setSortDescriptor}
      >
         <TableHeader columns={headerColumns}>
            {(column: Column) => (
               <TableColumn
                  key          ={column.key}
                  allowsSorting={column.sortable}
                  className    ='text-default-900'
                  align        ={column.key == 'identity_card' ? 'end' : 'start'}
               >
                  {column.name}
               </TableColumn>
            )}
         </TableHeader>
         <TableBody emptyContent={"Sin datos"} items={sortedItems}>
            {(item: Column) => (
               <TableRow key={item.id}>
                  {(columnKey) =>
                     <TableCell className='text-default-600'>
                        {renderCell(item, columnKey)}
                     </TableCell>
                  }
               </TableRow>
            )}
         </TableBody>
      </Table>
   )
}