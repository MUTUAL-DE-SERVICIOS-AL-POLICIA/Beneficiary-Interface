"use client";
import React, { useState, useEffect } from "react";
import { addToast } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";

import { FileDossier, ModalFileDossier } from "./information";

import { usePerson } from "@/utils/context/PersonContext";
import { getAffiliateShowFileDossiers } from "@/api/affiliate";

export const FileDossiers = () => {
  const [fileDossiers, setFileDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { affiliateId } = usePerson();

  useEffect(() => {
    getFileDossiersAffiliate();
  }, []);

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
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Spinner color="success" size="lg" variant="spinner" />
        </div>
      )}
      <div className="flex justify-end items-center">
        <ModalFileDossier onRefreshFileDossiers={getFileDossiersAffiliate} />
      </div>
      <Divider className="bg-gray-400 mb-2 mt-2 w-full" />
      <div className="flex gap-1 h-full">
        <FileDossier fileDossiers={fileDossiers} />
      </div>
    </div>
  );
};
