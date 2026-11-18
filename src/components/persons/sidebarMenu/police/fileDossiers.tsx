"use client";
import { toast } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import { ModalRegisterFileDossier } from "./manage";

import {
  deleteFileDossier,
  getAffiliateShowFileDossiers,
  getAllFileDossiers,
  getViewFileDossier,
} from "@/api/affiliate";
import {
  ButtonExpand,
  CardActions,
  EmptyContent,
  HeaderManage,
  SpinnerLoading,
  ViewerPdf,
} from "@/components";
import { usePerson } from "@/context/PersonContext";
import { usePermissions } from "@/context/PermissionContext";
import { AffiliateFileDossier } from "@/utils/interfaces";

export const FileDossiers = () => {
  const { can } = usePermissions();
  const canWrite = can("affiliates.file_dossiers", "write");
  const canUpdate = can("affiliates.file_dossiers", "update");
  const canDelete = can("affiliates.file_dossiers", "delete");
  const canDownload = can("affiliates.file_dossiers", "download");
  const [fileDossiers, setFileDossiers] = useState<AffiliateFileDossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAllFileDossiers, setLoadingAllFileDossiers] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const { affiliateId } = usePerson();
  const [isEdit, setIsEdit] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [activeFileDossierId, setActiveFileDossierId] = useState<number | null>(null);
  const [sizePdf, setSizePdf] = useState<string>("w-[48%] border-l pl-2");
  const [sizeColumn, setSizeColumn] = useState<string>("w-[52%]");
  const [isOpen, setIsOpen] = useState(false);
  const [dataRegister, setDataRegister] = useState<any>(null);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [fileDossierEdit, setFileDossierEdit] = useState<AffiliateFileDossier>();
  // Función para refrescar manualmente los expedientes (usada al eliminar o desde el Modal)
  const refreshFileDossiers = useCallback(async () => {
    if (!affiliateId) return;

    try {
      setLoading(true);
      setPdfBlob(null);
      setActiveFileDossierId(null);
      setIsEdit(false);
      const { error, message, data } = await getAffiliateShowFileDossiers(affiliateId);

      if (error) {
        toast.danger(message);
        setFileDossiers([]);

        return;
      }

      if (Array.isArray(data)) {
        setFileDossiers([]);
      } else {
        setFileDossiers(data.fileDossiersAffiliate || []);
      }
    } catch {
      toast.danger("Ocurrió un error al obtener los expedientes");
    } finally {
      setLoading(false);
    }
  }, [affiliateId]);

  const switchEdit = () => {
    setIsEdit(!isEdit);
  };

  const removeFileDossier = async (fileDossierId: number) => {
    try {
      const { error, message } = await deleteFileDossier(affiliateId, String(fileDossierId));

      if (error) {
        toast.danger(message);

        return;
      }
      refreshFileDossiers();
      toast.success("Expediente eliminado correctamente");
    } catch {
      toast.danger("Ocurrió un error al eliminar el expediente");
    }
  };

  const viewTransition = async (fileDossierId: number) => {
    try {
      setLoadingDocument(true);
      setActiveFileDossierId(fileDossierId);
      const { error, message, data } = await getViewFileDossier(affiliateId, String(fileDossierId));

      if (error) {
        toast.danger(message);

        return;
      }

      setPdfBlob(data);
    } catch {
      toast.danger("Ocurrió un error al obtener el expediente");
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

  const editFileDossier = (fileDossier: AffiliateFileDossier) => {
    setFileDossierEdit(fileDossier);
    setIsUpdate(true);
    onOpen();
  };

  const handleOpenModal = async () => {
    try {
      setLoadingAllFileDossiers(true);
      const { error, message, data } = await getAllFileDossiers(affiliateId);

      if (error) {
        toast.danger(message);
        setDataRegister(null);

        return;
      }

      setDataRegister(data);
      onOpen();
    } catch {
      toast.danger("Ocurrió un error al obtener los expedientes");
    } finally {
      setLoadingAllFileDossiers(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      if (!affiliateId) return;

      setLoading(true);
      setPdfBlob(null);
      setActiveFileDossierId(null);
      setIsEdit(false);

      try {
        const { error, message, data } = await getAffiliateShowFileDossiers(affiliateId);

        if (cancelled) return;
        if (error) {
          toast.danger(message);
          setFileDossiers([]);
        } else {
          setFileDossiers(Array.isArray(data) ? [] : (data?.fileDossiersAffiliate ?? []));
        }
      } catch {
        if (!cancelled) toast.danger("Ocurrió un error al obtener la información inicial");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [affiliateId]);

  return (
    <>
      <div className="relative flex flex-col h-full w-full min-h-0">
        <SpinnerLoading isLoading={loading} />

        <HeaderManage
          isEdit={isEdit}
          isLoading={loadingAllFileDossiers}
          switchEdit={switchEdit}
          toEdit={canUpdate || canDelete}
          toRegister={canWrite}
          onPressRegister={handleOpenModal}
        />

        <div className="flex gap-1 flex-1 min-h-0">
          <div className={`flex flex-col gap-y-1 overflow-y-auto ${sizeColumn}`}>
            {fileDossiers.length > 0 ? (
              fileDossiers.map((fileDossier: AffiliateFileDossier, key) => (
                <CardActions
                  key={key}
                  haveButton={canDownload}
                  activeId={String(activeFileDossierId)}
                  dataId={String(fileDossier.fileDossierId)}
                  isEdit={isEdit}
                  isLoading={loadingDocument}
                  sizeTextBody="text-xl"
                  textActive="VISUALIZANDO"
                  textBody={`${fileDossier.name}`}
                  textHeader={`${key + 1}. ${fileDossier.shortened}`}
                  textHover="VISUALIZAR"
                  textLoading="CARGANDO..."
                  onDelete={canDelete}
                  onEdit={canUpdate}
                  onPress={() => viewTransition(fileDossier.fileDossierId)}
                  onPressDelete={() => removeFileDossier(fileDossier.fileDossierId)}
                  onPressEdit={() => editFileDossier(fileDossier)}
                />
              ))
            ) : (
              <EmptyContent text="NO EXISTEN EXPEDIENTES REGISTRADOS" />
            )}
          </div>

          <div className={`relative h-full ${sizePdf}`}>{renderContent()}</div>
        </div>
      </div>

      <ModalRegisterFileDossier
        affiliateFileDossier={fileDossierEdit}
        dataRegister={dataRegister}
        isOpen={isOpen}
        isUpdate={isUpdate}
        onClose={onClose}
        onRefreshFileDossiers={refreshFileDossiers}
      />
    </>
  );
};
