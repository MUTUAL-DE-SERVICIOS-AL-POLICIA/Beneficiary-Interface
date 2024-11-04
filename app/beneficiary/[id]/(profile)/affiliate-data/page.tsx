"use client"
import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox";
import { Divider } from "@nextui-org/divider";
import { cn } from "@nextui-org/theme";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EntryInfo } from "./(sections)/EntryInfo";
import { StateInfo } from "./(sections)/StateInfo";
import { ServiceInfo } from "./(sections)/ServiceInfo";
import { DerelictInfo } from "./(sections)/DerelictInfo";
import { getAffiliate, obtainAffiliateDocuments } from "@/app/beneficiary/service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useBeneficiary } from "@/context/BeneficiaryContext";
import { apiClient } from "@/services";

export default function AffiliateDataPage() {
  const [groupSelected, setGroupSelected] = useState<any>([]);
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

  const handleDownloadDocument = useCallback(async (value:any) => {
    if(typeof window !== "undefined" && affiliate) {
      const printJS = (await import("print-js")).default
      const response = await apiClient.GET(`/api/affiliates/${affiliate.id}/documents/${value}`)
      const pdfBlob = await response.blob()
      const pdfURL = URL.createObjectURL(pdfBlob)
      printJS({printable: pdfURL, type: 'pdf', showModal: true})
      URL.revokeObjectURL(pdfURL)
    } else {
      alert("sin id")
    }
  }, [affiliate])

  const hasNoDocuments = useMemo(() => documents && documents.status, [documents])

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
            <div className="flex flex-">
              {
                !hasNoDocuments ? (
                  <div className="flex items-center justify-center text-center h-full w-full">
                    <fieldset className="border border-gray-400 rounded-md py-10 w-full">
                      <legend> </legend>
                      <span className="">Sin documentos</span>
                    </fieldset>
                  </div>
                ) : (
                  <CheckboxGroup
                    value={groupSelected}
                    onChange={setGroupSelected}
                    classNames={{ base: "w-full" }}
                  >
                    {
                      documents.documentsAffiliate.length >= 0 && documents.documentsAffiliate.map((document: any) => (
                        <Checkbox
                          key={document.procedureDocumentId}
                          value={document.procedureDocumentId}
                          color="default"
                          size="lg"
                          radius="sm"
                          classNames={{
                            base: cn(
                              "inline-flex max-w-full w-full bg-content1 m-0 border-gray-400",
                              "hover:bg-content3 items-center justify-start",
                              "dark:hover:border-lime-400 bg-content2 items-center justify-start",
                              "cursor-pointer rounded-lg gap-2 p-4 border",
                              "data-[selected=true]:border",
                            ),
                          }}
                          icon={<FontAwesomeIcon icon={faArrowDown} fontSize="lg"/>}
                          onValueChange={(isSelected) => {
                            if (isSelected) {
                              handleDownloadDocument(document.procedureDocumentId);
                            }
                          }}
                        >
                          <div className="flex items-start w-full">
                            <div className="w-[97%] text-small">
                              {document.name}
                            </div>
                          </div>
                        </Checkbox>
                      ))
                    }
                  </CheckboxGroup>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}