import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { useState } from "react";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Form } from "@heroui/form";

import { Document as DocumentInterface } from "@/utils/interfaces";
import { usePerson } from "@/utils/context/PersonContext";
import { getDocuments, createUpdateDocument } from "@/api/affiliate";
import { DocumentRegisterIcon } from "@/components/common";

interface Props {
  onRefreshDocuments: () => Promise<void>;
}

export function ModalRegisterDocument({ onRefreshDocuments }: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [documents, setDocuments] = useState<any>([]);
  const { affiliateId } = usePerson();
  const [documentId, setDocumentId] = useState<any>(null);
  const getAllDocuments = async () => {
    setLoading(true);
    try {
      const { error, message, data } = await getDocuments();

      if (error) {
        addToast({
          title: "Ocurrió un error",
          description: message,
          color: "danger",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
        setDocuments([]);

        return;
      }

      setDocuments(data);

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
      const data = new FormData(e.currentTarget);
      const file = data.get("documentPdf");

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

      const formData = new FormData();

      formData.append(`file[${documentId}]`, file);

      const { error, message } = await createUpdateDocument(affiliateId, documentId, formData);

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
      onRefreshDocuments();

      return;
    } catch (error) {
      console.error("Error subir expediente:", error);
    } finally {
      setLoadingSave(false);
      setDocumentId(new Set([]));
      onClose();
    }
  };

  return (
    <>
      <Tooltip content="Crear/Actualizar">
        <Button endContent={<DocumentRegisterIcon />} isLoading={loading} onPress={getAllDocuments}>
          REGISTRAR
        </Button>
      </Tooltip>

      <Modal
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        size="5xl"
        onClose={onClose}
      >
        <Form onSubmit={onSubmit}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col">SELECCIONE DOCUMENTO</ModalHeader>
                <ModalBody>
                  <Autocomplete
                    isRequired
                    className="w-full"
                    defaultItems={documents}
                    label="Buscar documento"
                    labelPlacement="inside"
                    variant="bordered"
                    onSelectionChange={setDocumentId}
                  >
                    {(document: DocumentInterface) => (
                      <AutocompleteItem
                        key={document.id}
                        textValue={`(${document.shortened}): ${document.name}`}
                      >
                        <div className="text-small truncate">
                          <span className="font-semibold">({document.shortened}): </span>
                          <span>{document.name}</span>
                        </div>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <Input isRequired name="documentPdf" type="file" />
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
