import { Button, Spinner, Tooltip } from "@heroui/react";

import { GarbageIcon } from "@/components";

interface Props {
  onPress?: () => void;
  isDisabled?: boolean;
  isPending?: boolean;
}

export const ButtonDelete = ({ onPress = () => {}, isDisabled = false, isPending = false }: Props) => {
  return (
    <Tooltip delay={0}>
      <Button
        isIconOnly
        isDisabled={isDisabled}
        isPending={isPending}
        size="sm"
        variant="danger-soft"
        onPress={onPress}
      >
        {isPending ? <Spinner color="current" size="sm" /> : <GarbageIcon />}
      </Button>
      <Tooltip.Content showArrow placement="right">
        <Tooltip.Arrow />
        <p>Eliminar</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
