"use client";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  captureOneFingerprint,
  captureTwoFingerprints,
  getAllFingerprintsIds,
  getRegisteredFingerprints,
  registerFingerprints,
} from "@/api/biometric/biometric";
import { Hands } from "@/components/persons";
import { useAlert } from "@/utils/hooks/useAlerts";

interface Fingerprint {
  fingerprintTypeId: number;
  wsq: string;
  quality: number;
}

const fingerprintRegistrationOptions = [
  { key: "Pulgares", name: "Registrar los pulgares" },
  { key: "Indices", name: "Registrar los indices" },
];

export default function FingerPrintPage() {
  const [isSelected, setIsSelected] = useState<boolean>(true);
  const [selectedTwoFinger, setSelectedTwoFinger] = useState<string | undefined>(undefined);
  const [selectedOneFinger, setSelectedOneFinger] = useState<string | undefined>(undefined);
  const [registeredFingerprints, setRegisteredFingerprints] = useState([]);
  const [fingerprintIds, setFingerprintIds] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { id } = useParams();
  const { Alert } = useAlert();
  const personId = parseInt(Array.isArray(id) ? id[0] : (id ?? ""), 10);

  const getFingerprints = async () => {
    const { error, message, fingerprintsRegistered } = await getRegisteredFingerprints(personId);

    if (!error) {
      setRegisteredFingerprints(fingerprintsRegistered);
    } else {
      Alert({ message, variant: "error" });
    }
  };

  const getFingerprintIds = async () => {
    const { error, message, fingerprints } = await getAllFingerprintsIds();

    if (!error) {
      setFingerprintIds(fingerprints);
    } else {
      Alert({ message, variant: "error" });
    }
  };

  const captureTwoFingerPrints = async () => {
    const { error, message, data } = await captureTwoFingerprints();

    if (!error) {
      Alert({ message, variant: "success" });

      return data;
    } else {
      Alert({ message, variant: "error" });

      return null;
    }
  };

  const captureOneFingerPrint = async () => {
    try {
      const { error, message, data } = await captureOneFingerprint();

      if (!error) {
        Alert({ message, variant: "success" });

        return data;
      } else {
        Alert({ message, variant: "error" });

        return null;
      }
    } catch (e: any) {
      console.error(e);
      Alert({ message: "Error en la aplicación", variant: "default" });
    }
  };

  const registerFingerPrints = async (fingerprints: any) => {
    const { error, message } = await registerFingerprints(personId, fingerprints);

    if (!error) {
      Alert({ message, variant: "success" });
    } else {
      Alert({ message, variant: "error" });
    }
  };

  const createFingerprint = (
    fingerTypeName: string,
    wsq: string,
    quality: number,
  ): Fingerprint | undefined => {
    const finger: any = fingerprintIds.find((finger: any) => finger.name.includes(fingerTypeName));

    return finger ? { fingerprintTypeId: finger.id, wsq, quality } : undefined;
  };

  const handleTwoFingersSelected = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setSelectedTwoFinger(e.target.value);
      setIsLoading(true);
      const data = await captureTwoFingerPrints();

      if (data) {
        const { izquierda, derecha } = data;
        const isThumb = e.target.value === "Pulgares";
        const leftFingerName = isThumb ? "Pulgar Izquierdo" : "Índice Izquierdo";
        const rightFingerName = isThumb ? "Pulgar Derecho" : "Índice Derecho";

        if (izquierda && derecha) {
          const fingerprints: Fingerprint[] = [
            createFingerprint(leftFingerName, izquierda.wsq, izquierda.quality),
            createFingerprint(rightFingerName, derecha.wsq, derecha.quality),
          ].filter(Boolean) as Fingerprint[];

          await registerFingerPrints(fingerprints);
          await getFingerprints();
        }
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setSelectedTwoFinger(undefined);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleOneFingerSelect = async (e: any) => {
    try {
      const fingerprintTypeId = parseInt(e.target.value, 10);

      setSelectedOneFinger(e.target.value);
      setIsLoading(true);
      const data = await captureOneFingerPrint();

      if (data) {
        const { wsq, quality } = data;
        const body = [{ fingerprintTypeId, wsq, quality }];

        await registerFingerPrints(body);
        await getFingerprints();
        setSelectedOneFinger(undefined);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setSelectedOneFinger(undefined);
        setIsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    getFingerprints();
    getFingerprintIds();
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-center space-x-4 py-4">
        <Switch color="default" isSelected={isSelected} onValueChange={setIsSelected}>
          Mostrar detalles
        </Switch>
        <Select
          key={selectedTwoFinger || "default"}
          className="max-w-[15rem]"
          label="Registrar dos huellas"
          placeholder="Seleccione una opción"
          size="sm"
          value={selectedTwoFinger}
          onChange={handleTwoFingersSelected}
        >
          {fingerprintRegistrationOptions.map(({ key, name }) => (
            <SelectItem key={key}>{name}</SelectItem>
          ))}
        </Select>
        <Select
          key={selectedOneFinger || "defult"}
          className="max-w-[12rem]"
          label="Registrar una huella"
          placeholder="Seleccione un dedo"
          size="sm"
          value={selectedOneFinger}
          onChange={handleOneFingerSelect}
        >
          {fingerprintIds.map(({ id, name }) => (
            <SelectItem key={id}>{name}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="flex justify-center w-full max-w-[500px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10">
              <div className="text-3xl font-semibold text-default-900">Registrando huellas...</div>
            </div>
          )}
          <Hands
            fingerprints={[...registeredFingerprints]}
            selectedOption={selectedTwoFinger || selectedOneFinger}
            withDetails={isSelected}
          />
        </div>
      </div>
    </div>
  );
}
