"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";

import { getAllFingerprintsIds } from "@/api/person";
import { FingerprintCore, Fingerprint } from "@/utils/interfaces";
import { TouchPulgarIcon, TouchIndiceIcon, TouchRegisterIcon } from "@/components/common";
import { captureOneFingerprint, captureTwoFingerprints } from "@/api/biometric";
import { postFingerprints } from "@/api/person";
import { usePerson } from "@/utils/context/PersonContext";

interface Props {
  onSelectFinger: (fingerName: string | undefined) => void;
  onRefreshFingerprints: () => Promise<void>;
}

export const ModalFingerprints = ({ onSelectFinger, onRefreshFingerprints }: Props) => {
  const { person } = usePerson();
  const personId = person.id;

  const twoFingerprints: FingerprintCore[] = [
    { id: "Pulgares", name: "Pulgar izquierdo y Pulgar derecho" },
    { id: "Indices", name: "Índice izquierdo e Indice derecho" },
  ];

  const [loading, setLoading] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fingerprints, setFingerprints] = useState<FingerprintCore[]>([]);

  const getFingerprints = async () => {
    setLoading(true);
    try {
      const { error, message, data } = await getAllFingerprintsIds();

      if (error) {
        addToast({
          title: "Ocurrió un error",
          description: message,
          color: "danger",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
        setFingerprints([]);

        return;
      }

      setFingerprints(data);

      return;
    } catch (error) {
      console.error("Error al obtener tipos de huellas:", error);
    } finally {
      setLoading(false);
      onOpen();
    }
  };

  const createFingerprint = (
    fingerTypeName: string,
    wsq: string,
    quality: number,
  ): Fingerprint | undefined => {
    const finger: any = fingerprints.find((finger: any) => finger.name.includes(fingerTypeName));

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
          timeout: 2000,
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

      const fingerprints: Fingerprint[] = [
        createFingerprint(leftFingerName, izquierda.wsq, izquierda.quality),
        createFingerprint(rightFingerName, derecha.wsq, derecha.quality),
      ].filter(Boolean) as Fingerprint[];

      const personFingerprints: any = [];
      const wsqFingerprints: any = [];

      fingerprints.forEach((fingerprint) => {
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
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      addToast({
        title: "Aceptado",
        description: response.message,
        color: "success",
        timeout: 2000,
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
          timeout: 2000,
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
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      addToast({
        title: "Aceptado",
        description: response.message,
        color: "success",
        timeout: 2000,
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
      {loadingSaved && (
        <>
          <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="text-2xl font-semibold text-default-900 bg-white dark:bg-black rounded-sm min-w-[1000px] text-center">
              Guardando ...
            </span>
          </div>
          <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="text-2xl font-semibold text-default-900 bg-white dark:bg-black rounded-sm min-w-[1000px] text-center">
              Huella(s) capturada(s)
            </span>
          </div>
        </>
      )}
      {loadingRegister && (
        <>
          <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="text-2xl font-semibold text-default-900 bg-white dark:bg-black rounded-sm min-w-[1000px] text-center">
              Registrando ...
            </span>
          </div>
          <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <Spinner
              classNames={{
                label:
                  "text-2xl font-semibold text-default-900 bg-white dark:bg-black rounded-sm min-w-[1000px] text-center",
              }}
              color="success"
              label="Coloque el/los dedos seleccionado(s) en el sensor biométrico"
              size="lg"
              variant="spinner"
            />
          </div>
        </>
      )}

      <Tooltip content="Nueva huella">
        <Button disabled={loadingSaved || loadingRegister} isLoading={loading} onPress={getFingerprints}>
          REGISTRAR
          <TouchRegisterIcon />
        </Button>
      </Tooltip>

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
                    {fingerprints.map((fingerprint) => {
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
