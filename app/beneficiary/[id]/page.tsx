"use client"

import { Accordion, AccordionItem }             from "@nextui-org/accordion"
import { Avatar }                               from "@nextui-org/avatar"
import { Card, CardBody, CardHeader }           from "@nextui-org/card"
import { Divider }                              from "@nextui-org/divider"
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox"
import { useParams }                            from "next/navigation"
import { useEffect, useState }                  from "react"
import { apiClient }                            from "@/services"

import fullName                                 from "@/helpers/utils"
import Hands                                    from "@/components/hands"
import { sidebarConfig, SidebarItem }           from "@/config/static"
import { AccordionComponent }                   from "@/components/accordion"


export default function Beneficiary () {
   const { id } = useParams()

   const [ beneficiary, setBeneficiary ] = useState<any>({})

   useEffect(() => {
      try {
         apiClient.GET(`api/persons/${id}`)
            .then((response:any) => {
               setBeneficiary(response)
            })
            .catch((error: any) => {
               throw error
            })
      } catch(e) {
         console.log(e)
      }
   }, [])

   const itemClasses = {
      base:      "py-0 my-0 overflow-hidden",
      title:     "font-normal text-medium",
      trigger:   "px-2 py-10 data-[hover=true]:bg-default-100 h-14 flex items-center rounded-small",
      indicator: "text-medium",
      content:   "text-small py-0",
   }

   return (
      <div className="flex flex-row gap-4 w-[1280px]">
         <div className="flex flex-col">
            <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-100 mb-3">
               <CardHeader className="justify-between">
                  <div className="flex gap-5 items-center justify-center my-4">
                     { beneficiary && (
                        <div className="flex flex-col gap-1 items-center mx-8">
                           <h4 className="text-small font-semibold leading-none text-default-700">
                              SUB TENIENTE { id }
                           </h4>
                           <Avatar showFallback isBordered radius="md" size="lg" src="https://nextui.org/avatars/avatars1.png" className="my-2"/>
                           <h4 className="text-small font-semibold leading-none text-default-800 text-pretty text-center">
                              { fullName({ first_name: beneficiary.first_name, second_name: beneficiary.second_name, last_name: beneficiary.last_name, mothers_last_name: beneficiary.mothers_last_name})}
                           </h4>
                           <div className="flex gap-1">
                              <p className="font-semibold text-default-800 text-small"> NUP: </p>
                              <p className="text-default-600 text-small">{ beneficiary.id } </p>
                           </div>
                           <div className="flex gap-1">
                              <p className="font-semibold text-default-800 text-small"> C.I. </p>
                              <p data-testid="ci" className="text-default-600 text-small">
                                 { beneficiary.identity_card }
                              </p>
                           </div>
                        </div>
                     )}
                  </div>
               </CardHeader>
               <Divider/>
               <CardBody>
                  <Accordion
                     isCompact
                     showDivider={ false }
                     itemClasses={ itemClasses }
                  >
                     { sidebarConfig.sidebarItems.slice(0, 2).map((sidebarItem: SidebarItem) => (
                        <AccordionItem
                           key={ sidebarItem.key }
                           data-testid="expanded"
                           textValue="menu1"
                           title={
                              <Listbox
                                 variant="flat"
                                 aria-label="Listbox menu data general"
                              >
                                 <ListboxSection title={ sidebarItem.topTitle } showDivider>
                                    <ListboxItem
                                       key={ sidebarItem.key }
                                       description ={ sidebarItem.description }
                                       startContent={ sidebarItem.icon }
                                       className="m-0 p-0"
                                    >
                                       { sidebarItem.title }
                                    </ListboxItem>
                                 </ListboxSection>
                              </Listbox>
                           }
                        >
                           { sidebarItem.subMenu && sidebarItem.subMenu.length && (
                              <Listbox variant="flat" aria-label="sub listbox">
                                 <ListboxSection>
                                    { sidebarItem.subMenu.map((menu) => (
                                       <ListboxItem
                                          key       ={ menu.key }
                                          endContent={ menu.icon }
                                       >
                                          { menu.title }
                                       </ListboxItem>
                                    ))}
                                 </ListboxSection>
                              </Listbox>
                           )}
                        </AccordionItem>
                     ))}
                  </Accordion>
               </CardBody>
            </Card>
            { sidebarConfig.sidebarItems.slice(2).map((sidebarItem: SidebarItem) => (
               <AccordionComponent { ...sidebarItem } />
            ))}
         </div>
         <div className="flex flex-col">
            <Card
               className="grow border-small rounded-small border-default-200 dark:border-default-100"
               style={{
                  width:  '940px',
                  height:  'auto',
               }}
            >
               <CardBody className="justify-between">
                  <div className="flex flex-row gap-5 md:py-5 md:px-4">
                     <div className="flex-col">
                        <Hands/>
                     </div>
                     <div className="flex-col">
                        <h4>Calidad de la imagen</h4>
                     </div>
                  </div>
               </CardBody>
            </Card>
         </div>
   </div>
   )
}