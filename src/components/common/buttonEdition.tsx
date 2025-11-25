import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { EditIcon, CancelIcon } from "@/components";

interface Props {
  onPress?: () => void;
  isEdit?: boolean;
}

export const ButtonEdition = ({ onPress = () => {}, isEdit = false }: Props) => {
  return (
    <Tooltip content={isEdit ? "desactivar modo edición" : "activar modo edición"}>
      <Button
        color={isEdit ? "danger" : "primary"}
        endContent={isEdit ? <CancelIcon /> : <EditIcon />}
        variant="flat"
        onPress={onPress}
      >
        {isEdit ? "CANCELAR" : "EDITAR"}
      </Button>
    </Tooltip>
  );
};
