"use client";

import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
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
      <Tooltip content={isExpanded ? "Contraer" : "Expandir"} placement="left">
        <Button isIconOnly onPress={handlePress}>
          {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
        </Button>
      </Tooltip>
    </div>
  );
};
