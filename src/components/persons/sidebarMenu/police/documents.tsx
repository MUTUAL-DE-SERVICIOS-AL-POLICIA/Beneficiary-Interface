"use client";
import type { AffiliateDocument } from "@/utils/interfaces";

import { toast } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import { ModalRegisterDocument } from "./manage";

import { deleteDocument, getAffiliateDocuments, getDocuments, getViewDocument } from "@/api/affiliate";
import {
  ButtonExpand,
  CardActions,
  EmptyContent,
  HeaderManage,
  SpinnerLoading,
  ViewerPdf,
} from "@/components";
import { usePerson } from "@/context/PersonContext";
import { getAccessCookie } from "@/utils/cookie";

export const Documents = () => {
  const { affiliateId } = usePerson();

  const [documents, setDocuments] = useState<AffiliateDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAllDocument, setLoadingAllDocument] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<number | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [documentEdit, setDocumentEdit] = useState<AffiliateDocument>();
  const [isOpen, setIsOpen] = useState(false);
  const [dataRegister, setDataRegister] = useState<any>(null);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const sizePdf = isExpanded ? "w-[100%]" : "w-[48%] border-l pl-2";
  const sizeColumn = isExpanded ? "w-0" : "w-[52%]";

  const [isCreateDocument, setIsCreateDocument] = useState(false);
  const [isUpdateDocument, setIsUpdateDocument] = useState(false);
  const [isDeleteDocument, setIsDeleteDocument] = useState(false);

  // Función reutilizable para actualizar la lista manualmente (por ejemplo, desde el modal o al eliminar)
  const refreshDocuments = useCallback(async () => {
    if (!affiliateId) return;

    try {
      setLoading(true);
      setPdfBlob(null);
      setActiveDocumentId(null);
      setIsEdit(false);
      const { data } = await getAffiliateDocuments(affiliateId);

      if (Array.isArray(data)) {
        setDocuments([]);

        return;
      }

      setDocuments(data.documentsAffiliate ?? []);
    } catch {
      toast.danger("Error al obtener los documentos del afiliado");
    } finally {
      setLoading(false);
    }
  }, [affiliateId]);

  const removeDocument = async (procedureDocumentId: number) => {
    try {
      const { error, message } = await deleteDocument(affiliateId, String(procedureDocumentId));

      if (error) {
        toast.danger(message);

        return;
      }
      refreshDocuments();
      toast.success("Documento eliminado correctamente");
    } catch {
      toast.danger("Ocurrió un error al eliminar el documento");
    }
  };

  const viewTransition = async (documentId: number) => {
    try {
      setLoadingDocument(true);
      setActiveDocumentId(documentId);

      const { error, message, data } = await getViewDocument(affiliateId, String(documentId));

      if (error) {
        toast.danger(message);

        return;
      }
      setPdfBlob(data);
    } catch {
      toast.danger("Ocurrió un error al obtener el documento");
    } finally {
      setLoadingDocument(false);
    }
  };

  const handleExpand = () => setIsExpanded((prev) => !prev);

  const editDocument = (document: AffiliateDocument) => {
    setDocumentEdit(document);
    setIsUpdate(true);
    onOpen();
  };

  const renderContent = () => {
    if (loadingDocument) return <SpinnerLoading isLoading />;
    if (pdfBlob)
      return (
        <>
          <ButtonExpand onPress={handleExpand} />
          <ViewerPdf blob={pdfBlob} />
        </>
      );

    return <EmptyContent text="SELECCIONA UN DOCUMENTO PARA VISUALIZAR" />;
  };

  const handleOpenModal = async () => {
    try {
      setDocumentEdit(undefined);
      setIsUpdate(false);
      setLoadingAllDocument(true);
      const { error, message, data } = await getDocuments(affiliateId);

      if (error) {
        toast.danger(message);
        setDataRegister(null);

        return;
      }

      setDataRegister(data);
      onOpen();
    } catch {
      toast.danger("Ocurrió un error al obtener los documentos");
    } finally {
      setLoadingAllDocument(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      if (!affiliateId) return;

      setLoading(true);
      setPdfBlob(null);
      setActiveDocumentId(null);
      setIsEdit(false);

      try {
        const [permissionsRes, documentsRes] = await Promise.all([
          getAccessCookie(),
          getAffiliateDocuments(affiliateId),
        ]);

        if (cancelled) return;

        // Carga de permisos
        const permissionsData = permissionsRes.data || [];

        setIsCreateDocument(permissionsData.includes("isCreateDocument"));
        setIsUpdateDocument(permissionsData.includes("isUpdateDocument"));
        setIsDeleteDocument(permissionsData.includes("isDeleteDocument"));

        // Carga de documentos
        if (Array.isArray(documentsRes.data)) {
          setDocuments([]);
        } else {
          setDocuments(documentsRes.data?.documentsAffiliate ?? []);
        }
      } catch {
        if (!cancelled) {
          toast.danger("Error al cargar la información inicial");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
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
          isLoading={loadingAllDocument}
          switchEdit={() => setIsEdit((prev) => !prev)}
          toEdit={isUpdateDocument || isDeleteDocument}
          toRegister={isCreateDocument}
          onPressRegister={handleOpenModal}
        />

        <div className="flex gap-1 flex-1 min-h-0">
          <div className={`flex flex-col gap-y-1 overflow-y-auto ${sizeColumn}`}>
            {documents.length > 0 ? (
              documents.map((doc, key) => (
                <CardActions
                  key={key}
                  haveButton
                  activeId={String(activeDocumentId)}
                  dataId={String(doc.procedureDocumentId)}
                  height="min-h-[120px]"
                  isEdit={isEdit}
                  isLoading={loadingDocument}
                  sizeTextBody="text-md"
                  textActive="VISUALIZANDO"
                  textBody={`${doc.name}`}
                  textHeader={`${key + 1}. ${doc.shortened}`}
                  textHover="VISUALIZAR"
                  textLoading="CARGANDO..."
                  onDelete={isDeleteDocument}
                  onEdit={isUpdateDocument}
                  onPress={() => viewTransition(doc.procedureDocumentId)}
                  onPressDelete={() => removeDocument(doc.procedureDocumentId)}
                  onPressEdit={() => editDocument(doc)}
                />
              ))
            ) : (
              <EmptyContent text="NO EXISTEN DOCUMENTOS REGISTRADOS" />
            )}
          </div>
          <div className={`relative h-full ${sizePdf}`}>{renderContent()}</div>
        </div>
      </div>

      <ModalRegisterDocument
        affiliateDocument={documentEdit}
        dataRegister={dataRegister}
        isOpen={isOpen}
        isUpdate={isUpdate}
        onClose={onClose}
        onRefreshDocuments={refreshDocuments}
      />
    </>
  );
};
