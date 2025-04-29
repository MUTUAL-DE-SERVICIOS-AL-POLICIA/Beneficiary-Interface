"use client";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/button";
import { CheckboxGroup } from "@heroui/checkbox";
import { cn } from "@heroui/theme";
import { Tooltip } from "@heroui/tooltip";
import React, { useCallback, useMemo, useState } from "react";
// import printJS from "print-js";

import { createUpdateDocument } from "@/api/document/api";
import { ModalDocument } from "@/components/common/modal-document";
import { useAlert } from "@/utils/hooks/useAlerts";
import { apiClient } from "@/utils/services";

interface AffiliateDocumentsProps {
  affiliateId: any;
  documents: any;
  status: boolean;
}

const AffiliateDocuments = React.memo(({ affiliateId, documents, status }: AffiliateDocumentsProps) => {
  const [groupSelected, setGroupSelected] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);
  const hasNoDocuments = useMemo(() => status, [documents]);

  const { Alert } = useAlert();

  const handleDocumentDownload = useCallback(
    async (documentId: number) => {
      if (typeof window !== "undefined" && affiliateId) {
        // esta ruta no se puede llamar con el servidor
        const response = await apiClient.GET(`affiliates/${affiliateId}/documents/${documentId}`);
        const { status } = response;

        if (status == 200) {
          const documentPDF = await response.blob();
          const pdfURL = URL.createObjectURL(documentPDF);
          const printJS = (await import("print-js")).default;

          printJS({ printable: pdfURL, type: "pdf", showModal: true });
          URL.revokeObjectURL(pdfURL);
        } else {
          Alert({ message: "Ocurrio un error al obtener el documento", variant: "error" });
        }
      }
    },
    [affiliateId],
  );

  const handleDocumentUpdate = async (documentId: any) => {
    setCurrentDocumentId(documentId);
    toggleDialog();
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();

    formData.append("documentPdf", file);
    setIsLoading(true);
    if (currentDocumentId !== null) {
      const { error, message } = await createUpdateDocument(affiliateId, currentDocumentId, formData);

      if (!error) {
        Alert({ message, variant: "success" });
      } else {
        Alert({ message, variant: "error" });
      }
    }
    setIsLoading(false);
    toggleDialog();
  };

  const WithoutDocuments = () => {
    return (
      <div className="flex items-center justify-center text-center h-full w-full">
        <fieldset className="border border-gray-400 rounded-md py-10 w-full">
          <legend> </legend>
          <span className="">Sin documentos</span>
        </fieldset>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      {!hasNoDocuments ? (
        <WithoutDocuments />
      ) : (
        <div className="max-h-[400px] overflow-y-auto w-full">
          <CheckboxGroup classNames={{ base: "w-full" }} value={groupSelected} onChange={setGroupSelected}>
            {documents.length >= 0 &&
              documents.map(({ procedureDocumentId, name, shortened }: any, index: number) => (
                <div
                  key={procedureDocumentId}
                  className={cn(
                    "flex max-w-full w-full bg-content1 m-0 border-gray-400 items-center",
                    "hover:bg-content3 dark:hover:border-lime-400 bg-content2 justify-between",
                    "cursor-pointer rounded-lg gap-2 p-4 border",
                    groupSelected.includes(index + 1) && "border-selected",
                  )}
                >
                  <div className="w-full flex justify-between gap-3">
                    <div className="flex flex-row items-start gap-3">
                      <span className="text-md font-bold">{index + 1} &nbsp;</span>
                      <span className="text-sm uppercase">
                        {name}
                        <b>&nbsp;({shortened})</b>
                      </span>
                    </div>
                    <div className="flex flex-row items-end gap-1">
                      <Tooltip content="Visualizar documento">
                        <Button
                          isIconOnly
                          className="p-1"
                          onPress={() => handleDocumentDownload(procedureDocumentId)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Editar documento">
                        <Button
                          isIconOnly
                          className="p-1"
                          onPress={() => handleDocumentUpdate(procedureDocumentId)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
          </CheckboxGroup>
        </div>
      )}
      <ModalDocument
        action={uploadFile}
        isUpdated={true}
        loading={isLoading}
        open={isDialogOpen}
        onOpenChange={toggleDialog}
      />
    </div>
  );
});

AffiliateDocuments.displayName = "AffiliateDocuments";

export default AffiliateDocuments;
