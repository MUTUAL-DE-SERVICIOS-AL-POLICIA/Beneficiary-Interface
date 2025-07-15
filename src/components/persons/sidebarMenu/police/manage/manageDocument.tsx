import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { ModalRegisterDocument } from ".";

import { DocumentEditIcon, CancelIcon } from "@/components/common";

interface Props {
  toRegister?: boolean;
  toEdit?: boolean;
  onRefreshDocuments: () => Promise<void>;
  onCancel: () => void;
  switchEdit: () => void;
  onEdit: boolean;
  existDocuments: boolean;
}

export function ManageDocument({
  toRegister,
  toEdit,
  onRefreshDocuments,
  onCancel,
  switchEdit,
  onEdit,
  existDocuments,
}: Props) {
  return (
    <>
      <div className="flex justify-end items-center gap-1">
        {onEdit ? (
          <>
            <Tooltip content="Cancelar acción">
              <Button className="bg-red-600 text-white" endContent={<CancelIcon />} onPress={onCancel}>
                CANCELAR
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            {toRegister && <ModalRegisterDocument onRefreshDocuments={onRefreshDocuments} />}
            {toEdit && (
              <Tooltip content="Activar modo edición">
                <Button endContent={<DocumentEditIcon />} isDisabled={!existDocuments} onPress={switchEdit}>
                  EDITAR
                </Button>
              </Tooltip>
            )}
          </>
        )}
      </div>
      <Divider className="bg-gray-400 mb-2 mt-2 w-full" />
    </>
  );
}
