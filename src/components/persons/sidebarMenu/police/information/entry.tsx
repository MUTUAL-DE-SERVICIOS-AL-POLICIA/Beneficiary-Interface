import { InputCustom } from "@/components/common";

interface Props {
  dateEntry: String | Date;
  registration: string;
}
export const Entry = ({ dateEntry, registration }: Props) => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1 flex-1">
      <legend className="text-sm px-2 font-semibold">DATOS DE INGRESO POLICIAL</legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Fecha de ingreso" type="date" value={dateEntry} />
        </div>
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom label="Matricula" type="text" value={registration} />
        </div>
      </div>
    </fieldset>
  );
};
