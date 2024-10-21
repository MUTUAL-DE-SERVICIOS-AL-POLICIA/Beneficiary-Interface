import { InputCustom } from "@/components/input";
import { Checkbox } from "@nextui-org/checkbox";

const fields = [
  { label: "Primer nombre", key: "first_name" },
  { label: "Segundo nombre", key: "second_name" },
  { label: "Apellido paterno", key: "last_name" },
  { label: "Apellido materno", key: "mothers_last_name" },
  { label: "Carnet Identidad", key: "identity_card" },
  { label: "Fecha Nacimiento", key: "birth_date" },
  { label: "Lugar Nacimiento", key: "city_birth_id" },
  { label: "Género", key: "gender" },
  { label: "Estado civil", key: "civil_status" },
  { label: "Número telefónico", key: "cell_phone_number" },
];

interface PersonalInfoProps {
  beneficiary: any;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ beneficiary }) => (
  <fieldset className="border border-gray-400 rounded-md p-4 mb-1">
    <legend className="text-sm uppercase px-2 font-semibold">Información Personal</legend>
    <div className="grid grid-cols-4 gap-6">
      {fields.map(({ label, key }) => (
        <div className="space-y-2" key={key}>
          <InputCustom
            label={label}
            value={beneficiary[key]}
          />
        </div>
      ))}
      <div className="flex space-y-2 text-center justify-center">
        <Checkbox radius="sm" color="default">Indefinido</Checkbox>
      </div>
    </div>
  </fieldset>
);
