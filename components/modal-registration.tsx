import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { useState } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: () => void;
  data: Array<any>;
  action: (file: any, selectedKey: any) => void;
}

export default function ModalRegistrationComponent(props: ModalProps) {
  const { open, onOpenChange, data, action } = props;
  const [file, setFile] = useState<any>(undefined);
  const [selectedKey, setSelectedKey] = useState(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObtained = event.target.files?.[0];
    if (fileObtained) {
      setFile(fileObtained);
    }
  };

  const onSelectionChange = (value: any) => {
    setSelectedKey(value);
  };

  return (
    <>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={open}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Registrar nuevo documento</ModalHeader>
              <ModalBody>
                <Autocomplete
                  isRequired
                  defaultItems={data}
                  label="Documentos"
                  placeholder="Busque un documento"
                  onSelectionChange={onSelectionChange}
                >
                  {(data: any) => <AutocompleteItem key={data.id}>{data.name}</AutocompleteItem>}
                </Autocomplete>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'block', marginBottom: '20px' }}
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cerrar</Button>
                <Button onPress={() => action(file, selectedKey)}>Subir</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
