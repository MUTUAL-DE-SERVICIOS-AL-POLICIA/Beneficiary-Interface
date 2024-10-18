"use client"
import { Button } from "@nextui-org/button"
import { useEffect, useState } from "react"
import { Divider } from '@nextui-org/divider';
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { getBeneficiary } from "@/app/beneficiary/service";
import { useParams } from "next/navigation";

export default function PersonDataPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [ beneficiary, setBeneficiary ] = useState<any>({})

  const { id } = useParams()

  useEffect(() => {
    try {
      getBeneficiary(`${id}`).then((response: any) => {
        setBeneficiary(response)
      })
      .catch((error:any) => {
        throw error
      })
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-md uppercase font-semibold">Datos de la persona</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          size="sm"
          className={isEditing ? "bg-lime-400 hover:bg-lime-500" : "bg-gray-400 hover:bg-gray-500"}
        >
          {isEditing ? "Guardar" : "Editar"}
        </Button>
      </div>
      <Divider className="bg-gray-400 mb-5 w-full"/>
      <div className="px-3 py-1">
        <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
          <legend className="text-sm uppercase px-2">
            <span className="flex items-center font-semibold">
              Información Personal
            </span>
          </legend>
          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2">
              <Input
                label="Primer nombre"
                labelPlacement="outside"
                placeholder="Primer nombre"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.first_name ?? "Sin dato"}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Segundo nombre"
                labelPlacement="outside"
                placeholder="Segundo nombre"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.second_name ?? "Sin dato"}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Apellido paterno"
                labelPlacement="outside"
                placeholder="Apellido paterno"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.last_name ?? "Sin dato"}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Apellido materno"
                labelPlacement="outside"
                placeholder="Apellido materno"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.mothers_last_name ?? "Sin dato"}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Carnet Identidad"
                labelPlacement="outside"
                placeholder="Carnet Identidad"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.identity_card ?? "Sin dato"}
              />
            </div>
            <div className="flex space-y-2 text-center justify center">
              <Checkbox radius="sm" color="default">Indefinido</Checkbox>
            </div>
            <div className="space-y-2">
              <Input
                label="Fecha Nacimiento"
                labelPlacement="outside"
                placeholder="Fecha Nacimiento"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.birth_date ?? "Sin dato"}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Lugar Nacimiento"
                labelPlacement="outside"
                placeholder="Lugar Nacimiento"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.city_birth_id ?? "Sin dato"}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Genero"
                labelPlacement="outside"
                placeholder="Masculino"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.gender ?? "Sin dato"}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Estado civil"
                labelPlacement="outside"
                placeholder="Soltero"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.civil_status ?? "Sin dato"}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Número telefonico"
                labelPlacement="outside"
                placeholder="Soltero"
                name=""
                type="text"
                variant="faded"
                radius="sm"
                value={beneficiary.cell_phone_number ?? "Sin dato"}
              />
            </div>
          </div>
        </fieldset>
      </div>
      <div className="px-3 py-1">
        <div className="flex gap-6">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row">
              <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
                <legend className="text-sm uppercase px-2">
                  <span className="flex items-center font-semibold">
                    Dirección
                  </span>
                </legend>
                <div className="flex gap-6">
                  <div className="flex flex-col w-1/3 space-y-2">
                    <Input
                      label="Ciudad"
                      labelPlacement="outside"
                      value="COCHABAMBA"
                      variant="faded"
                      radius="sm"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Input
                      label="Zona"
                      labelPlacement="outside"
                      value="VILLA EL CARMEN"
                      variant="faded"
                      radius="sm"
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex flex-col w-full space-y-2 mt-6 ">
                    <Input
                      label="Calle"
                      labelPlacement="outside"
                      value="AV. EUSEBIO GUTIERREZ"
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
                  Información deceso
                </span>
              </legend>
              <div className="flex gap-6">
                <div className="flex flex-col w-1/2 space-y-2">
                  <Input
                    label="Nro certificado"
                    labelPlacement="outside"
                    value={beneficiary.death_certificate_number ?? 'Sin dato'}
                    type="text"
                    variant="faded"
                    radius="sm"
                  />
                </div>
                <div className="flex flex-col w-1/2 space-y-2">
                  <Input
                    label="Fecha fallecimiento"
                    labelPlacement="outside"
                    value={beneficiary.date_death ?? 'Sin dato'}
                    variant="faded"
                    radius="sm"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col w-full space-y-2 mt-6">
                  <Input
                    label="Motivo fallecimiento"
                    labelPlacement="outside"
                    value={beneficiary.reason_death ?? 'Sin dato'}
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
        <fieldset className="border border-gray-400 rounded-md p-4 mb-6">
          <legend className="text-sm uppercase px-2">
            <span className="flex items-center font-semibold">
              Datos Financieros
            </span>
          </legend>
          <div className="flex gap-6">
            <div className="flex flex-col w-full space-y-2">
              <Input
                label="Número de cuenta"
                labelPlacement="outside"
                value={beneficiary.account_number ?? "Sin dato"}
                variant="faded"
                radius="sm"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Estado Sigep"
                labelPlacement="outside"
                value={beneficiary.sigep_status ?? "Sin dato"}
                variant="faded"
                radius="sm"
              />
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  )
}