"use client";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";

import { Hands } from "./information";
import { ModalRegisterFingerprints } from "./manage";

import { getAllFingerprintsIds, getRegisteredFingerprints } from "@/api/person";
import { HeaderManage, SpinnerLoading } from "@/components/common";
import { usePerson } from "@/utils/context/PersonContext";
import { Fingerprint } from "@/utils/interfaces";

export const Fingerprints = () => {
  const [selectedFinger, setSelectedFinger] = useState<string | undefined>(undefined);
  const [registeredFingerprints, setRegisteredFingerprints] = useState<Fingerprint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAllFingerprints, setAllFingerprints] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataRegister, setDataRegister] = useState<any[]>([]);

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
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });
      }
      setRegisteredFingerprints(fingerprintsRegistered);

      return;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOPenModal = async () => {
    try {
      setAllFingerprints(true);
      const { error, message, data } = await getAllFingerprintsIds();

      if (error) {
        addToast({
          title: "Ocurrió un error",
          description: message,
          color: "danger",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });
        setDataRegister([]);

        return;
      }

      setDataRegister(data);
      onOpen();
    } catch (error) {
      console.error("Error al obtener tipos de huellas:", error);
    } finally {
      setAllFingerprints(false);
    }
  };

  return (
    <>
      <div className="relative h-full w-full">
        <SpinnerLoading isLoading={loading} />

        <HeaderManage
          toRegister
          isEdit={isEdit}
          isLoading={loadingAllFingerprints}
          switchEdit={switchEdit}
          onPressRegister={handleOPenModal}
        />

        <div className="flex justify-center items-center p-2">
          <Hands fingerprints={[...registeredFingerprints]} selectedOption={selectedFinger} />
        </div>
      </div>
      <ModalRegisterFingerprints
        dataRegister={dataRegister}
        isOpen={isOpen}
        onClose={onClose}
        onRefreshFingerprints={getFingerprints}
        onSelectFinger={setSelectedFinger}
      />
    </>
  );
};
