"use client";
import { Divider } from "@heroui/divider";
import { useEffect } from "react";

import { AddressInfo } from "./(sections)/AddressInfo";
import { DeathInfo } from "./(sections)/DeathInfo";
import { FinancialData } from "./(sections)/FinancialData";
import { PersonalInfo } from "./(sections)/PersonalInfo";

import { useAlert } from "@/hooks/useAlerts";
import { usePerson } from "@/hooks/usePerson";

export default function PersonDataPage() {
  // const [isEditing, setIsEditing] = useState(false);

  const { personData, error } = usePerson();
  const { Alert } = useAlert();

  useEffect(() => {
    if (error) {
      Alert({ message: "Error al obtener datos de una persona", variant: "error" });
    }
  }, [error]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-md uppercase font-semibold">Datos de la persona</h1>
        {/* <Button
          onClick={() => setIsEditing(!isEditing)}
          size="sm"
          className={isEditing ? "bg-lime-400 hover:bg-lime-500" : "bg-gray-400 hover:bg-gray-500"}
        >
          {isEditing ? "Guardar" : "Editar"}
        </Button> */}
      </div>
      <Divider className="bg-gray-400 mb-5 w-full" />
      <div className="px-3 py-1">
        <PersonalInfo person={personData} />{" "}
      </div>
      <div className="px-3 py-1">
        <div className="flex gap-6">
          <div className="flex flex-col w-1/2">
            <AddressInfo />
          </div>
          <div className="flex flex-col w-1/2">
            <DeathInfo person={personData} />
          </div>
        </div>
      </div>
      <div className="px-3 py-1">
        <FinancialData person={personData} />{" "}
      </div>
    </div>
  );
}
