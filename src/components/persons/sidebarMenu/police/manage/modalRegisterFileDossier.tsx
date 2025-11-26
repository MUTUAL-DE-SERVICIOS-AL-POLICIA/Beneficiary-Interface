import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Progress } from "@heroui/progress";
import { Select, SelectItem } from "@heroui/select";
import { Selection } from "@heroui/table";
import { addToast } from "@heroui/toast";
import { useState } from "react";

import { createFileDossier, updateFileDossier } from "@/api/affiliate";
import { postUploadChunk } from "@/api/common";
import { usePerson } from "@/utils/context/PersonContext";
import { AffiliateFileDossier, FileDossier as FileDossierInterface } from "@/utils/interfaces";

interface ModalProps {
  onRefreshFileDossiers: () => Promise<void>;
  isOpen?: boolean;
  onClose: () => void;
  isUpdate?: boolean;
  affiliateFileDossier?: AffiliateFileDossier;
  dataRegister?: any;
}

export function ModalRegisterFileDossier({
  onRefreshFileDossiers,
  isOpen,
  onClose,
  isUpdate = false,
  affiliateFileDossier = undefined,
  dataRegister = {
    allData: [],
    disableData: [],
  },
}: ModalProps) {
  const [loadingSave, setLoadingSave] = useState(false);
  const { affiliateId } = usePerson();
  const [fileDossierId, setFileDossierId] = useState<Selection>(new Set([]));
  const [progress, setProgress] = useState(0);

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
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      const CHUNK_SIZE = 5 * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const fileId =
        isUpdate && affiliateFileDossier
          ? affiliateFileDossier.fileDossierId.toString()
          : String(Array.from(fileDossierId)[0]);
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
            timeout: 3500,
            shouldShowTimeoutProgress: true,
          });

          return;
        }

        const progress = ((i + 1) / totalChunks) * 100;

        setProgress(progress);
      }

      let dataResponse: any = {};

      if (isUpdate && affiliateFileDossier) {
        dataResponse = await updateFileDossier(affiliateId, fileId, initialName, totalChunks);
      } else {
        dataResponse = await createFileDossier(affiliateId, fileId, initialName, totalChunks);
      }

      if (dataResponse.error) {
        addToast({
          title: "Ocurrió un problema",
          description: dataResponse.message,
          color: "warning",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      addToast({
        title: "Aceptado",
        description: dataResponse.message,
        color: "success",
        timeout: 3500,
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
      <Modal
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        size="3xl"
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
                    {isUpdate && affiliateFileDossier ? (
                      <>
                        <ModalHeader className="flex flex-col">ACTUALIZAR EXPEDIENTE</ModalHeader>
                      </>
                    ) : (
                      <ModalHeader className="flex flex-col">SELECCIONE EXPEDIENTE</ModalHeader>
                    )}
                    <ModalBody>
                      {!isUpdate ? (
                        <Select
                          isRequired
                          disabledKeys={dataRegister.disableData}
                          items={dataRegister.allData}
                          label="Expedientes"
                          placeholder="Seleccione un expediente"
                          onSelectionChange={setFileDossierId}
                        >
                          {(fileDossier: FileDossierInterface) => (
                            <SelectItem key={fileDossier.id}>{fileDossier.name}</SelectItem>
                          )}
                        </Select>
                      ) : (
                        <p>
                          {affiliateFileDossier && (
                            <>
                              <b>Nombre:</b> {affiliateFileDossier.name}
                              <br />
                              <b>Código:</b> {affiliateFileDossier.shortened}
                            </>
                          )}
                        </p>
                      )}
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
