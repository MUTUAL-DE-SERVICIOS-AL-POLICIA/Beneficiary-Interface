import { InputCustom } from "@/components/common";

interface Props {
  deathCertificateNumber: string;
  dateDeath: string | Date;
  reasonDeath: string;
}

export const Death = ({ deathCertificateNumber, dateDeath, reasonDeath }: Props) => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1 flex-1">
      <legend className="text-sm px-2 font-semibold">INFORMACIÓN DE DECESO</legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Nro certificado" type="text" value={deathCertificateNumber} />
        </div>
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Fecha fallecimiento" type="date" value={dateDeath} />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col w-full space-y-2 mt-6">
          <InputCustom label="Motivo fallecimiento" type="text" value={reasonDeath} />
        </div>
      </div>
    </fieldset>
  );
};
