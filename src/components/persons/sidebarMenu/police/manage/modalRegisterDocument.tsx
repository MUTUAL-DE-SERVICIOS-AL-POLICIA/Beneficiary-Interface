import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useState } from "react";

import { createAffiliateDocument, updateAffiliateDocument } from "@/api/affiliate";
import { usePerson } from "@/utils/context/PersonContext";
import { AffiliateDocument, Document as DocumentInterface } from "@/utils/interfaces";

interface Props {
  onRefreshDocuments: () => Promise<void>;
  isOpen?: boolean;
  onClose: () => void;
  isUpdate?: boolean;
  affiliateDocument?: AffiliateDocument;
  dataRegister?: any;
}

export function ModalRegisterDocument({
  onRefreshDocuments,
  isOpen,
  onClose,
  isUpdate = false,
  affiliateDocument = undefined,
  dataRegister = {
    allData: [],
    disableData: [],
  },
}: Props) {
  const [loadingSave, setLoadingSave] = useState(false);
  const { affiliateId } = usePerson();
  const [documentId, setDocumentId] = useState<any>(null);

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
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      const formData = new FormData();

      let dataResponse: any = {};
      let message = "";
      let error = false;

      if (isUpdate && affiliateDocument) {
        formData.append(`file[${affiliateDocument.procedureDocumentId}]`, file);
        dataResponse = await updateAffiliateDocument(
          affiliateId,
          affiliateDocument.procedureDocumentId,
          formData,
        );
      } else {
        formData.append(`file[${documentId}]`, file);
        dataResponse = await createAffiliateDocument(affiliateId, documentId, formData);
      }

      message = dataResponse.message;
      error = dataResponse.error;

      if (error) {
        addToast({
          title: "Ocurrió un problema",
          description: message,
          color: "warning",
          timeout: 3500,
          shouldShowTimeoutProgress: true,
        });

        return;
      }

      addToast({
        title: "Aceptado",
        description: message,
        color: "success",
        timeout: 3500,
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
                {isUpdate && affiliateDocument ? (
                  <>
                    <ModalHeader className="flex flex-col">ACTUALIZAR DOCUMENTO</ModalHeader>
                  </>
                ) : (
                  <ModalHeader className="flex flex-col">SELECCIONE DOCUMENTO</ModalHeader>
                )}

                <ModalBody>
                  {!isUpdate ? (
                    <Autocomplete
                      isRequired
                      className="w-full"
                      defaultItems={dataRegister.allData}
                      disabledKeys={dataRegister.disableData}
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
                  ) : (
                    <p>
                      {affiliateDocument && (
                        <>
                          <b>Nombre:</b> {affiliateDocument.name}
                          <br />
                          <b>Código:</b> {affiliateDocument.shortened}
                        </>
                      )}
                    </p>
                  )}
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
