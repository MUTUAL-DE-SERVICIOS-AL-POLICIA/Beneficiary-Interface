"use client";
import React from "react";

import { InputCustom } from "@/components/input";
import { useAffiliate } from "@/utils/hooks/useAffiliate";

const StateInfo = React.memo(() => {
  const { affiliateData, affiliateState } = useAffiliate();
  const { type } = affiliateData;
  const { name } = affiliateState;

  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2 font-semibold">Estado del policía</legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2">
          <InputCustom label="Estado" type="text" value={name ?? "Sin dato"} />
        </div>
        <div className="flex flex-col w-1/2">
          <InputCustom label="Tipo" type="text" value={type ?? "Sin dato"} />
        </div>
      </div>
    </fieldset>
  );
});

StateInfo.displayName = "StateInfo";

export default StateInfo;
