"use client";
import React, { useState, useEffect } from "react";
import { addToast } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";

import { FileDossier } from "./information";
import { ManageFileDossier } from "./manage";

import { usePerson } from "@/utils/context/PersonContext";
import { getAffiliateShowFileDossiers } from "@/api/affiliate";

export const FileDossiers = () => {
  const [fileDossiers, setFileDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { affiliateId } = usePerson();
  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    getFileDossiersAffiliate();
  }, []);

  const switchEdit = () => {
    setOnEdit(!onEdit);
  };

  const canceledAll = () => {
    setOnEdit(false);
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

  return (
    <div className="relative flex flex-col h-full w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Spinner color="success" size="lg" variant="spinner" />
        </div>
      )}
      <ManageFileDossier
        toEdit
        toRegister
        existFileDossiers={fileDossiers.length > 0}
        switchEdit={switchEdit}
        onCancel={canceledAll}
        onEdit={onEdit}
        onRefreshFileDossiers={getFileDossiersAffiliate}
      />
      <div className="flex gap-1 flex-1 min-h-0">
        <FileDossier
          fileDossiers={fileDossiers}
          onCancel={canceledAll}
          onEdit={onEdit}
          onRefreshFileDossiers={getFileDossiersAffiliate}
        />
      </div>
    </div>
  );
};
