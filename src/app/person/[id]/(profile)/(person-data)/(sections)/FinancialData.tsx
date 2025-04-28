"use client";
import { InputCustom } from "@/components/common";
import { Person } from "@/domain";

interface FinancialDataProps {
  person: Person;
}

export const FinancialData: React.FC<FinancialDataProps> = ({ person }) => {
  const { accountNumber, financialEntity, sigepStatus } = person;

  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-6">
      <legend className="text-sm uppercase px-2 font-semibold">Datos Financieros</legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-full space-y-2">
          <InputCustom label="Número de cuenta" type="text" value={accountNumber ?? "Sin dato"} />
        </div>
        <div className="flex flex-col w-full space-y-2">
          <InputCustom label="Entidad financiera" type="text" value={financialEntity?.name ?? "Sin dato"} />
        </div>
        <div className="space-y-2">
          <InputCustom label="Estado Sigep" type="text" value={sigepStatus ?? "Sin dato"} />
        </div>
      </div>
    </fieldset>
  );
};
