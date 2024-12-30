import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { useState } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: () => void;
  uploadFile: (file: any) => void;
  loading: boolean;
}

export default function ModalComponent(props: ModalProps) {
  const { open, onOpenChange, uploadFile, loading } = props;
  const [file, setFile] = useState<any>(undefined);
  const [fileError, setFileError] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObtained = event.target.files?.[0];
    if (fileObtained) {
      // uploadFile(file);
      setFile(fileObtained);
      setFileError(false);
    }
  };

  const handleUpload = () => {
    let hasError = false;
    if (!file) {
      setFileError(true);
      hasError = true;
    }
    if (hasError) return;
    uploadFile(file);
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
                <div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className={fileError ? 'border-red-500' : ''}
                    style={{
                      display: 'block',
                      border: fileError ? '1px solid red' : '',
                    }}
                  />
                  {fileError && (
                    <span className="text-xs mt-0 pt-0" style={{ color: '#f21260' }}>
                      Por favor seleccione un archivo{' '}
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
