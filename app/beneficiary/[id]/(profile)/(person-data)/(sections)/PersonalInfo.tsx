"use client"
import { InputCustom } from "@/components/input";
import { Checkbox } from "@nextui-org/checkbox";
import { useCallback, useMemo } from "react";

const fields = [
  { label: "Primer nombre", key: "firstName", order: 1 },
  { label: "Segundo nombre", key: "secondName", order: 2 },
  { label: "Apellido paterno", key: "lastName", order: 3 },
  { label: "Apellido materno", key: "mothersLastName", order: 4 },
  { label: "Carnet Identidad", key: "identityCard", order: 5 },
  { label: "", key: "isDuedateUndefined", order: 6 },
  { label: "Fecha Nacimiento", key: "birthDate", order: 7 },
  { label: "Género", key: "gender", order: 9 },
  { label: "Estado civil", key: "civilStatus", order: 10 },
  { label: "Número telefónico", key: "cellPhoneNumber", order: 11 },
];

const serviceFields = [
  { label: "Lugar Nacimiento", key: "cityBirth", order: 8 },
]


interface PersonalInfoProps {
  beneficiary: any;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ beneficiary }) => {

  const renderField = useCallback((beneficiary: any, label: string, key: any) => {
      if (key === 'isDuedateUndefined') {
        return (
          <div className="flex space-y-2 text-center justify-center" key={key}>
            <Checkbox isSelected={beneficiary[key]} radius="sm" color="default">Indefinido</Checkbox>
          </div>
        )
      } else {
        return (
          <div className="space-y-2" key={key}>
            {serviceFields.find(elemento => elemento.key === key) ? (
              (beneficiary[key] && beneficiary[key].status) ? (
                <InputCustom
                  label={label}
                  value={(beneficiary[key] && beneficiary[key].name) ?? 'Sin dato'}
                />
              ) :
                // TODO: mostrar una alerta
                <></>
            ) :
              <InputCustom
                label={label}
                value={beneficiary[key]}
              />
            }
          </div>
        )
      }
  }, [])

  const allFields = useMemo(() => {
    return [...fields, ...serviceFields].sort((a, b) => a.order - b.order);
  }, [fields, serviceFields])


  return (<fieldset className="border border-gray-400 rounded-md p-4 mb-1">
    <legend className="text-sm uppercase px-2 font-semibold">Información Personal</legend>
    <div className="grid grid-cols-4 gap-6">
      {allFields.map(
        ({ label, key }) => renderField(beneficiary, label, key))
      }
    </div>
  </fieldset>)
};
