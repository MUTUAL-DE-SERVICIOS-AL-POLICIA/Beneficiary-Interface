"use client";
import { Button } from "@heroui/button";
import { CheckboxGroup } from "@heroui/checkbox";
import { cn } from "@heroui/theme";
import { addToast } from "@heroui/toast";
import { Tooltip } from "@heroui/tooltip";
import { useCallback, useState } from "react";

import { createUpdateDocument } from "@/api/document";
import { DocumentEditIcon, DocumentViewIcon } from "@/components/common";
import { ModalDocument } from "@/components/persons/sidebarMenu/police/information/modal-document";
import { Document as DocumentInterface } from "@/utils/interfaces";
import { apiClient } from "@/utils/services";
interface AffiliateDocumentsProps {
  affiliateId: any;
  documents: DocumentInterface[];
}

export const Document = ({ affiliateId, documents }: AffiliateDocumentsProps) => {
  const [groupSelected, setGroupSelected] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const handleDocumentDownload = useCallback(
    async (documentId: number) => {
      if (typeof window !== "undefined" && affiliateId) {
        const response = await apiClient.GET(`affiliates/${affiliateId}/documents/${documentId}`);
        const { status } = response;

        if (status == 200) {
          const documentPDF = await response.blob();
          const pdfURL = URL.createObjectURL(documentPDF);
          const printJS = (await import("print-js")).default;

          printJS({ printable: pdfURL, type: "pdf", showModal: true });
          URL.revokeObjectURL(pdfURL);
        } else {
          addToast({
            title: "Ocurrió un error",
            description: "Ocurrió un error al obtener el documento",
            color: "danger",
            timeout: 2000,
            shouldShowTimeoutProgress: true,
          });

          return;
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
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("documentPdf", file);
      if (currentDocumentId !== null) {
        const { error, message } = await createUpdateDocument(affiliateId, currentDocumentId, formData);

        if (error) {
          addToast({
            title: "Ocurrió un error",
            description: message,
            color: "danger",
            timeout: 2000,
            shouldShowTimeoutProgress: true,
          });

          return;
        }
        addToast({
          title: "Aceptado",
          description: "Documento actualizado correctamente",
          color: "success",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });

        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      toggleDialog();
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="max-h-[430px] 2xl:max-h-[710px] overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <CheckboxGroup classNames={{ base: "w-full" }} value={groupSelected} onChange={setGroupSelected}>
            {documents.map(({ procedureDocumentId, name, shortened }: any, index: number) => (
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
                    <Tooltip content="Visualizar">
                      <Button
                        isIconOnly
                        className="p-1"
                        onPress={() => handleDocumentDownload(procedureDocumentId)}
                      >
                        <DocumentViewIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Actualizar">
                      <Button
                        isIconOnly
                        className="p-1"
                        onPress={() => handleDocumentUpdate(procedureDocumentId)}
                      >
                        <DocumentEditIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </CheckboxGroup>
        </div>
      </div>

      <ModalDocument
        action={uploadFile}
        isUpdated={true}
        loading={isLoading}
        open={isDialogOpen}
        onOpenChange={toggleDialog}
      />
    </>
  );
};
