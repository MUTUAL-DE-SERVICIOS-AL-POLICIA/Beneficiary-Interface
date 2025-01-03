"use client";
import { InputCustom } from "@/components/input";

interface FinancialDataProps {
  beneficiary: any;
}

export const FinancialData: React.FC<FinancialDataProps> = ({ beneficiary }) => (
  <fieldset className="border border-gray-400 rounded-md p-4 mb-6">
    <legend className="text-sm uppercase px-2 font-semibold">Datos Financieros</legend>
    <div className="flex gap-6">
      <div className="flex flex-col w-full space-y-2">
        <InputCustom
          label="Número de cuenta"
          type="text"
          value={beneficiary.accountNumber ?? "Sin dato"}
        />
      </div>
      <div className="flex flex-col w-full space-y-2">
        {beneficiary.financialEntity && beneficiary.financialEntity.status && (
          <InputCustom
            label="Entidad financiera"
            type="text"
            value={beneficiary.financialEntity.name ?? "Sin dato"}
          />
        )}
      </div>
      <div className="space-y-2">
        <InputCustom
          label="Estado Sigep"
          type="text"
          value={beneficiary.sigepStatus ?? "Sin dato"}
        />
      </div>
    </div>
  </fieldset>
);
