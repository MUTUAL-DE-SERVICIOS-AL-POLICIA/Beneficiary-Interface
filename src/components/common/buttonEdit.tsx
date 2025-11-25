import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { EditIcon } from "@/components";

interface Props {
  onPress?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const ButtonEdit = ({ onPress = () => {}, isDisabled = false, isLoading = false }: Props) => {
  return (
    <Tooltip content="Editar">
      <Button
        isIconOnly
        color="primary"
        isDisabled={isDisabled}
        isLoading={isLoading}
        radius="lg"
        size="sm"
        variant="flat"
        onPress={onPress}
      >
        <EditIcon />
      </Button>
    </Tooltip>
  );
};
