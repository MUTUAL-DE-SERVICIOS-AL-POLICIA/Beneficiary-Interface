import { InputCustom } from "@/components/input"

export const DerelictInfo = () => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2">
        <span className="flex items-center font-semibold">
          Información de desvinculación
        </span>
      </legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom
            label="Fecha de desvinculación"
            value="08-09-2020"
            type="date"
          />
        </div>
        <div className="flex flex-col w-1/2 space-y-2">
          <InputCustom
            label="Motivo de desvinculación"
            value="Baja forzosa"
            type="text"
          />
        </div>
      </div>
    </fieldset>
  )
}