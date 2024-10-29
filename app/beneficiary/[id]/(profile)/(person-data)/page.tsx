"use client"
import { Button } from "@nextui-org/button"
import { useEffect, useState } from "react"
import { Divider } from '@nextui-org/divider';
import { getBeneficiary } from "@/app/beneficiary/service";
import { useParams } from "next/navigation";
import { PersonalInfo } from "./(sections)/PersonalInfo";
import { DeathInfo } from "./(sections)/DeathInfo";
import { FinancialData } from "./(sections)/FinancialData";
import { AddressInfo } from "./(sections)/AddressInfo";

export default function PersonDataPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [ beneficiary, setBeneficiary ] = useState<any>({})

  const { id } = useParams()

  useEffect(() => {
    const fetchBeneficiary = async () => {
      const beneficiary = await getBeneficiary(`${id}`)
      setBeneficiary(beneficiary)
    }
    fetchBeneficiary()
    // try {
    //   getBeneficiary(`${id}`).then((response: any) => {
    //     setBeneficiary(response)
    //   })
    //   .catch((error:any) => {
    //     throw error
    //   })
    // } catch (e) {
    //   console.log(e);
    // }
  }, []);

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
        <PersonalInfo beneficiary={beneficiary}/>
      </div>
      <div className="px-3 py-1">
        <div className="flex gap-6">
          <div className="flex flex-col w-1/2">
            <AddressInfo/>
          </div>
          <div className="flex flex-col w-1/2">
            <DeathInfo beneficiary={beneficiary} />
          </div>
        </div>
      </div>
      <div className="px-3 py-1">
        <FinancialData beneficiary={beneficiary}/>
      </div>
    </div>
  )
}