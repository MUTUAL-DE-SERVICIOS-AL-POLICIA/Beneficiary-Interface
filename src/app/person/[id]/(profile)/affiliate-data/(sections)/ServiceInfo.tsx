"use client";
import React from "react";

import { InputCustom } from "@/components/common";
import { useAffiliate } from "@/utils/hooks/useAffiliate";

const ServiceInfo = React.memo(() => {
  const { affiliateData, degree, unit, category } = useAffiliate();

  const serviceYears = affiliateData?.serviceYears ?? "Sin dato";
  const serviceMonths = affiliateData?.serviceMonths ?? "Sin dato";
  const nameDegree = degree?.name ?? "Sin dato";
  const nameUnit = unit?.name ?? "Sin dato";
  const nameCategory = category?.name ?? "Sin dato";

  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2 font-semibold">Información de Servicio</legend>
      <div className="flex gap-5">
        <div className="flex flex-col w-1/3 mt-2">
          <InputCustom label="Años servicio" type="text" value={serviceYears} />
        </div>
        <div className="flex flex-col w-1/3 mt-2">
          <InputCustom label="Meses servicio" type="text" value={serviceMonths} />
        </div>
        <div className="flex flex-col w-1/3 mt-2">
          <InputCustom label="Categoría" type="text" value={nameCategory} />
        </div>
      </div>
      <div className="flex gap-5">
        <div className="flex flex-col w-1/3 mt-2">
          <InputCustom label="Grado" type="text" value={nameDegree} />
        </div>
        <div className="flex flex-col w-2/3 space-y-2 mt-2">
          <InputCustom label="Unidad Policial" type="text" value={nameUnit} />
        </div>
      </div>
    </fieldset>
  );
});

ServiceInfo.displayName = "ServiceInfo";

export default ServiceInfo;
