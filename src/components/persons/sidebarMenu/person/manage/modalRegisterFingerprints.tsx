"use client";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useState } from "react";

import { captureOneFingerprint, captureTwoFingerprints } from "@/api/biometric";
import { postFingerprints } from "@/api/person";
import { TouchIndiceIcon, TouchPulgarIcon } from "@/components";
import { SpinnerLoading } from "@/components/common";
import { usePerson } from "@/utils/context/PersonContext";
import { Fingerprint, FingerprintCore } from "@/utils/interfaces";

interface Props {
  onSelectFinger: (fingerName: string | undefined) => void;
  onRefreshFingerprints: () => Promise<void>;
  isOpen?: boolean;
  onClose: () => void;
  dataRegister?: any[];
}

export const ModalRegisterFingerprints = ({
  onSelectFinger,
  onRefreshFingerprints,
  isOpen,
  onClose,
  dataRegister = [],
}: Props) => {
  const { person } = usePerson();
  const personId = person.id;

  const twoFingerprints: FingerprintCore[] = [
    { id: "Pulgares", name: "Pulgar izquierdo y Pulgar derecho" },
    { id: "Indices", name: "Índice izquierdo e Indice derecho" },
  ];

  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const createFingerprint = (
    fingerTypeName: string,
    wsq: string,
    quality: number,
  ): Fingerprint | undefined => {
    const finger: any = dataRegister?.find((finger: any) => finger.name.includes(fingerTypeName));

    return finger ? { fingerprintTypeId: finger.id, wsq, quality } : undefined;
  };

  const handleTwoFingersSelect = async (nameTypeFingerprints: string) => {
    try {
      onClose();
      setLoadingRegister(true);
      onSelectFinger(nameTypeFingerprints);

      const { error, message, data } = await captureTwoFingerprints();

      if (error) {
        addToast({
          title: "Ocurrió un error al capturar las dos huellas",
          description: message,
          color: "warning",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });
        setLoadingRegister(false);

        return;
      }

      setLoadingRegister(false);
      setLoadingSaved(true);

      const { izquierda, derecha } = data;
      const isThumb = nameTypeFingerprints === "Pulgares";
      const leftFingerName = isThumb ? "Pulgar Izquierdo" : "Índice Izquierdo";
      const rightFingerName = isThumb ? "Pulgar Derecho" : "Índice Derecho";

      const dataRegister: Fingerprint[] = [
        createFingerprint(leftFingerName, izquierda.wsq, izquierda.quality),
        createFingerprint(rightFingerName, derecha.wsq, derecha.quality),
      ].filter(Boolean) as Fingerprint[];

      const personFingerprints: any = [];
      const wsqFingerprints: any = [];

      dataRegister.forEach((fingerprint) => {
        personFingerprints.push({
          fingerprintTypeId: fingerprint.fingerprintTypeId,
          quality: fingerprint.quality,
        });

        wsqFingerprints.push({
          fieldname: `file[${fingerprint.fingerprintTypeId}]`,
          buffer: fingerprint.wsq,
        });
      });

      const response = await postFingerprints(personId, { personFingerprints, wsqFingerprints });

      if (response.error) {
        addToast({
          title: "Ocurrido un error al guardar las dos huellas",
          description: response.message,
          color: "danger",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      addToast({
        title: "Aceptado",
        description: response.message,
        color: "success",
        timeout: 3500,
        shouldShowTimeoutProgress: true,
      });

      await onRefreshFingerprints();

      return;
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingSaved(false);
      onSelectFinger(undefined);
    }
  };

  const handleOneFingerSelect = async (fingerprintId: string) => {
    try {
      onClose();
      setLoadingRegister(true);
      onSelectFinger(fingerprintId);

      const fingerprintTypeId = parseInt(fingerprintId, 10);

      const { error, message, data } = await captureOneFingerprint();

      if (error) {
        addToast({
          title: "Ocurrió un error en la captura",
          description: message,
          color: "warning",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });
        setLoadingRegister(false);

        return;
      }

      setLoadingRegister(false);
      setLoadingSaved(true);

      const personFingerprints: any[] = [
        {
          fingerprintTypeId,
          quality: data.quality,
        },
      ];

      const wsqFingerprints: any[] = [
        {
          fieldname: `file[${fingerprintTypeId}]`,
          buffer: data.wsq,
        },
      ];

      const response = await postFingerprints(personId, { personFingerprints, wsqFingerprints });

      if (response.error) {
        addToast({
          title: "Ocurrió un error al guardar la huella",
          description: response.message,
          color: "danger",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      addToast({
        title: "Aceptado",
        description: response.message,
        color: "success",
        timeout: 3500,
        shouldShowTimeoutProgress: true,
      });

      await onRefreshFingerprints();

      return;
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingSaved(false);
      onSelectFinger(undefined);
    }
  };

  return (
    <>
      <SpinnerLoading
        isTextSpinner
        isTextTop
        isLoading={loadingSaved}
        labelSpinner="Huella(s) capturada(s)"
        labelTop="Guardando ..."
        topSpinner="top-[65%]"
      />

      <SpinnerLoading
        isTextSpinner
        isTextTop
        isLoading={loadingRegister}
        labelSpinner="Coloque el/los dedos seleccionado(s) en el sensor biométrico"
        labelTop="Registrando ..."
        topSpinner="top-[82%]"
      />

      <Modal isDismissable={false} isOpen={isOpen} size="md" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Seleccione una opción:</ModalHeader>
              <ModalBody>
                <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                  Registro de 2 huellas
                  <Divider className="h-1" />
                  <Listbox
                    aria-label="Actions"
                    itemClasses={{
                      base: "px-3 rounded-t-medium gap-3 h-12",
                    }}
                    onAction={(key) => handleTwoFingersSelect(String(key))}
                  >
                    {twoFingerprints.map((fingerprint) => {
                      const isPulgar = fingerprint.name.includes("Pulgar");

                      return (
                        <ListboxItem
                          key={fingerprint.id}
                          color="success"
                          endContent={
                            <div style={{ display: "flex" }}>
                              {isPulgar ? (
                                <>
                                  <TouchPulgarIcon />
                                  <TouchPulgarIcon />
                                </>
                              ) : (
                                <>
                                  <TouchIndiceIcon />
                                  <TouchIndiceIcon />
                                </>
                              )}
                            </div>
                          }
                        >
                          {fingerprint.name}
                        </ListboxItem>
                      );
                    })}
                  </Listbox>
                  Registro de 1 huella
                  <Divider className="h-1" />
                  <Listbox
                    aria-label="Actions"
                    itemClasses={{
                      base: "px-3 rounded-t-medium gap-3 h-12",
                    }}
                    onAction={(key) => handleOneFingerSelect(String(key))}
                  >
                    {dataRegister.map((fingerprint) => {
                      const isIndice = fingerprint.name.includes("Índice");

                      return (
                        <ListboxItem
                          key={fingerprint.id}
                          color="success"
                          endContent={isIndice ? <TouchIndiceIcon /> : <TouchPulgarIcon />}
                        >
                          {fingerprint.name}
                        </ListboxItem>
                      );
                    })}
                  </Listbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
