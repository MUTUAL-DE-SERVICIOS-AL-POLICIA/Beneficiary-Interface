"use client";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";

interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function ModalAlert({
  isOpen,
  title = "Confirmar acción",
  message = "¿Estás seguro de realizar esta acción?",
  onConfirm,
  onClose,
  confirmText = "Sí, continuar",
  cancelText = "Cancelar",
  loading = false,
}: Props) {
  return (
    <Modal hideCloseButton isDismissable={false} isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <p>{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={close}>
                {cancelText}
              </Button>
              <Button
                color="danger"
                isLoading={loading}
                onPress={() => {
                  onConfirm();
                  close();
                }}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
