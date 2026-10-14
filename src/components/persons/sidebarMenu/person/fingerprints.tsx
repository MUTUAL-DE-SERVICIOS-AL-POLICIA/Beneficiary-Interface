"use client";
import { toast } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import { Hands } from "./information";
import { ModalRegisterFingerprints } from "./manage";

import { getAllFingerprintsIds, getRegisteredFingerprints } from "@/api/person";
import { HeaderManage, SpinnerLoading } from "@/components";
import { usePerson } from "@/context/PersonContext";
import { Fingerprint } from "@/utils/interfaces";
import { usePermissions } from "@/context/PermissionContext";

export const Fingerprints = () => {
  const { can } = usePermissions();
  const [selectedFinger, setSelectedFinger] = useState<string | undefined>(undefined);
  const [registeredFingerprints, setRegisteredFingerprints] = useState<Fingerprint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAllFingerprints, setAllFingerprints] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dataRegister, setDataRegister] = useState<any[]>([]);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const { person } = usePerson();
  const personId = person?.id;

  const switchEdit = () => {
    setIsEdit(!isEdit);
  };

  // Función para refrescar manualmente cuando se registra o elimina una huella desde el modal
  const refreshFingerprints = useCallback(async () => {
    if (!personId) return;

    setLoading(true);
    try {
      const { error, message, fingerprintsRegistered } = await getRegisteredFingerprints(personId);

      if (error) {
        toast.danger(message);
      }
      setRegisteredFingerprints(fingerprintsRegistered ?? []);
    } catch {
      toast.danger("Ocurrió un error al obtener los registros de huellas dactilares");
    } finally {
      setLoading(false);
    }
  }, [personId]);

  const handleOPenModal = async () => {
    try {
      setAllFingerprints(true);
      const { error, message, data } = await getAllFingerprintsIds();

      if (error) {
        toast.danger(message);
        setDataRegister([]);

        return;
      }

      setDataRegister(data);
      onOpen();
    } catch {
      toast.danger("Ocurrió un error al obtener los datos de los registros de huellas dactilares");
    } finally {
      setAllFingerprints(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadFingerprints = async () => {
      if (!personId) return;

      setLoading(true);
      try {
        const { error, message, fingerprintsRegistered } = await getRegisteredFingerprints(personId);

        if (cancelled) return;

        if (error) {
          toast.danger(message);
        }
        setRegisteredFingerprints(fingerprintsRegistered ?? []);
      } catch {
        if (!cancelled) {
          toast.danger("Ocurrió un error al obtener los registros de huellas dactilares");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFingerprints();

    return () => {
      cancelled = true;
    };
  }, [personId]);

  return (
    <>
      <div className="relative h-full w-full">
        <SpinnerLoading isLoading={loading} />

        <HeaderManage
          toRegister={can("persons.fingerprints", "write")}
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
        onRefreshFingerprints={refreshFingerprints}
        onSelectFinger={setSelectedFinger}
      />
    </>
  );
};
