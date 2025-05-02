"use client";
import React from "react";

import { InputCustom } from "@/components/common";
import { useAffiliate } from "@/utils/hooks/useAffiliate";

const EntryInfo = React.memo(() => {
  const { affiliateData } = useAffiliate();
  const { dateEntry, registration } = affiliateData;

  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2 font-semibold">Datos de ingreso policial</legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Fecha de ingreso" type="date" value={dateEntry ?? "Sin dato"} />
        </div>
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Matricula" type="text" value={registration ?? "Sin dato"} />
        </div>
      </div>
    </fieldset>
  );
});

EntryInfo.displayName = "EntryInfo";

export default EntryInfo;
