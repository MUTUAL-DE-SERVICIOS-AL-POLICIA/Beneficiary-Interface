"use client";

import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { useCallback } from "react";

import { CopyIcon } from "@/components/icons";

interface CopyButtonProps {
  text: string;
  tooltip?: string;
  placement?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg";
}

export const CopyButton = ({ text, tooltip = "Copiar", placement = "top", size = "sm" }: CopyButtonProps) => {
  const handleCopy = useCallback(() => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch((err) => {
        console.error("Error al copiar usando clipboard API", err);
      });
    } else {
      try {
        const textarea = document.createElement("textarea");

        textarea.value = text;
        Object.assign(textarea.style, {
          position: "fixed",
          opacity: "0",
        });
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (err) {
        console.error("Error al copiar con fallback", err);
      }
    }
  }, [text]);

  return (
    <Tooltip content={tooltip} placement={placement}>
      <Button isIconOnly size={size} variant="light" onPress={handleCopy}>
        <CopyIcon />
      </Button>
    </Tooltip>
  );
};
