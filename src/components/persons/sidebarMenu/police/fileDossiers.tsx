"use client";
import React, { useState, useEffect } from "react";
import { addToast } from "@heroui/toast";

import { ModalRegisterFileDossier } from "./manage";

import { usePerson } from "@/utils/context/PersonContext";
import { getAffiliateShowFileDossiers } from "@/api/affiliate";
import {
  HeaderManage,
  CardActions,
  EmptyContent,
  SpinnerLoading,
  ViewerPdf,
  ButtonExpand,
} from "@/components/common";
import { AffiliateFileDossier } from "@/utils/interfaces";
import { deleteFileDossier, getViewFileDossier } from "@/api/affiliate";

export const FileDossiers = () => {
  const [fileDossiers, setFileDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const { affiliateId } = usePerson();
  const [isEdit, setIsEdit] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [activeFileDossierId, setActiveFileDossierId] = useState<number | null>(null);
  const [sizePdf, setSizePdf] = useState<string>("w-[48%] border-l pl-2");
  const [sizeColumn, setSizeColumn] = useState<string>("w-[52%]");

  useEffect(() => {
    getFileDossiersAffiliate();
  }, []);

  const switchEdit = () => {
    setIsEdit(!isEdit);
  };

  const getFileDossiersAffiliate = async () => {
    try {
      const { error, message, data } = await getAffiliateShowFileDossiers(affiliateId);

      if (error) {
        addToast({
          title: `Ocurrió un problema, servidor: ${error}, servicio: ${data.serviceStatus}`,
          description: message,
          color: "warning",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        setFileDossiers([]);

        return;
      }

      if (Array.isArray(data)) {
        setFileDossiers([]);
      } else {
        setFileDossiers(data.fileDossiersAffiliate);
      }

      return;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFileDossier = async (fileDossierId: number) => {
    try {
      const { error, message } = await deleteFileDossier(affiliateId, String(fileDossierId));

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
      getFileDossiersAffiliate();
      switchEdit();
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

  const viewTransition = async (fileDossierId: number) => {
    try {
      setLoadingDocument(true);
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
      setLoadingDocument(false);
    }
  };

  const handleResize = () => {
    if (sizePdf === "w-[100%]") {
      setSizePdf("w-[48%] border-l pl-2");
      setSizeColumn("w-[52%]");
    } else {
      setSizePdf("w-[100%]");
      setSizeColumn("w-[0%]");
    }
  };

  const renderContent = () => {
    if (loadingDocument) return <SpinnerLoading isLoading />;
    if (pdfBlob)
      return (
        <>
          <ButtonExpand onPress={handleResize} />
          <ViewerPdf blob={pdfBlob} />
        </>
      );

    return <EmptyContent text="SELECCIONA UN EXPEDIENTE PARA VISUALIZAR" />;
  };

  return (
    <div className="relative flex flex-col h-full w-full min-h-0">
      <SpinnerLoading isLoading={loading} />

      <HeaderManage
        toEdit
        toRegister
        componentRegister={
          <ModalRegisterFileDossier isDisabled={isEdit} onRefreshFileDossiers={getFileDossiersAffiliate} />
        }
        isEdit={isEdit}
        switchEdit={switchEdit}
      />

      <div className="flex gap-1 flex-1 min-h-0">
        <div className={`flex flex-col gap-y-1 overflow-y-auto ${sizeColumn}`}>
          {fileDossiers.length > 0 ? (
            fileDossiers.map((fileDossier: AffiliateFileDossier, key) => (
              <CardActions
                key={key}
                activeId={String(activeFileDossierId)}
                dataId={String(fileDossier.fileDossierId)}
                isEdit={isEdit}
                isLoading={loadingDocument}
                removeData={() => removeFileDossier(fileDossier.fileDossierId)}
                sizeTextBody="text-xl"
                textActive="VISUALIZANDO"
                textBody={`${fileDossier.name}`}
                textHeader={`${fileDossier.shortened}`}
                textHover="VISUALIZAR"
                textLoading="CARGANDO..."
                onDelete
                onPress={() => viewTransition(fileDossier.fileDossierId)}
              />
            ))
          ) : (
            <EmptyContent text="NO EXISTEN EXPEDIENTES REGISTRADOS" />
          )}
        </div>

        <div className={`relative h-full ${sizePdf}`}>{renderContent()}</div>
      </div>
    </div>
  );
};
