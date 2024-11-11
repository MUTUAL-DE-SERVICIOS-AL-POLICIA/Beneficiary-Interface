"use client"
import { InputCustom } from "@/components/input";

interface DeathInfoProps {
  beneficiary: any;
}

export const DeathInfo: React.FC<DeathInfoProps> = ({ beneficiary }) => (
  <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
    <legend className="text-sm uppercase px-2 font-semibold">Información deceso</legend>
    <div className="flex gap-6">
      <div className="flex flex-col w-1/2 space-y-2">
        <InputCustom
          label="Nro certificado"
          value={beneficiary.deathCertificateNumber ?? 'Sin dato'}
          type="text"
        />
      </div>
      <div className="flex flex-col w-1/2 space-y-2">
        <InputCustom
          label="Fecha fallecimiento"
          value={beneficiary.dateDeath ?? 'Sin dato'}
          type="date"
        />
      </div>
    </div>
    <div className="flex gap-6">
      <div className="flex flex-col w-full space-y-2 mt-6">
        <InputCustom
          label="Motivo fallecimiento"
          value={beneficiary.reasonDeath ?? 'Sin dato'}
          type="text"
        />
      </div>
    </div>
  </fieldset>
);
