import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { useState } from "react";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Form } from "@heroui/form";
import { Selection } from "@heroui/table";
import { Progress } from "@heroui/progress";

import { FileDossier as FileDossierInterface } from "@/utils/interfaces";
import { usePerson } from "@/utils/context/PersonContext";
import { getAllFileDossiers, postCreateUpdateFileDossier } from "@/api/affiliate";
import { postUploadChunk } from "@/api/common";
import { ButtonRegister } from "@/components/common";

interface ModalProps {
  onRefreshFileDossiers: () => Promise<void>;
  isDisabled?: boolean;
}

export function ModalRegisterFileDossier({ onRefreshFileDossiers, isDisabled }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileDossiers, setFileDossiers] = useState<any>([]);
  const { affiliateId } = usePerson();
  const [fileDossierId, setFileDossierId] = useState<Selection>(new Set([]));
  const [progress, setProgress] = useState(0);
  const getFileDossiers = async () => {
    setLoading(true);
    try {
      const { error, message, data } = await getAllFileDossiers();

      if (error) {
        addToast({
          title: "Ocurrió un error",
          description: message,
          color: "danger",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
        setFileDossiers([]);

        return;
      }

      setFileDossiers(data);

      return;
    } catch (error) {
      console.error("Error al obtener los tipos de expedientes:", error);
    } finally {
      setLoading(false);
      onOpen();
    }
  };
  const onSubmit = async (e: any) => {
    setLoadingSave(true);
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("fileDossierPdf");

      if (!(file instanceof File)) {
        addToast({
          title: "Ocurrió un error",
          description: "Archivo inválido",
          color: "danger",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      const CHUNK_SIZE = 5 * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const fileId = String(Array.from(fileDossierId)[0]);
      const initialName = `fileDossier-${affiliateId}-${fileId}`;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunk = file.slice(start, end);

        const body = new FormData();

        body.append("chunk", chunk);
        body.append("nameChunk", initialName + "-" + i);

        const response = await postUploadChunk(body);

        if (response.error) {
          addToast({
            title: "Ocurrió un error al subir chunk: " + (i + 1) + " del expediente",
            description: response.message,
            color: "danger",
            timeout: 2000,
            shouldShowTimeoutProgress: true,
          });

          return;
        }

        const progress = ((i + 1) / totalChunks) * 100;

        setProgress(progress);
      }

      const { error, message } = await postCreateUpdateFileDossier(
        affiliateId,
        fileId,
        initialName,
        totalChunks,
      );

      if (error) {
        addToast({
          title: "Ocurrió un problema",
          description: message,
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      addToast({
        title: "Aceptado",
        description: message,
        color: "success",
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
      onRefreshFileDossiers();

      return;
    } catch (error) {
      console.error("Error subir expediente:", error);
    } finally {
      setLoadingSave(false);
      setFileDossierId(new Set([]));
      setProgress(0);
      onClose();
    }
  };

  return (
    <>
      <ButtonRegister
        isDisabled={isDisabled}
        isLoading={loading}
        textTop="crear/actualizar"
        onPress={getFileDossiers}
      />
      <Modal
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        size="md"
        onClose={onClose}
      >
        <Form onSubmit={onSubmit}>
          <ModalContent>
            {(onClose) => (
              <>
                {loadingSave ? (
                  <>
                    <ModalHeader className="flex flex-col">REGISTRANDO EXPEDIENTE</ModalHeader>
                    <ModalBody>
                      <Progress
                        aria-label="Downloading..."
                        className="max-w-md"
                        color="success"
                        showValueLabel={true}
                        size="md"
                        value={progress}
                      />
                    </ModalBody>
                  </>
                ) : (
                  <>
                    <ModalHeader className="flex flex-col">SELECCIONE EXPEDIENTE</ModalHeader>
                    <ModalBody>
                      <Select
                        isRequired
                        items={fileDossiers}
                        label="Expedientes"
                        placeholder="Seleccione un expediente"
                        onSelectionChange={setFileDossierId}
                      >
                        {(fileDossier: FileDossierInterface) => (
                          <SelectItem key={fileDossier.id}>{fileDossier.name}</SelectItem>
                        )}
                      </Select>
                      <Input isRequired name="fileDossierPdf" type="file" />
                    </ModalBody>
                    <ModalFooter>
                      <Button onPress={onClose}>Cerrar</Button>
                      <Button type="submit">Subir</Button>
                    </ModalFooter>
                  </>
                )}
              </>
            )}
          </ModalContent>
        </Form>
      </Modal>
    </>
  );
}
