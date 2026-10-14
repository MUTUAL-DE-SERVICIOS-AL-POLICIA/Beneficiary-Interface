"use client";

import { Button, Modal } from "@heroui/react";

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
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
}: Props) {
  return (
    <Modal.Backdrop isDismissable={false} isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p>{message}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="danger-soft">
              {cancelText}
            </Button>
            <Button
              isPending={loading}
              slot="close"
              variant="secondary"
              onPress={() => {
                onConfirm();
              }}
            >
              {confirmText}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
