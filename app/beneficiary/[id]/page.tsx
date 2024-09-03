"use client"

import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Divider } from "@nextui-org/divider"
import { useParams } from "next/navigation"

export default function Beneficiary () {
   const { id } = useParams()
   return (
      <div className="flex flex-col">
         {/* CABECERA PRINCIPAL */}
         <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-100 mb-3">
            <CardHeader className="justify-between">
               <div className="flex gap-5">
                  <div className="flex flex-col gap-1 items-center justify-center">
                     <h4 className="text-small font-semibold leading-none text-default-700">
                        SUB TENIENTE { id }
                     </h4>
                  </div>
               </div>
            </CardHeader>
            <Divider/>
            <CardBody>
            </CardBody>
         </Card>
      </div>
   )
}