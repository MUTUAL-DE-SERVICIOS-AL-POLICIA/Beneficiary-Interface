import { apiClient } from "@/services";
import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@nextui-org/theme";

interface AffiliateDocumentsProps {
  affiliate: any
  documents: any
}

export const AffiliateDocuments = ({affiliate, documents}: AffiliateDocumentsProps) => {
  const [groupSelected, setGroupSelected] = useState<any>([]);

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
                  onValueChange={(isSelected) => {
                    if (isSelected) {
                      handleDownloadDocument(document.procedureDocumentId);
                    }
                  }}
                >
                  <div className="flex items-start w-full">
                    <div className="w-[97%] text-small">
                      {document.name} <b>&nbsp;&nbsp;{document.shortened}</b>
                    </div>
                  </div>
                </Checkbox>
              ))
            }
          </CheckboxGroup>
        )
      }
    </div>
  )
}