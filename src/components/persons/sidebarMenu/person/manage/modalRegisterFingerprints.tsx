"use client";
import { Button, Modal, toast } from "@heroui/react";
import { useState } from "react";

import { captureOneFingerprint, captureTwoFingerprints } from "@/api/biometric";
import { postFingerprints } from "@/api/person";
import { SpinnerLoading, TouchIndiceIcon, TouchPulgarIcon } from "@/components";
import { usePerson } from "@/context/PersonContext";
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
        toast.danger(message);
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
        toast.danger(response.message);

        return;
      }

      toast.success(response.message);

      await onRefreshFingerprints();

      return;
    } catch {
      toast.danger("Error al capturar las huellas dactilares");
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
        toast.danger(message);
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
        toast.danger(response.message);

        return;
      }

      toast.success(response.message);
      await onRefreshFingerprints();

      return;
    } catch {
      toast.danger("Error al capturar la huella dactilar");
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

      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Seleccione una opción:</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="w-full rounded-small border border-default-200 px-1 py-2 dark:border-default-100">
                <p className="mb-2">Registro de 2 huellas</p>
                <div className="my-2 h-px w-full bg-default-200" />

                <div className="flex flex-col gap-2">
                  {twoFingerprints.map((fingerprint) => {
                    const isPulgar = fingerprint.name.includes("Pulgar");

                    return (
                      <Button
                        key={String(fingerprint.id)}
                        className="justify-between border border-default-200 px-4 py-3 text-left"
                        variant="secondary"
                        onPress={() => handleTwoFingersSelect(String(fingerprint.id))}
                      >
                        <span>{fingerprint.name}</span>
                        <span className="flex gap-2">
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
                        </span>
                      </Button>
                    );
                  })}
                </div>

                <p className="mt-4 mb-2">Registro de 1 huella</p>
                <div className="my-2 h-px w-full bg-default-200" />

                <div className="flex flex-col gap-2">
                  {dataRegister.map((fingerprint) => {
                    const isIndice = fingerprint.name.includes("Índice");

                    return (
                      <Button
                        key={String(fingerprint.id)}
                        className="justify-between border border-default-200 px-4 py-3 text-left"
                        variant="secondary"
                        onPress={() => handleOneFingerSelect(String(fingerprint.id))}
                      >
                        <span>{fingerprint.name}</span>
                        <span>{isIndice ? <TouchIndiceIcon /> : <TouchPulgarIcon />}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="ghost" onPress={onClose}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
