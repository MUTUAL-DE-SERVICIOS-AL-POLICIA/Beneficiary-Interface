import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { ModalRegisterFileDossier } from "./";

import { DocumentEditIcon, CancelIcon } from "@/components/common";

interface Props {
  toRegister?: boolean;
  toEdit?: boolean;
  onRefreshFileDossiers: () => Promise<void>;
  onCancel: () => void;
  switchEdit: () => void;
  onEdit: boolean;
  existFileDossiers: boolean;
}

export function ManageFileDossier({
  toRegister,
  toEdit,
  onRefreshFileDossiers,
  onCancel,
  switchEdit,
  onEdit,
  existFileDossiers,
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
            {toRegister && <ModalRegisterFileDossier onRefreshFileDossiers={onRefreshFileDossiers} />}
            {toEdit && (
              <Tooltip content="Activar modo edición">
                <Button
                  endContent={<DocumentEditIcon />}
                  isDisabled={!existFileDossiers}
                  onPress={switchEdit}
                >
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
