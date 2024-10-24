import { InputCustom } from "@/components/input"

interface AffiliateProps {
  affiliate: any
}

export const ServiceInfo:React.FC<AffiliateProps> = ({ affiliate}) => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2 font-semibold">
        Información de Servicio
      </legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/4 mt-2">
          <InputCustom
            label="Años servicio"
            value={affiliate.serviceYears ?? 'Sin dato'}
            type="text"
          />
        </div>
        <div className="flex flex-col w-1/4 mt-2">
          <InputCustom
            label="Meses servicio"
            value={affiliate.serviceMonths ?? 'Sin dato'}
            type="text"
          />
        </div>
        <div className="flex flex-col w-1/4 mt-2">
          <InputCustom
            label="Categoria"
            value={affiliate.category.name ?? 'Sin dato'}
            type="text"
          />
        </div>
        <div className="flex flex-col w-1/4 mt-2">
          <InputCustom
            label="Grado"
            value={affiliate.degree.name ?? 'Sin dato'}
            type="text"
          />
        </div>
        <div className="flex flex-col w-1/3 space-y-2 mt-2">
          <InputCustom
            label="Unidad Policial"
            value={affiliate.unit.name ?? 'Sin dato'}
            type="text"
          />
        </div>
      </div>
    </fieldset>
  )
}