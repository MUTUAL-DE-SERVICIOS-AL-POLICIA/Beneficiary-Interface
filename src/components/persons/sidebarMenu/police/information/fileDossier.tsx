"use client";

import { addToast } from "@heroui/toast";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useState } from "react";

import { ViewerPdf } from "./viewerPdf";

import { usePerson } from "@/utils/context/PersonContext";
import { getViewFileDossier } from "@/api/affiliate";
import { AffiliateFileDossier } from "@/utils/interfaces";

interface AffiliateDocumentsProps {
  fileDossiers: AffiliateFileDossier[];
}

export const FileDossier = ({ fileDossiers }: AffiliateDocumentsProps) => {
  const { affiliateId } = usePerson();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const viewTransition = async (fileDossierId: number) => {
    try {
      const { error, message, data } = await getViewFileDossier(affiliateId, String(fileDossierId));

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

      setPdfBlob(data); // << Mostrar en visor
    } catch (error) {
      console.error("Error al obtener el expediente:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col w-1/3 gap-y-2">
        {fileDossiers.length > 0 ? (
          fileDossiers.map((fileDossier: AffiliateFileDossier) => (
            <Card
              key={fileDossier.fileDossierId}
              isPressable
              className="relative group border-small rounded-small border-default-200 dark:border-default-200"
              onPress={() => viewTransition(fileDossier.fileDossierId)}
            >
              <span className="absolute top-2 right-2 text-xs text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                VISUALIZAR
              </span>
              <CardHeader>
                <h3 className="text-sm">{fileDossier.shortened}</h3>
              </CardHeader>
              <CardBody>
                <p className="text-xl uppercase">{fileDossier.name}</p>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm italic">
            SIN EXPEDIENTES REGISTRADOS
          </div>
        )}
      </div>

      <div className="w-2/3 border-l pl-2">
        {pdfBlob ? (
          <ViewerPdf blob={pdfBlob} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-400 italic">
            SELECCIONA UN EXPEDIENTE PARA VISUALIZAR
          </div>
        )}
      </div>
    </>
  );
};
