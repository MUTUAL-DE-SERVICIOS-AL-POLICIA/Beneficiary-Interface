import { Button, Tooltip } from "@heroui/react";

import { EditIcon, CancelIcon } from "@/components";

interface Props {
  onPress?: () => void;
  isEdit?: boolean;
  isIconOnly?: boolean;
}

export const ButtonEdition = ({ onPress = () => {}, isEdit = false, isIconOnly = false }: Props) => {
  return (
    <Tooltip delay={0}>
      <Button size="sm" variant={isEdit ? "danger" : "secondary"} onPress={onPress}>
        {isIconOnly ? null : isEdit ? "CANCELAR" : "EDITAR"}
        {isEdit ? <CancelIcon /> : <EditIcon />}
      </Button>
      <Tooltip.Content showArrow placement="right">
        <Tooltip.Arrow />
        <p>{isEdit ? "desactivar modo edición" : "activar modo edición"}</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
