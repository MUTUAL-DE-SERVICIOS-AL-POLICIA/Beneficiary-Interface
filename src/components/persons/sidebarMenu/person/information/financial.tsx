import { InputCustom } from "@/components/common";

interface Props {
  accountNumber: string;
  sigepStatus: string;
  nameFinancialEntity: string;
}

export const Financial = ({ accountNumber, sigepStatus, nameFinancialEntity }: Props) => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-6 flex-1">
      <legend className="text-sm px-2 font-semibold">DATOS FINANCIEROS</legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-full space-y-2">
          <InputCustom label="Número de cuenta" type="text" value={accountNumber} />
        </div>
        <div className="flex flex-col w-full space-y-2">
          <InputCustom label="Entidad financiera" type="text" value={nameFinancialEntity} />
        </div>
        <div className="flex flex-col w-full space-y-2">
          <InputCustom label="Estado sigep" type="text" value={sigepStatus} />
        </div>
      </div>
    </fieldset>
  );
};
