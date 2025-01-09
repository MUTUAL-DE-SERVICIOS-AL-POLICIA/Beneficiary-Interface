"use client";
import React from "react";

import { InputCustom } from "@/components/input";

interface AffiliateProps {
  affiliate: any;
}

const ServiceInfo: React.FC<AffiliateProps> = React.memo(({ affiliate }) => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2 font-semibold">Información de Servicio</legend>
      <div className="flex gap-5">
        <div className="flex flex-col w-1/3 mt-2">
          <InputCustom
            label="Años servicio"
            type="text"
            value={affiliate.serviceYears ?? "Sin dato"}
          />
        </div>
        <div className="flex flex-col w-1/3 mt-2">
          <InputCustom
            label="Meses servicio"
            type="text"
            value={affiliate.serviceMonths ?? "Sin dato"}
          />
        </div>
        <div className="flex flex-col w-1/3 mt-2">
          <InputCustom
            label="Categoria"
            type="text"
            value={(affiliate.category && affiliate.category.name) ?? "Sin dato"}
          />
        </div>
      </div>
      <div className="flex gap-5">
        <div className="flex flex-col w-1/3 mt-2">
          <InputCustom
            label="Grado"
            type="text"
            value={(affiliate.degree && affiliate.degree.name) ?? "Sin dato"}
          />
        </div>
        <div className="flex flex-col w-2/3 space-y-2 mt-2">
          <InputCustom
            label="Unidad Policial"
            type="text"
            value={(affiliate.unit && affiliate.unit.name) ?? "Sin dato"}
          />
        </div>
      </div>
    </fieldset>
  );
});

ServiceInfo.displayName = "ServiceInfo";

export default ServiceInfo;
