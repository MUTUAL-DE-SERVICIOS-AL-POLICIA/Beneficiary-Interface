import { InputCustom } from "@/components/input";

export const EntryInfo = () => (
  <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
    <legend className="text-sm uppercase px-2 font-semibold">
      Datos de ingreso policial
    </legend>
    <div className="flex gap-6">
      <div className="flex flex-col w-1/2 space-y-2">
        <InputCustom
          label="Fecha de ingreso"
          value="07/09/1975"
          type="date"
        />
      </div>
      <div className="flex flex-col w-1/2 space-y-2">
        <InputCustom
          label="Matricula"
          value="44S0AG"
          type="text"
        />
      </div>
    </div>
  </fieldset>
)
