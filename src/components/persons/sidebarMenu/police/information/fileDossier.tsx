"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { useState } from "react";

import { ViewerPdf } from "@/components/common/viewerPdf";
import { deleteFileDossier, getViewFileDossier } from "@/api/affiliate";
import { GarbageIcon, ModalAlert } from "@/components/common";
import { usePerson } from "@/utils/context/PersonContext";
import { AffiliateFileDossier } from "@/utils/interfaces";

interface Props {
  fileDossiers: AffiliateFileDossier[];
  onEdit: boolean;
  onRefreshFileDossiers: () => void;
  onCancel: () => void;
}

export const FileDossier = ({ fileDossiers, onEdit, onRefreshFileDossiers, onCancel }: Props) => {
  const { affiliateId } = usePerson();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFileDossierId, setActiveFileDossierId] = useState<number | null>(null);
  const [deleteFileDossierId, setDeleteFileDossierId] = useState<AffiliateFileDossier | null>(null);
  const [openModalAlert, setOpenModalAlert] = useState(false);

  const viewTransition = async (fileDossierId: number) => {
    try {
      setLoading(true);
      setActiveFileDossierId(fileDossierId);
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

      setPdfBlob(data);
    } catch (error) {
      console.error("Error al obtener el expediente:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFileDossier = async (fileDossier: AffiliateFileDossier) => {
    try {
      const { error, message } = await deleteFileDossier(
        String(fileDossier.affiliateId),
        String(fileDossier.fileDossierId),
      );

      if (error) {
        addToast({
          title: "Ocurrido un error",
          description: message,
          color: "danger",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });

        return;
      }
      setPdfBlob(null);
      setActiveFileDossierId(null);
      onRefreshFileDossiers();
      onCancel();
      addToast({
        title: "Expediente eliminado",
        description: message,
        color: "success",
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });

      return;
    } catch (error) {
      console.error("Error al eliminar expediente:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col w-[52%] gap-y-2 overflow-y-auto">
        {fileDossiers.length > 0 ? (
          fileDossiers.map((fileDossier: AffiliateFileDossier) => (
            <Card
              key={fileDossier.fileDossierId}
              className="group border-small rounded-small border-default-200 dark:border-default-200"
              isPressable={!onEdit && activeFileDossierId !== fileDossier.fileDossierId}
              onPress={() => viewTransition(fileDossier.fileDossierId)}
            >
              <CardBody className="flex items-start gap-y-2">
                <div>
                  <span className="text-sm font-bold">{fileDossier.shortened}</span>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span
                      className={`text-xs font-semibold transition-opacity duration-200
                          ${
                            activeFileDossierId === fileDossier.fileDossierId
                              ? loading
                                ? "text-blue-600 opacity-100"
                                : "text-green-600 opacity-100"
                              : "text-yellow-600 opacity-0 group-hover:opacity-100"
                          }
                        `}
                    >
                      {activeFileDossierId === fileDossier.fileDossierId
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
                        onPress={() => {
                          setDeleteFileDossierId(fileDossier);
                          setOpenModalAlert(true);
                        }}
                      >
                        <GarbageIcon />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xl uppercase">{fileDossier.name}</p>
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
            SELECCIONA UN EXPEDIENTE PARA VISUALIZAR
          </div>
        )}
      </div>

      <ModalAlert
        cancelText="Cancelar"
        confirmText="Sí, eliminar"
        isOpen={openModalAlert}
        message={`¿Desea eliminar el expediente de ${deleteFileDossierId?.name}?`}
        title="Eliminar expediente"
        onClose={() => {
          setOpenModalAlert(false);
          setDeleteFileDossierId(null);
        }}
        onConfirm={() => {
          if (deleteFileDossierId !== null) {
            removeFileDossier(deleteFileDossierId);
          }
          setOpenModalAlert(false);
          setDeleteFileDossierId(null);
        }}
      />
    </>
  );
};
