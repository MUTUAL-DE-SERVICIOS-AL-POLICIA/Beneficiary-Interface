import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { useState } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: () => void;
  uploadFile: (file: any) => void;
}

export default function ModalComponent(props: ModalProps) {
  const { open, onOpenChange, uploadFile } = props;
  const [file, setFile] = useState<any>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObtained = event.target.files?.[0];
    if (fileObtained) {
      // uploadFile(file);
      setFile(fileObtained);
    }
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
              <ModalHeader className="flex flex-col gap-1">Subir archivo</ModalHeader>
              <ModalBody>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'block', marginBottom: '20px' }}
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cerrar</Button>
                <Button onPress={() => uploadFile(file)}>Subir</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
