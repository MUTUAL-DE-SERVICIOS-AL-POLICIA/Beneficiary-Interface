import { InputCustom } from "@/components/input"

export const ServiceInfo = () => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2 font-semibold">
        Información de Servicio
      </legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/4 mt-2">
          <InputCustom
            label="Años servicio"
            value="41"
            type="text"
          />
        </div>
        <div className="flex flex-col w-1/4 mt-2">
          <InputCustom
            label="Meses servicio"
            value="10"
            type="text"
          />
        </div>
        <div className="flex flex-col w-1/4 mt-2">
          <InputCustom
            label="Categoria"
            value="50%"
            type="text"
          />
        </div>
        <div className="flex flex-col w-1/4 mt-2">
          <InputCustom
            label="Grado"
            value="CORONEL"
            type="text"
          />
        </div>
        <div className="flex flex-col w-1/3 space-y-2 mt-2">
          <InputCustom
            label="Unidad Policial"
            value="TRANSITO"
            type="text"
          />
        </div>
      </div>
    </fieldset>
  )
}