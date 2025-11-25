"use client";
import { addToast } from "@heroui/toast";
import { useState } from "react";

import { getPersonRecords } from "@/api/person";
import { DrawerRecords } from "@/components/common";
import { usePerson } from "@/utils/context/PersonContext";

export const Options = () => {
  const [dataRecords, setDataRecords] = useState<any[]>([]);
  const { person } = usePerson();

  const handlePress = async () => {
    const { error, message, data } = await getPersonRecords(String(person.id));

    if (error) {
      addToast({
        title: "Ocurrió un error",
        description: message,
        color: "danger",
        timeout: 3500,
        shouldShowTimeoutProgress: true,
      });
    }
    setDataRecords(data);
  };

  return (
    <div className="flex justify-end items-center gap-1">
      <div className="flex gap-1">
        <DrawerRecords data={dataRecords} getData={handlePress} />
      </div>
    </div>
  );
};
