"use client";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";

import { Hands } from "./information";
import { ModalFingerprints } from "./information/modalFingerprints";

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
    <>
      {loading && (
        <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <Spinner color="success" size="lg" variant="spinner" />
        </div>
      )}
      <div className="m-3 space-y-3 ">
        <div className="flex justify-end items-center">
          <ModalFingerprints onRefreshFingerprints={getFingerprints} onSelectFinger={setSelectedFinger} />
        </div>
        <Divider className="bg-gray-400 w-full" />
        <div className="flex justify-center" />
        <div className="flex justify-center items-center">
          <Hands fingerprints={[...registeredFingerprints]} selectedOption={selectedFinger} />
        </div>
      </div>
    </>
  );
};
