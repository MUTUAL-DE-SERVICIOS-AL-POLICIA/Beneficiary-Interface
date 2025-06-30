"use client";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { Tooltip } from "@heroui/tooltip";
import { useEffect, useState } from "react";

import { Document, ModalDocument } from "./information";

import { getAffiliateDocuments } from "@/api/affiliate";
import { createUpdateDocument, getAllDocuments } from "@/api/document";
import { DocumentRegisterIcon } from "@/components/common";
import { usePerson } from "@/utils/context/PersonContext";

export const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDocumentsAffiliate();
  }, []);

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allDocuments, setAllDocuments] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { affiliateId } = usePerson();

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const handleDocumentRecord = async () => {
    try {
      setIsLoading(true);
      const { documents } = await getAllDocuments();

      setAllDocuments(documents);
      toggleDialog();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerFile = async (file: any, selectedKey: any) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("documentPdf", file);

      const { error, message } = await createUpdateDocument(affiliateId, selectedKey, formData);

      if (error) {
        addToast({
          title: "Ocurrió un problema",
          description: message,
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      addToast({
        title: "Aceptado",
        description: message,
        color: "success",
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
      getDocumentsAffiliate();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      toggleDialog();
    }
  };

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Spinner color="success" size="lg" variant="spinner" />
        </div>
      )}
      <div className="flex justify-end items-center">
        <Tooltip content="Nuevo documento">
          <Button endContent={<DocumentRegisterIcon />} onPress={handleDocumentRecord}>
            REGISTRAR
          </Button>
        </Tooltip>
      </div>
      <Divider className="bg-gray-400 w-full mt-2 mb-2" />
      <div className="flex gap-1 overflow-y-auto h-full">
        <div className="flex flex-col w-full">
          {documents.length > 0 ? (
            <Document affiliateId={affiliateId} documents={documents} />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm italic">
              SIN DOCUMENTOS REGISTRADOS
            </div>
          )}
        </div>
      </div>

      <ModalDocument
        action={registerFile}
        data={allDocuments}
        isUpdated={false}
        loading={isLoading}
        open={isDialogOpen}
        onOpenChange={toggleDialog}
      />
    </div>
  );
};
