import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Link } from "@heroui/link";

import { HomeIcon } from "@/components";

interface Props {
  href: string;
}

export const ButtonHome = ({ href }: Props) => {
  return (
    <Tooltip content="Inicio" placement="bottom">
      <Button isIconOnly as={Link} color="success" href={href} variant="bordered">
        <HomeIcon />
      </Button>
    </Tooltip>
  );
};
