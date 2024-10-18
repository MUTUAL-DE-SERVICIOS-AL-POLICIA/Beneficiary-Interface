"use client"
import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { cn } from "@nextui-org/theme";
import { useState } from "react";

export default function AffiliateDataPage() {
  const [groupSelected, setGroupSelected] = useState<any>([]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-md uppercase font-semibold">Datos del Policia</h1>
      </div>
      <Divider className="bg-gray-400 mb-5 w-full" />
      <div className="px-3 py-1">
        <div className="flex gap-6">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row">
              <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
                <legend className="text-sm uppercase px-2">
                  <span className="flex items-center font-semibold">
                    Datos de ingreso policial
                  </span>
                </legend>
                <div className="flex gap-6">
                  <div className="flex flex-col w-1/2 space-y-2">
                    <Input
                      label="Fecha de ingreso"
                      labelPlacement="outside"
                      value="07-09-1976"
                      variant="faded"
                      radius="sm"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-2">
                    <Input
                      label="Matricula"
                      labelPlacement="outside"
                      value="44080ACG"
                      variant="faded"
                      radius="sm"
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
              <legend className="text-sm uppercase px-2">
                <span className="flex items-center font-semibold">
                  ESTADO DEL POLICIA
                </span>
              </legend>
              <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <Input
                    label="Estado"
                    labelPlacement="outside"
                    value="Servicio"
                    variant="faded"
                    radius="sm"
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <Input
                    label="Tipo"
                    labelPlacement="outside"
                    value="Activo"
                    variant="faded"
                    radius="sm"
                  />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
      <div className="px-3 py-1">
        <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
          <legend className="text-sm uppercase px-2">
            <span className="flex items-center font-semibold">
              Información de Servicio
            </span>
          </legend>
          <div className="flex gap-6">
            <div className="flex flex-col w-1/4 mt-2">
              <Input
                label="Años servicio"
                labelPlacement="outside"
                value="41"
                variant="faded"
                radius="sm"
              />
            </div>
            <div className="flex flex-col w-1/4 mt-2">
              <Input
                label="Meses servicio"
                labelPlacement="outside"
                value="10"
                variant="faded"
                radius="sm"
              />
            </div>
            <div className="flex flex-col w-1/4 mt-2">
              <Input
                label="Categoria"
                labelPlacement="outside"
                value="50%"
                variant="faded"
                radius="sm"
              />
            </div>
            <div className="flex flex-col w-1/4 mt-2">
              <Input
                label="Grado"
                labelPlacement="outside"
                value="CORONEL"
                variant="faded"
                radius="sm"
              />
            </div>
            <div className="flex flex-col w-1/3 space-y-2 mt-2">
              <Input
                label="Unidad Policial"
                labelPlacement="outside"
                value="TRANSITO"
                variant="faded"
                radius="sm"
              />
            </div>
          </div>
        </fieldset>
      </div>
      <div className="px-3 py-1">
        <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
          <legend className="text-sm uppercase px-2">
            <span className="flex items-center font-semibold">
              Información de desvinculación
            </span>
          </legend>
          <div className="flex gap-6">
            <div className="flex flex-col w-1/2 space-y-2">
              <Input
                label="Fecha de desvinculación"
                labelPlacement="outside"
                value="08-09-2020"
                variant="faded"
                radius="sm"
              />
            </div>
            <div className="flex flex-col w-1/2 space-y-2">
              <Input
                label="Motivo de desvinculación"
                labelPlacement="outside"
                value="Baja forzosa"
                variant="faded"
                radius="sm"
              />
            </div>
          </div>
        </fieldset>
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
                      "inline-flex max-w-full w-full bg-content1 m-0",
                      "hover:bg-content2 items-center justify-start",
                      "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                      "data-[selected=true]:border-default"
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
                      "inline-flex max-w-full w-full bg-content1 m-0 border-2 border-gray-400",
                      "hover:bg-content2 items-center justify-start",
                      "cursor-pointer rounded-lg gap-2 p-4 border-2 border-gray-500",
                      "data-[selected=true]:border-default"
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
                      "hover:bg-content2 items-center justify-start",
                      "cursor-pointer rounded-lg gap-2 p-4 border-2 border-gray-500",
                      "data-[selected=true]:border-default"
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