"use client";
import { toast } from "@heroui/react";
import { useState } from "react";

import { getPersonRecords } from "@/api/person";
import { DrawerRecords } from "@/components";
import { usePerson } from "@/context/PersonContext";

export const Options = () => {
  const [dataRecords, setDataRecords] = useState<any[]>([]);
  const { person } = usePerson();

  const handlePress = async () => {
    const { error, message, data } = await getPersonRecords(String(person.id));

    if (error) {
      toast.danger(message);

      return;
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
