"use client"
import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox";
import { Divider } from "@nextui-org/divider";
import { cn } from "@nextui-org/theme";
import { useEffect, useState } from "react";
import { EntryInfo } from "./(sections)/EntryInfo";
import { StateInfo } from "./(sections)/StateInfo";
import { ServiceInfo } from "./(sections)/ServiceInfo";
import { DerelictInfo } from "./(sections)/DerelictInfo";
import { useParams } from "next/navigation";

export default function AffiliateDataPage() {
  const [groupSelected, setGroupSelected] = useState<any>([]);
  const [ affiliate, setAffiliate ] = useState<any>({})

  const { id } = useParams()

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-md uppercase font-semibold">Datos del Policia</h1>
      </div>
      <Divider className="bg-gray-400 mb-5 w-full" />
      <div className="px-3 py-1">
        <div className="flex gap-6">
          <div className="flex flex-col w-1/2">
            <EntryInfo/>
          </div>
          <div className="flex flex-col w-1/2">
            <StateInfo />
          </div>
        </div>
      </div>
      <div className="px-3 py-1">
        <ServiceInfo/>
      </div>
      <div className="px-3 py-1">
        <DerelictInfo/>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-md uppercase font-semibold">Documentos presentados</h1>
      </div>
      <Divider className="bg-gray-400 mb-5 w-full"/>
      <div className="px-3 py-1">
        <div className="flex gap-1">
          <div className="flex flex-col w-full">
            <div className="flex flex-">
              <CheckboxGroup
                value={groupSelected}
                onChange={setGroupSelected}
                classNames={{
                  base: "w-full"
                }}
              >
                <Checkbox
                  value="1"
                  color="default"
                  classNames={{
                    base: cn(
                      "inline-flex max-w-full w-full bg-content1 m-0 border-gray-400",
                      "hover:bg-content3 items-center justify-start",
                      "dark:hover:border-lime-400 bg-content2 items-center justify-start",
                      "cursor-pointer rounded-lg gap-2 p-4 border",
                      "data-[selected=true]:border"
                    ),
                    label: "w-full",
                  }}
                >
                  <div className="w-full flex justify-between gap-2">
                    Algún requisito para hacer un trámite en la MUSERPOL.
                  </div>
                </Checkbox>
                <Checkbox
                  value="dos"
                  color="default"
                  classNames={{
                    base: cn(
                      "inline-flex max-w-full w-full bg-content1 m-0 border-gray-400",
                      "hover:bg-content3 items-center justify-start",
                      "dark:hover:border-lime-400 bg-content2 items-center justify-start",
                      "cursor-pointer rounded-lg gap-2 p-4 border",
                      "data-[selected=true]:border"
                    ),
                    label: "w-full",
                  }}
                >
                  <div className="w-full flex justify-between gap-2">
                    Algún otro requisito mas para hacer un trámite en la MUSERPOL.
                  </div>
                </Checkbox>
                <Checkbox
                  value="tre"
                  color="default"
                  classNames={{
                    base: cn(
                      "inline-flex max-w-full w-full bg-content1 m-0 border-2 border-gray-400",
                      "hover:bg-content3 items-center justify-start",
                      "dark:hover:border-lime-400 bg-content2 items-center justify-start",
                      "cursor-pointer rounded-lg gap-2 p-4 border",
                      "data-[selected=true]:border"
                    ),
                    label: "w-full",
                  }}
                >
                  <div className="w-full flex justify-between gap-2">
                    Otro documento más entregado por el afiliado
                  </div>
                </Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}