import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { EditIcon, CancelIcon } from "@/components";

export interface Props {
  onPress?: () => void;
  isEdit?: boolean;
}

export const ButtonEdit = ({ onPress = () => {}, isEdit = false }: Props) => {
  return (
    <Tooltip content={isEdit ? "desactivar modo edición" : "activar modo edición"}>
      <Button
        className={isEdit ? "bg-red-600 text-white" : ""}
        endContent={isEdit ? <CancelIcon /> : <EditIcon />}
        onPress={onPress}
      >
        {isEdit ? "CANCELAR" : "EDITAR"}
      </Button>
    </Tooltip>
  );
};
