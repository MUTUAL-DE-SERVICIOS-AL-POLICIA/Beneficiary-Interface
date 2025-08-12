"use client";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";

import { Hands } from "./information";
import { ModalRegisterFingerprints } from "./manage";

import { HeaderManage } from "@/components/common";
import { usePerson } from "@/utils/context/PersonContext";
import { getRegisteredFingerprints } from "@/api/person";
import { Fingerprint } from "@/utils/interfaces";
import { SpinnerLoading } from "@/components/common";

export const Fingerprints = () => {
  const [selectedFinger, setSelectedFinger] = useState<string | undefined>(undefined);
  const [registeredFingerprints, setRegisteredFingerprints] = useState<Fingerprint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);

  const { person } = usePerson();
  const personId = person.id;

  useEffect(() => {
    getFingerprints();
  }, []);

  const switchEdit = () => {
    setIsEdit(!isEdit);
  };

  const getFingerprints = async () => {
    setLoading(true);
    try {
      const { error, message, fingerprintsRegistered } = await getRegisteredFingerprints(personId);

      if (error) {
        addToast({
          title: "Ocurrió un error",
          description: message,
          color: "danger",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      }
      setRegisteredFingerprints(fingerprintsRegistered);

      return;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full">
      <SpinnerLoading isLoading={loading} />

      <HeaderManage
        toRegister
        componentRegister={
          <ModalRegisterFingerprints
            isDisabled={isEdit}
            onRefreshFingerprints={getFingerprints}
            onSelectFinger={setSelectedFinger}
          />
        }
        isEdit={isEdit}
        switchEdit={switchEdit}
      />

      <div className="flex justify-center items-center p-2">
        <Hands fingerprints={[...registeredFingerprints]} selectedOption={selectedFinger} />
      </div>
    </div>
  );
};
