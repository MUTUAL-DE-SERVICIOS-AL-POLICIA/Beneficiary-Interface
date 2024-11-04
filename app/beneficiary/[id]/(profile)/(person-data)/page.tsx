"use client"
import { Button } from "@nextui-org/button"
import { useState } from "react"
import { Divider } from '@nextui-org/divider';
import { PersonalInfo } from "./(sections)/PersonalInfo";
import { DeathInfo } from "./(sections)/DeathInfo";
import { FinancialData } from "./(sections)/FinancialData";
import { AddressInfo } from "./(sections)/AddressInfo";
import { useBeneficiary } from "@/context/BeneficiaryContext";

export default function PersonDataPage() {
  const [isEditing, setIsEditing] = useState(false)

  const { beneficiaryData } = useBeneficiary()

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-md uppercase font-semibold">Datos de la persona</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          size="sm"
          className={isEditing ? "bg-lime-400 hover:bg-lime-500" : "bg-gray-400 hover:bg-gray-500"}
        >
          {isEditing ? "Guardar" : "Editar"}
        </Button>
      </div>
      <Divider className="bg-gray-400 mb-5 w-full"/>
      <div className="px-3 py-1">
        <PersonalInfo beneficiary={beneficiaryData}/>
      </div>
      <div className="px-3 py-1">
        <div className="flex gap-6">
          <div className="flex flex-col w-1/2">
            <AddressInfo/>
          </div>
          <div className="flex flex-col w-1/2">
            <DeathInfo beneficiary={beneficiaryData} />
          </div>
        </div>
      </div>
      <div className="px-3 py-1">
        <FinancialData beneficiary={beneficiaryData}/>
      </div>
    </div>
  )
}