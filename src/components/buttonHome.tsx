import { Button, Tooltip } from "@heroui/react";

import { HomeIcon } from "@/components";

interface Props {
  href: string;
}

export const ButtonHome = ({ href }: Props) => {
  return (
    <Tooltip>
      <Button isIconOnly variant="secondary" onPress={() => (window.location.href = href)}>
        <HomeIcon />
      </Button>
      <Tooltip.Content showArrow placement="bottom">
        <Tooltip.Arrow />
        <p>Inicio</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
