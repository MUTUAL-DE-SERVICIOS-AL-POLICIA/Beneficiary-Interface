import { Button, Spinner, Tooltip } from "@heroui/react";

import { EditIcon } from "@/components";

interface Props {
  onPress?: () => void;
  isDisabled?: boolean;
  isPending?: boolean;
}

export const ButtonEdit = ({ onPress = () => {}, isDisabled = false, isPending = false }: Props) => {
  return (
    <Tooltip delay={0}>
      <Button
        isIconOnly
        isDisabled={isDisabled}
        isPending={isPending}
        size="sm"
        variant="secondary"
        onPress={onPress}
      >
        {isPending ? <Spinner color="current" size="sm" /> : <EditIcon />}
      </Button>
      <Tooltip.Content showArrow placement="right">
        <Tooltip.Arrow />
        <p>Editar</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
