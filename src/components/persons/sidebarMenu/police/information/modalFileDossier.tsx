import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Form } from "@heroui/form";
import { Selection } from "@heroui/table";

import { FileDossier as FileDossierInterface } from "@/utils/interfaces";
import { usePerson } from "@/utils/context/PersonContext";
import { getAllFileDossiers, postCreateUpdateFileDossier } from "@/api/affiliate";
import { DocumentRegisterIcon } from "@/components/common";

interface ModalProps {
  onRefreshFileDossiers: () => Promise<void>;
}

export function ModalFileDossier({ onRefreshFileDossiers }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileDossiers, setFileDossiers] = useState<any>([]);
  const { affiliateId } = usePerson();
  const [fileDossierId, setFileDossierId] = useState<Selection>(new Set([]));

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

      const { error, message } = await postCreateUpdateFileDossier(
        affiliateId,
        String(Array.from(fileDossierId)[0]),
        file,
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
      console.error("Error al obtener los tipos de expedientes:", error);
    } finally {
      setLoadingSave(false);
      setFileDossierId(new Set([]));
      onClose();
    }
  };

  return (
    <>
      <Tooltip content="Nuevo expediente">
        <Button endContent={<DocumentRegisterIcon />} isLoading={loading} onPress={getFileDossiers}>
          REGISTRAR
        </Button>
      </Tooltip>

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
                <ModalHeader className="flex flex-col">REGISTRAR NUEVO EXPEDIENTE</ModalHeader>
                <ModalBody>
                  <Select
                    isRequired
                    items={fileDossiers}
                    label="Expedientes"
                    placeholder="Seleccione un expediente"
                    selectedKeys={fileDossierId}
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
                  <Button isLoading={loadingSave} type="submit">
                    Subir
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </Modal>
    </>
  );
}
