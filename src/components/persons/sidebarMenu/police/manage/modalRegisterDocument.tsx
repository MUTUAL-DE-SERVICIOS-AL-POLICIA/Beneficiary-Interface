import type { Key } from "@heroui/react";

import {
  Autocomplete,
  Button,
  Form,
  Input,
  Label,
  ListBox,
  Modal,
  SearchField,
  toast,
  useFilter,
} from "@heroui/react";
import { useState } from "react";

import { createAffiliateDocument, updateAffiliateDocument } from "@/api/affiliate";
import { usePerson } from "@/context/PersonContext";
import { AffiliateDocument, Document as DocumentInterface } from "@/utils/interfaces";

interface Props {
  onRefreshDocuments: () => Promise<void>;
  isOpen?: boolean;
  onClose: () => void;
  isUpdate?: boolean;
  affiliateDocument?: AffiliateDocument;
  dataRegister?: {
    allData: DocumentInterface[];
    disableData: Key[];
  } | null;
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
  const [documentId, setDocumentId] = useState<number | null>(null);
  const { contains } = useFilter({ sensitivity: "base" });
  const registerData = dataRegister ?? { allData: [], disableData: [] };

  const handleDocumentChange = (key: Key | Key[] | null) => {
    const selectedKey = Array.isArray(key) ? key[0] : key;

    setDocumentId(selectedKey == null ? null : Number(selectedKey));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoadingSave(true);
    e.preventDefault();
    try {
      const data = new FormData(e.currentTarget);
      const file = data.get("documentPdf");

      if (!(file instanceof File)) {
        toast.danger("Selecciona un archivo para continuar");

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
        if (documentId === null) {
          toast.danger("Selecciona un documento para continuar");

          return;
        }

        formData.append(`file[${documentId}]`, file);
        dataResponse = await createAffiliateDocument(affiliateId, documentId, formData);
      }

      message = dataResponse.message;
      error = dataResponse.error;

      if (error) {
        toast.danger(message);

        return;
      }

      toast.success(message);
      await onRefreshDocuments();
      setDocumentId(null);
      onClose();
    } catch {
      toast.danger("Error al subir el documento");
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop
        isKeyboardDismissDisabled
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <Modal.Container size="lg">
          <Modal.Dialog className="w-full max-w-5xl">
            <Form onSubmit={onSubmit}>
              <Modal.Header>
                <Modal.Heading>
                  {isUpdate && affiliateDocument ? "ACTUALIZAR DOCUMENTO" : "SELECCIONE DOCUMENTO"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                {!isUpdate ? (
                  <Autocomplete
                    fullWidth
                    isRequired
                    className="w-full"
                    disabledKeys={registerData.disableData}
                    name="documentId"
                    placeholder="Buscar documento"
                    selectionMode="single"
                    value={documentId}
                    variant="secondary"
                    onChange={handleDocumentChange}
                  >
                    <Label>Buscar documento</Label>
                    <Autocomplete.Trigger>
                      <Autocomplete.Value />
                      <Autocomplete.ClearButton />
                      <Autocomplete.Indicator />
                    </Autocomplete.Trigger>
                    <Autocomplete.Popover>
                      <Autocomplete.Filter filter={contains}>
                        <SearchField aria-label="Filtrar documentos" name="document-search">
                          <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input placeholder="Buscar..." />
                            <SearchField.ClearButton />
                          </SearchField.Group>
                        </SearchField>
                        <ListBox aria-label="Documentos disponibles">
                          {registerData.allData.map((document) =>
                            document.id === null ? null : (
                              <ListBox.Item
                                key={document.id}
                                id={document.id}
                                textValue={`(${document.shortened}): ${document.name}`}
                              >
                                <div className="truncate text-sm">
                                  <span className="font-semibold">({document.shortened}): </span>
                                  <span>{document.name}</span>
                                </div>
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ),
                          )}
                        </ListBox>
                      </Autocomplete.Filter>
                    </Autocomplete.Popover>
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="documentPdf">Archivo PDF</Label>
                  <Input required accept="application/pdf" id="documentPdf" name="documentPdf" type="file" />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button slot="close" variant="secondary">
                  Cerrar
                </Button>
                <Button isPending={loadingSave} type="submit">
                  Subir
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
