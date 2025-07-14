"use client";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";

import { Hands } from "./information";
import { ModalFingerprints } from "./manage/modalRegisterFingerprints";

import { usePerson } from "@/utils/context/PersonContext";
import { getRegisteredFingerprints } from "@/api/person";
import { Fingerprint } from "@/utils/interfaces";

export const Fingerprints = () => {
  const [selectedFinger, setSelectedFinger] = useState<string | undefined>(undefined);
  const [registeredFingerprints, setRegisteredFingerprints] = useState<Fingerprint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { person } = usePerson();
  const personId = person.id;

  useEffect(() => {
    getFingerprints();
  }, []);

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
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Spinner color="success" size="lg" variant="spinner" />
        </div>
      )}
      <div className="flex justify-end items-center">
        <ModalFingerprints onRefreshFingerprints={getFingerprints} onSelectFinger={setSelectedFinger} />
      </div>
      <Divider className="bg-gray-400 w-full mt-2 mb-2" />
      <div className="flex justify-center items-center p-2">
        <Hands fingerprints={[...registeredFingerprints]} selectedOption={selectedFinger} />
      </div>
    </div>
  );
};
