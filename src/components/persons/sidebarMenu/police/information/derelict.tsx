"use client";

import { DateInputCustom, InputCustom } from "@/components/common";

interface Props {
  dateDerelict: string | Date;
  reasonDerelict: string;
}

export const Derelict = ({ dateDerelict, reasonDerelict }: Props) => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1 flex-1">
      <legend className="text-sm px-2">
        <span className="flex items-center font-semibold">INFORMACIÓN DE DESVINCULACIÓN</span>
      </legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2 space-y-2">
          <DateInputCustom label="Fecha de desvinculación" value={dateDerelict} />
        </div>
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Motivo de desvinculación" type="text" value={reasonDerelict} />
        </div>
      </div>
    </fieldset>
  );
};
