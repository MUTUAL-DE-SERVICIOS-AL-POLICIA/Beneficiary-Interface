import { useCallback, useMemo } from "react";

import { PhonesDrawer } from "./phones";

import { InputCustom, DateInputCustom } from "@/components/common";
import { Person as PersonInterface } from "@/utils/interfaces";

const fields = [
  { label: "Primer nombre", key: "firstName", order: 1 },
  { label: "Segundo nombre", key: "secondName", order: 2 },
  { label: "Apellido paterno", key: "lastName", order: 3 },
  { label: "Apellido materno", key: "mothersLastName", order: 4 },
  { label: "Carnet Identidad", key: "identityCard", order: 5 },
  { label: "Caducidad carnet", key: "isDuedateUndefined", order: 6 },
  { label: "Fecha Nacimiento", key: "birthDate", order: 7 },
  { label: "Género", key: "gender", order: 9 },
  { label: "Estado civil", key: "civilStatus", order: 10 },
  { label: "Número de teléfono", key: "phoneNumbers", order: 11 },
  { label: "Número de celular", key: "cellPhoneNumbers", order: 12 },
];

const serviceFields = [{ label: "Lugar Nacimiento", key: "cityBirth", order: 8 }];

interface Props {
  person: PersonInterface;
}

export const Basic = ({ person }: Props) => {
  const renderField = useCallback((person: any, label: string, key: any) => {
    if (key === "cellPhoneNumbers") {
      const phoneNumbers = [];

      if (person.cellPhoneNumber) {
        const phoneNumbersArray = person.cellPhoneNumber
          .split(",")
          .map((num: string) => num.trim())
          .filter(Boolean);

        phoneNumbers.push(...phoneNumbersArray);
      }

      return (
        <div key={key}>
          <PhonesDrawer label={label} labelDrawer="Celulares" phoneNumbers={phoneNumbers} />
        </div>
      );
    } else if (key === "phoneNumbers") {
      const phoneNumbers = [];

      if (person.phoneNumber) {
        const phoneNumbersArray = person.phoneNumber
          .split(",")
          .map((num: string) => num.trim())
          .filter(Boolean);

        phoneNumbers.push(...phoneNumbersArray);
      }

      return (
        <div key={key}>
          <PhonesDrawer label={label} phoneNumbers={phoneNumbers} />
        </div>
      );
    } else if (key === "isDuedateUndefined") {
      if (person[key] === true) {
        return (
          <div key={key} className="flex space-y-2 text-center justify-center">
            <InputCustom label={label} type="text" value="Indefinido" />
          </div>
        );
      }

      return (
        <div key={key} className="flex space-y-2 justify-center">
          <DateInputCustom
            isReadOnly
            label={label}
            labelPlacement="outside"
            radius="sm"
            value={person.dueDate}
            variant="faded"
          />
        </div>
      );
    } else if (key === "birthDate") {
      return (
        <div key={key} className="flex space-y-2 justify-center">
          <DateInputCustom
            isReadOnly
            label={label}
            labelPlacement="outside"
            radius="sm"
            value={person[key]}
            variant="faded"
          />
        </div>
      );
    } else {
      return (
        <div key={key} className="space-y-2">
          {serviceFields.find((elemento) => elemento.key === key) ? (
            person[key] && person[key].status ? (
              <InputCustom label={label} value={(person[key] && person[key].name) ?? "Sin registro"} />
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
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1 flex-1">
      <legend className="text-sm px-2 font-semibold">INFORMACIÓN PERSONAL</legend>
      <div className="grid grid-cols-4 gap-6">
        {allFields.map(({ label, key }) => renderField(person, label, key))}
      </div>
    </fieldset>
  );
};
