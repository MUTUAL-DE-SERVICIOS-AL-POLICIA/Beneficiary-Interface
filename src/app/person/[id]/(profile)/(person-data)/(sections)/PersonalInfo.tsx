"use client";
import { Checkbox } from "@heroui/checkbox";
import { useCallback, useMemo } from "react";

import { InputCustom } from "@/components/common";
import { Person } from "@/utils/interfaces";

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

const serviceFields = [{ label: "Lugar Nacimiento", key: "cityBirth", order: 8 }];

interface PersonalInfoProps {
  person: Person;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ person }) => {
  const renderField = useCallback((person: any, label: string, key: any) => {
    if (key === "isDuedateUndefined") {
      return (
        <div key={key} className="flex space-y-2 text-center justify-center">
          <Checkbox color="default" isSelected={person[key]} radius="sm">
            Indefinido
          </Checkbox>
        </div>
      );
    } else {
      return (
        <div key={key} className="space-y-2">
          {serviceFields.find((elemento) => elemento.key === key) ? (
            person[key] && person[key].status ? (
              <InputCustom label={label} value={(person[key] && person[key].name) ?? "Sin dato"} />
            ) : (
              // TODO: mostrar una alerta
              <></>
            )
          ) : (
            <InputCustom label={label} value={person[key]} />
          )}
        </div>
      );
    }
  }, []);

  const allFields = useMemo(() => {
    return [...fields, ...serviceFields].sort((a, b) => a.order - b.order);
  }, [fields, serviceFields]);

  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
      <legend className="text-sm uppercase px-2 font-semibold">Información Personal</legend>
      <div className="grid grid-cols-4 gap-6">
        {allFields.map(({ label, key }) => renderField(person, label, key))}
      </div>
    </fieldset>
  );
};
