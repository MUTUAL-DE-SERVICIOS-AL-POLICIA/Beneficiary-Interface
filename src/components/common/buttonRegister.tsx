import { Button } from "@heroui/button";

import { RegisterIcon } from "@/components";

export interface Props {
  onPress?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const ButtonRegister = ({ onPress = () => {}, isLoading = false, isDisabled = false }: Props) => {
  return (
    <Button
      color="success"
      endContent={<RegisterIcon />}
      isDisabled={isDisabled}
      isLoading={isLoading}
      variant="flat"
      onPress={onPress}
    >
      REGISTRAR
    </Button>
  );
};
