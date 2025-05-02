"use client";
import { InputCustom } from "@/components/common";

export const AddressInfo: React.FC = () => (
  <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
    <legend className="text-sm uppercase px-2 font-semibold">Dirección</legend>
    <div className="flex gap-6">
      <div className="flex flex-col w-1/3 space-y-2">
        <InputCustom label="Ciudad" type="text" value="" />
      </div>
      <div className="flex flex-col space-y-2">
        <InputCustom label="Zona" type="text" value="" />
      </div>
    </div>
    <div className="flex gap-6">
      <div className="flex flex-col w-full space-y-2 mt-6">
        <InputCustom label="Calle" type="text" value="" />
      </div>
    </div>
  </fieldset>
);
