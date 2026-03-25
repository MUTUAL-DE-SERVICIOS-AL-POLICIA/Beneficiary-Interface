"use client";
import { addToast } from "@heroui/toast";
import { useState } from "react";

import { getPersonRecords } from "@/api/person";
import { DrawerRecords } from "@/components/common";
import { usePerson } from "@/utils/context/PersonContext";
import { usePermissions } from "@/utils/context/PermissionsContext";
import { useServerAction } from "@/utils/hooks/useServerAction";

export const Options = () => {
  const [dataRecords, setDataRecords] = useState<any[]>([]);
  const { person } = usePerson();
  const { can } = usePermissions();
  const run = useServerAction();

  const handlePress = async () => {
    const { error, message, data } = await run(getPersonRecords(String(person.id)));

    if (error) {
      addToast({
        title: "Ocurrió un error",
        description: message,
        color: "danger",
        timeout: 3500,
        shouldShowTimeoutProgress: true,
      });
      return;
    }
    setDataRecords(data);
  };

  if (!can("persons.records", "read")) return null;

  return (
    <div className="flex justify-end items-center gap-1">
      <div className="flex gap-1">
        <DrawerRecords data={dataRecords} getData={handlePress} />
      </div>
    </div>
  );
};
