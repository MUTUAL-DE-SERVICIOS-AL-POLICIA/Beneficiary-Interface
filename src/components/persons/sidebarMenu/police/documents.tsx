"use client";
import { useEffect, useState } from "react";
import { addToast } from "@heroui/toast";

import { ModalRegisterDocument } from "./manage";

import { getAffiliateDocuments } from "@/api/affiliate";
import { usePerson } from "@/utils/context/PersonContext";
import { AffiliateDocument } from "@/utils/interfaces";
import { HeaderManage, CardActions, EmptyContent, SpinnerLoading, ViewerPdf } from "@/components/common";
import { getViewDocument } from "@/api/affiliate";

export const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const { affiliateId } = usePerson();
  const [isEdit, setIsEdit] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<number | null>(null);

  useEffect(() => {
    getDocumentsAffiliate();
  }, []);

  const switchEdit = () => {
    setIsEdit(!isEdit);
  };

  const getDocumentsAffiliate = async () => {
    try {
      setLoading(true);
      const { data } = await getAffiliateDocuments(affiliateId);

      if (Array.isArray(data)) {
        setDocuments([]);

        return;
      } else {
        setDocuments(data.documentsAffiliate);

        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const viewTransition = async (documentId: number) => {
    try {
      setLoadingDocument(true);
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
      setLoadingDocument(false);
    }
  };
  const renderContent = () => {
    if (loadingDocument) return <SpinnerLoading isLoading />;
    if (pdfBlob) return <ViewerPdf blob={pdfBlob} />;

    return <EmptyContent text="SELECCIONA UN DOCUMENTO PARA VISUALIZAR" />;
  };

  return (
    <div className="relative flex flex-col h-full w-full min-h-0">
      <SpinnerLoading isLoading={loading} />

      <HeaderManage
        toRegister
        componentRegister={
          <ModalRegisterDocument isDisabled={isEdit} onRefreshDocuments={getDocumentsAffiliate} />
        }
        isEdit={isEdit}
        switchEdit={switchEdit}
      />

      <div className="flex gap-1 flex-1 min-h-0">
        <div className="flex flex-col w-[52%] gap-y-1 overflow-y-auto">
          {documents.length > 0 ? (
            documents.map((document: AffiliateDocument, key) => (
              <CardActions
                key={key}
                activeId={String(activeDocumentId)}
                dataId={String(document.procedureDocumentId)}
                height="min-h-[120px]"
                isEdit={isEdit}
                isLoading={loadingDocument}
                sizeTextBody="text-sm"
                textActive="VISUALIZANDO"
                textBody={`${document.name}`}
                textHeader={`${key + 1}. ${document.shortened}`}
                textHover="VISUALIZAR"
                textLoading="CARGANDO..."
                onPress={() => viewTransition(document.procedureDocumentId)}
              />
            ))
          ) : (
            <EmptyContent text="NO EXISTEN EXPEDIENTES REGISTRADOS" />
          )}
        </div>

        <div className="relative w-[48%] border-l pl-2 h-full">{renderContent()}</div>
      </div>
    </div>
  );
};
