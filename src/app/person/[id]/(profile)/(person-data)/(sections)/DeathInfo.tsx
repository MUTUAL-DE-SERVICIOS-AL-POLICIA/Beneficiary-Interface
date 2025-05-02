"use client";
import { InputCustom } from "@/components/common";
import { Person } from "@/utils/interfaces";

interface DeathInfoProps {
  person: Person;
}

export const DeathInfo: React.FC<DeathInfoProps> = ({ person }) => {
  const { deathCertificateNumber, dateDeath, reasonDeath } = person;

  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2 font-semibold">Información deceso</legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Nro certificado" type="text" value={deathCertificateNumber ?? "Sin dato"} />
        </div>
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Fecha fallecimiento" type="date" value={dateDeath ?? "Sin dato"} />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col w-full space-y-2 mt-6">
          <InputCustom label="Motivo fallecimiento" type="text" value={reasonDeath ?? "Sin dato"} />
        </div>
      </div>
    </fieldset>
  );
};
