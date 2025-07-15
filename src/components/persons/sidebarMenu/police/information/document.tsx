"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { useState } from "react";

import { ViewerPdf } from "@/components/common/viewerPdf";
import { getViewDocument } from "@/api/affiliate";
import { usePerson } from "@/utils/context/PersonContext";
import { AffiliateDocument } from "@/utils/interfaces";
import { GarbageIcon } from "@/components/common";

interface Props {
  documents: AffiliateDocument[];
  onCancel: () => void;
  onEdit: boolean;
  onRefreshDocuments: () => void;
}

export const Document = ({ documents, onEdit }: Props) => {
  const { affiliateId } = usePerson();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<number | null>(null);

  const viewTransition = async (documentId: number) => {
    try {
      setLoading(true);
      setActiveDocumentId(documentId);

      const { error, message, data } = await getViewDocument(affiliateId, String(documentId));

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

      setPdfBlob(data);
    } catch (error) {
      console.error("Error al obtener el expediente:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col w-[52%] gap-y-1 overflow-y-auto">
        {documents.length > 0 ? (
          documents.map((document: AffiliateDocument, key) => (
            <Card
              key={document.procedureDocumentId}
              className="group border-small rounded-small border-default-200 dark:border-default-200 min-h-[120px]"
              isPressable={!onEdit && activeDocumentId !== document.procedureDocumentId}
              onPress={() => viewTransition(document.procedureDocumentId)}
            >
              <CardBody className="flex items-start gap-y-2">
                <div>
                  <span className="text-sm font-bold">
                    {key + 1}. {document.shortened}
                  </span>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span
                      className={`text-xs font-semibold transition-opacity duration-200
                          ${
                            activeDocumentId === document.procedureDocumentId
                              ? loading
                                ? "text-blue-600 opacity-100"
                                : "text-green-600 opacity-100"
                              : "text-yellow-600 opacity-0 group-hover:opacity-100"
                          }
                        `}
                    >
                      {activeDocumentId === document.procedureDocumentId
                        ? loading
                          ? "CARGANDO..."
                          : "VISUALIZANDO"
                        : !onEdit
                          ? "VISUALIZAR"
                          : ""}
                    </span>
                    {onEdit && (
                      <Button
                        isIconOnly
                        className="text-tiny text-white"
                        color="danger"
                        radius="lg"
                        size="sm"
                        variant="flat"
                        // onPress={() => {
                        //   setDeleteFileDossierId(fileDossier);
                        //   setOpenModalAlert(true);
                        // }}
                      >
                        <GarbageIcon />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm">{document.name}</p>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm italic">
            SIN EXPEDIENTES REGISTRADOS
          </div>
        )}
      </div>

      <div className="w-[48%] border-l pl-2 h-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner color="primary" size="lg" />
          </div>
        ) : pdfBlob ? (
          <ViewerPdf blob={pdfBlob} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-400 italic">
            SELECCIONA UN DOCUMENTO PARA VISUALIZAR
          </div>
        )}
      </div>
    </>
  );
};
