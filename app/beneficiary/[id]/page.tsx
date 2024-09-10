"use client"

import { faCircleDollarToSlot, faFingerprint, faHeartPulse, faListCheck,
         faMoneyBill1, faPeopleGroup, faPhotoFilm, faPiggyBank, faPuzzlePiece,
         faRibbon, faUserNurse, faUserTie }     from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon }                      from "@fortawesome/react-fontawesome"
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


export default function Beneficiary () {
   const { id } = useParams()

   const [ beneficiary, setBeneficiary ] = useState<any>({})
   const [ selectedKey, setSelectedKey ] = useState("photo")

   useEffect(() => {
      try {
         // apiClient.GET(`api/persons/${id}`)
         //    .then((response:any) => {
         //       setBeneficiary(response)
         //    })
         //    .catch((error: any) => {
         //       throw error
         //    })
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

   const classNames = {
      title:        "text-small text-default-400",
      description:  "font-semibold text-xs text-default-500",
      selectedIcon: "primary"
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
                     showDivider={false}
                     itemClasses={itemClasses}
                  >
                     <AccordionItem
                        key="1"
                        data-testid="expanded"
                        textValue="menu1"
                        title={
                           <Listbox
                              variant="flat"
                              aria-label="Listbox menu data general"
                           >
                              <ListboxSection title="Datos generales de la persona" showDivider>
                                 <ListboxItem
                                    key="person"
                                    description="Información general"
                                    startContent={<FontAwesomeIcon icon={faUserTie} size="lg" />}
                                    className="m-0 p-0"
                                 >
                                    DATOS DE LA PERSONA
                                 </ListboxItem>
                              </ListboxSection>
                           </Listbox>
                        }
                     >
                        <Listbox variant="flat" aria-label="sub listbox">
                           <ListboxSection>
                              <ListboxItem
                                 data-testid="esto"
                                 key="photo"
                                 endContent={<FontAwesomeIcon icon={faPhotoFilm} />}
                                 className={selectedKey === "photo" ? "bg-selected": ""}
                              >
                                 FOTOGRAFIAS
                              </ListboxItem>
                              <ListboxItem
                                 key="huella"
                                 className=""
                                 endContent={<FontAwesomeIcon icon={faFingerprint}/>}
                              >
                                 HUELLAS
                              </ListboxItem>
                           </ListboxSection>
                        </Listbox>
                     </AccordionItem>
                     <AccordionItem
                        hideIndicator={true}
                        key="2"
                        textValue="menu2"
                        title={
                           <Listbox variant="flat" aria-label="Listbox menu police">
                              <ListboxSection title="Datos especificos como policia">
                                 <ListboxItem
                                    key="police"
                                    description="Datos especificos de policia"
                                    startContent={<FontAwesomeIcon icon={faUserNurse} size="lg"/>}
                                    className="m-0 p-0"
                                 >
                                    DATOS DE POLICIA
                                 </ListboxItem>
                              </ListboxSection>
                           </Listbox>
                        }
                     ></AccordionItem>
                  </Accordion>
               </CardBody>
            </Card>
            {/* BENEFICIARIOS */}
            <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-200 mb-3">
               <CardBody>
                  <Accordion
                     isCompact
                     showDivider={false}
                     itemClasses={itemClasses}
                  >
                     <AccordionItem
                        hideIndicator={true}
                        key="beneficiares"
                        textValue="beneficiaries"
                        title={
                           <Listbox variant="flat" aria-label="beneficiaries">
                              <ListboxSection title="Listado de los beneficiarios">
                                 <ListboxItem
                                    key="beneficiaries"
                                    description="Listado de beneficiarios"
                                    startContent={<FontAwesomeIcon icon={faPeopleGroup} size="lg"/>}
                                    className="m-0 p-0"
                                 >
                                    BENEFICIARIOS
                                 </ListboxItem>
                              </ListboxSection>
                           </Listbox>
                        }
                     >
                     </AccordionItem>
                  </Accordion>
               </CardBody>
            </Card>
            {/* APORTES */}
            <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-100 mb-3">
               <CardBody>
                  <Accordion
                  isCompact
                  showDivider={false}
                  itemClasses={itemClasses}
                  >
                  <AccordionItem
                     hideIndicator={true}
                     key="contributions"
                     textValue="contributions"
                     title={
                        <Listbox variant="flat" aria-label="Listbox menu with sections">
                        <ListboxSection title="Listado de aportes">
                           <ListboxItem
                              key="contributions"
                              description="Listado de aportes"
                              startContent={<FontAwesomeIcon size="lg" icon={faCircleDollarToSlot} />}
                              className="m-0 p-0"
                           >
                              APORTES
                              </ListboxItem>
                           </ListboxSection>
                        </Listbox>
                     }
                     ></AccordionItem>
                  </Accordion>
               </CardBody>
            </Card>
            {/* TRAMITES REALIZADOS */}
            <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-100">
               <CardBody>
                  <Accordion
                  isCompact
                  showDivider={false}
                  itemClasses={itemClasses}
                  >
                  <AccordionItem
                     key="procedure1"
                     textValue="procedures"
                     title={
                        <Listbox variant="flat" aria-label="Listbox menu with sections">
                        <ListboxSection title="Trámites realizados">
                           <ListboxItem
                              key="procedures"
                              description="Trámites realizados"
                              startContent={<FontAwesomeIcon size="lg" icon={faListCheck} />}
                              className="m-0 p-0"
                           >
                              TRÁMITES REALIZADOS
                           </ListboxItem>
                        </ListboxSection>
                        </Listbox>
                     }
                  >
                     <Listbox variant="flat" aria-label="sub listbox">
                        <ListboxSection>
                        <ListboxItem
                           key="FR"
                           title="Trámites de"
                           description="FONDO DE RETIRO"
                           endContent={<FontAwesomeIcon size="lg" icon={faPiggyBank}/>}
                           classNames={classNames}
                        />
                        <ListboxItem
                           key="CE"
                           title="Trámites de"
                           description="COMPLEMENTO ECONÓMICO"
                           endContent={<FontAwesomeIcon size="lg" icon={faPuzzlePiece}/>}
                           classNames={classNames}
                        />
                        <ListboxItem
                           key="AM"
                           title="Trámites de"
                           description="AUXILIO MORTUORIO"
                           classNames={classNames}
                           endContent={<FontAwesomeIcon size="lg" icon={faHeartPulse}/>}
                        />
                        <ListboxItem
                           key="QM"
                           title="Trámites de"
                           description="CUOTA MORTUORIA"
                           classNames={classNames}
                           endContent={<FontAwesomeIcon size="lg" icon={faRibbon}/>}
                        />
                        <ListboxItem
                           key="PR"
                           title="Trámites de"
                           description="PRÉSTAMOS"
                           classNames={classNames}
                           endContent={<FontAwesomeIcon size="lg" icon={faMoneyBill1}/>}
                        />
                        </ListboxSection>
                     </Listbox>
                  </AccordionItem>
                  </Accordion>
               </CardBody>
            </Card>
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