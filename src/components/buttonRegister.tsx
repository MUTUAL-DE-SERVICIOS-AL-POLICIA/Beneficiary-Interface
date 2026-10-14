import { Button, Spinner, Tooltip } from "@heroui/react";

import { RegisterIcon } from "@/components";

export interface Props {
  onPress?: () => void;
  isPending?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
}

export const ButtonRegister = ({
  onPress = () => {},
  isPending = false,
  isDisabled = false,
  isIconOnly = false,
}: Props) => {
  return (
    <Tooltip delay={0}>
      <Button
        className="text-green-600"
        isDisabled={isDisabled}
        isPending={isPending}
        size="sm"
        variant="secondary"
        onPress={onPress}
      >
        {isIconOnly ? null : "REGISTRAR"}
        {isPending ? <Spinner color="current" size="sm" /> : <RegisterIcon />}
      </Button>
      <Tooltip.Content showArrow placement="right">
        <Tooltip.Arrow />
        <p>Registrar</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
