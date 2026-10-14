"use client";

import { Button, Tooltip } from "@heroui/react";
import { useState } from "react";

import { ExpandIcon, CollapseIcon } from "@/components/icons";

export interface Props {
  onPress: () => void;
}

export const ButtonExpand = ({ onPress }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
    onPress();
  };

  return (
    <div className="absolute bottom-2 left-4 z-10">
      <Tooltip>
        <Button isIconOnly onPress={handlePress}>
          {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
        </Button>
        <Tooltip.Content showArrow placement="right">
          <Tooltip.Arrow />
          <p>{isExpanded ? "Contraer" : "Expandir"}</p>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
};
