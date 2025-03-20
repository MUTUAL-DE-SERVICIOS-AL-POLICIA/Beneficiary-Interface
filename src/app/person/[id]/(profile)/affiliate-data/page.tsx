"use client";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { useEffect, useState } from "react";

import DerelictInfo from "./(sections)/DerelictInfo";
import AffiliateDocuments from "./(sections)/Documents";
import EntryInfo from "./(sections)/EntryInfo";
import ServiceInfo from "./(sections)/ServiceInfo";
import StateInfo from "./(sections)/StateInfo";

import { getAffiliateDocuments } from "@/api/affiliate/api";
import { createUpdateDocument, getAllDocuments } from "@/api/document/api";
import { ModalDocument } from "@/components/modal-document";
import { useAffiliate } from "@/hooks/useAffiliate";
import { useAlert } from "@/hooks/useAlerts";

export default function AffiliateDataPage() {
  const [documents, setDocuments] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allDocuments, setAllDocuments] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const { Alert } = useAlert();
  const { affiliateData } = useAffiliate();
  const { id: affiliateId } = affiliateData;

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const handleDocumentRecord = async () => {
    const { error, message, documents } = await getAllDocuments();

    setAllDocuments(documents);
    toggleDialog();
    if (error) {
      Alert({ message: message, variant: "error" });
    }
  };

  const registerFile = async (file: any, selectedKey: any) => {
    const formData = new FormData();

    formData.append("documentPdf", file);
    setIsLoading(true);
    if (affiliateId !== null) {
      const { error, message } = await createUpdateDocument(affiliateId, selectedKey, formData);

      if (!error && affiliateId !== null) {
        const { affiliateDocuments } = await getAffiliateDocuments(affiliateId);

        setDocuments(affiliateDocuments);
        Alert({
          message: message,
          variant: "success",
        });
      } else {
        Alert({
          message: message,
          variant: "error",
        });
      }
      setIsLoading(false);
      toggleDialog();
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (affiliateId !== null) {
        const { error, message, statusDocuments, affiliateDocuments } =
          await getAffiliateDocuments(affiliateId);

        if (!error) {
          setDocuments(affiliateDocuments);
          setStatus(statusDocuments);
        } else {
          Alert({ message, variant: "error" });
        }
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-md uppercase font-semibold">Datos del Policia</h1>
      </div>
      <Divider className="bg-gray-400 mb-5 w-full" />
      <div className="px-3 py-1">
        <div className="flex gap-6">
          <div className="flex flex-col w-1/2">
            <EntryInfo />
          </div>
          <div className="flex flex-col w-1/2">
            <StateInfo />
          </div>
        </div>
      </div>
      <div className="px-3 py-1">
        <ServiceInfo />
      </div>
      <div className="px-3 py-1">
        <DerelictInfo />
      </div>
      <div className="flex justify-between items-center mr-3">
        <h1 className="text-md uppercase font-semibold">Documentos presentados</h1>
        <Tooltip content="Registrar nuevo documento">
          <Button
            endContent={<FontAwesomeIcon icon={faFolderPlus} size="xl" />}
            onPress={handleDocumentRecord}
          >
            CREAR
          </Button>
        </Tooltip>
      </div>
      <Divider className="bg-gray-400 mb-5 w-full" />
      <div className="px-3 py-1">
        <div className="flex gap-1">
          <div className="flex flex-col w-full">
            <AffiliateDocuments affiliateId={affiliateId} documents={documents} status={status} />
          </div>
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
}
