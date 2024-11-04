"use client"
import { Divider } from "@nextui-org/divider";
import { useEffect, useState } from "react";
import { EntryInfo } from "./(sections)/EntryInfo";
import { StateInfo } from "./(sections)/StateInfo";
import { ServiceInfo } from "./(sections)/ServiceInfo";
import { DerelictInfo } from "./(sections)/DerelictInfo";
import { getAffiliate, obtainAffiliateDocuments } from "@/app/beneficiary/service";
import { useBeneficiary } from "@/context/BeneficiaryContext";
import { AffiliateDocuments } from "./(sections)/Documents";

export default function AffiliateDataPage() {
  const [affiliate, setAffiliate] = useState<any>({})
  const [documents, setDocuments] = useState<any>([])
  const { beneficiaryData } = useBeneficiary()

  useEffect(() => {
    const fetchData = async () => {
      if (beneficiaryData.personAffiliate.length >= 1) {
        const affiliateId = beneficiaryData.personAffiliate[0].typeId
        const [ affiliateData, documentsData ] = await Promise.all([
          getAffiliate(`${affiliateId}`),
          obtainAffiliateDocuments(`${beneficiaryData.id}`)
        ])
        setAffiliate(affiliateData)
        setDocuments(documentsData)
      } else {
        console.log("es persona")
      }
    }
    fetchData()
  }, [beneficiaryData])

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-md uppercase font-semibold">Datos del Policia</h1>
      </div>
      <Divider className="bg-gray-400 mb-5 w-full" />
      <div className="px-3 py-1">
        <div className="flex gap-6">
          <div className="flex flex-col w-1/2">
            <EntryInfo affiliate={affiliate} />
          </div>
          <div className="flex flex-col w-1/2">
            <StateInfo affiliate={affiliate} />
          </div>
        </div>
      </div>
      <div className="px-3 py-1">
        <ServiceInfo affiliate={affiliate} />
      </div>
      <div className="px-3 py-1">
        <DerelictInfo affiliate={affiliate} />
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-md uppercase font-semibold">Documentos presentados</h1>
      </div>
      <Divider className="bg-gray-400 mb-5 w-full" />
      <div className="px-3 py-1">
        <div className="flex gap-1">
          <div className="flex flex-col w-full">
            <AffiliateDocuments affiliate={affiliate} documents={documents}/>
          </div>
        </div>
      </div>
    </div>
  )
}