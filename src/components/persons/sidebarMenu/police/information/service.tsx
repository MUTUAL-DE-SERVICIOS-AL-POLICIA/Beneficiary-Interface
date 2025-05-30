"use client";

import { InputCustom } from "@/components/common";

interface Props {
  serviceYears: number | string;
  serviceMonths: number | string;
  nameDegree: string;
  nameUnit: string;
  nameCategory: string;
}

export const Service = ({ serviceYears, serviceMonths, nameDegree, nameUnit, nameCategory }: Props) => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1 flex-1">
      <legend className="text-sm px-2 font-semibold">INFORMACIÓN DE SERVICIO</legend>
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
};
