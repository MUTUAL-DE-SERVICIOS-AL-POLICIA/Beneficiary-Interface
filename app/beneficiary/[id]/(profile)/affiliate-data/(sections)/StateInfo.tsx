import { InputCustom } from "@/components/input"
import React from "react"

interface AffiliateProps {
  affiliate: any
}

export const StateInfo:React.FC<AffiliateProps> = React.memo(({ affiliate }) => {

  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2 font-semibold">
        Estado del policía
      </legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2">
          <InputCustom
            label="Estado"
            value={affiliate.affiliateState ?? 'Sin dato'}
            type="text"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <InputCustom
            label="Tipo"
            value={affiliate.type ?? 'Sin dato'}
            type="text"
          />
        </div>
      </div>
    </fieldset>
  )
})