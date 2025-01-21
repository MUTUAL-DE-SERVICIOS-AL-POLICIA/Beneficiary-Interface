import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { useState } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: () => void;
  data?: Array<any>;
  action: (file: any, selectedKey: any) => void;
  loading: boolean;
  isUpdated: boolean;
}

export function ModalDocument(props: ModalProps) {
  const { open, onOpenChange, data, action, loading, isUpdated } = props;
  const [file, setFile] = useState<any>(undefined);
  const [fileError, setFileError] = useState(false);

  const [selectedKey, setSelectedKey] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObtained = event.target.files?.[0];

    if (fileObtained) {
      setFile(fileObtained);
      setFileError(false);
    }
  };

  const onSelectionChange = (value: any) => {
    setSelectedKey(value);
    if (value) {
      setShowError(false);
    }
  };
  const handleBlur = () => {
    if (!selectedKey) {
      setShowError(true); // Muestra el error si no hay una selección
    }
  };

  const handleUpload = () => {
    let hasError = false;

    if (!isUpdated && !selectedKey) {
      setShowError(true);
      hasError = true;
    }
    if (!file) {
      setFileError(true);
      hasError = true;
    }
    if (hasError) return;
    action(file, selectedKey);
  };

  return (
    <>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={open}
        onOpenChange={onOpenChange}
        size="5xl" // primer diferencia
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">
                {isUpdated ? "ACTUALIZAR" : "REGISTRAR NUEVO"} DOCUMENTO
              </ModalHeader>
              <ModalBody>
                {!isUpdated && (
                  <Autocomplete
                    isRequired
                    defaultItems={data}
                    errorMessage={showError ? "Por favor seleccione un documento" : ""}
                    isInvalid={showError}
                    label="Documentos"
                    placeholder="Busque un documento"
                    onBlur={handleBlur}
                    onSelectionChange={onSelectionChange}
                  >
                    {(data: any) => <AutocompleteItem key={data.id}>{data.name}</AutocompleteItem>}
                  </Autocomplete>
                )}
                <div>
                  <input
                    className={fileError ? "border-red-500" : ""}
                    style={{
                      display: "block",
                      border: fileError ? "1px solid red" : "",
                    }}
                    type="file"
                    onChange={handleFileChange}
                  />
                  {fileError && (
                    <span className="text-xs mt-0 pt-0" style={{ color: "#f21260" }}>
                      Por favor seleccione un archivo{" "}
                    </span>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cerrar</Button>
                <Button isLoading={loading} onPress={handleUpload}>
                  Subir
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
