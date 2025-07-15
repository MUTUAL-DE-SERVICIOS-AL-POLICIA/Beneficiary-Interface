"use client";
import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";

import { Document } from "./information";
import { ManageDocument } from "./manage";

import { getAffiliateDocuments } from "@/api/affiliate";
import { usePerson } from "@/utils/context/PersonContext";

export const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { affiliateId } = usePerson();
  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    getDocumentsAffiliate();
  }, []);

  const switchEdit = () => {
    setOnEdit(!onEdit);
  };

  const canceledAll = () => {
    setOnEdit(false);
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

  return (
    <div className="relative flex flex-col h-full w-full min-h-0">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Spinner color="success" size="lg" variant="spinner" />
        </div>
      )}
      <ManageDocument
        toRegister
        existDocuments={documents.length > 0}
        switchEdit={switchEdit}
        onCancel={canceledAll}
        onEdit={onEdit}
        onRefreshDocuments={getDocumentsAffiliate}
      />
      <div className="flex gap-1 flex-1 min-h-0">
        <Document
          documents={documents}
          onCancel={canceledAll}
          onEdit={onEdit}
          onRefreshDocuments={getDocumentsAffiliate}
        />
      </div>
    </div>
  );
};
