"use client";
import React from "react";

import { InputCustom } from "@/components/common";
import { useAffiliate } from "@/utils/hooks/useAffiliate";

const DerelictInfo = React.memo(() => {
  const { affiliateData } = useAffiliate();
  const { dateDerelict, reasonDerelict } = affiliateData;

  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2">
        <span className="flex items-center font-semibold">Información de desvinculación</span>
      </legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Fecha de desvinculación" type="date" value={dateDerelict ?? "Sin dato"} />
        </div>
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Motivo de desvinculación" type="text" value={reasonDerelict ?? "Sin dato"} />
        </div>
      </div>
    </fieldset>
  );
});

DerelictInfo.displayName = "DerrelictInfo";

export default DerelictInfo;
