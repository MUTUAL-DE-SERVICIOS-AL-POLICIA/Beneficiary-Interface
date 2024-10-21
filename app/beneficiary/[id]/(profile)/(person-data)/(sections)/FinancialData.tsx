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
          value={beneficiary.account_number ?? "Sin dato"}
          type="text"
        />
      </div>
      <div className="space-y-2">
        <InputCustom
          label="Estado Sigep"
          value={beneficiary.sigep_status ?? "Sin dato"}
          type="text"
        />
      </div>
    </div>
  </fieldset>
);
