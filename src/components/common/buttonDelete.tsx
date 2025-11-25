import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { GarbageIcon } from "@/components";

interface Props {
  onPress?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const ButtonDelete = ({ onPress = () => {}, isDisabled = false, isLoading = false }: Props) => {
  return (
    <Tooltip content="Eliminar">
      <Button
        isIconOnly
        color="danger"
        isDisabled={isDisabled}
        isLoading={isLoading}
        radius="lg"
        size="sm"
        variant="flat"
        onPress={onPress}
      >
        <GarbageIcon />
      </Button>
    </Tooltip>
  );
};
