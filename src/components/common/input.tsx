import { Input } from "@heroui/input";
import { ComponentProps } from "react";
import clsx from "clsx";
import { CopyButton } from "@/components/common";

type InputProps = ComponentProps<typeof Input>;

interface InputCustomProps {
  label?: string;
  placeholder?: string;
  labelPlacement?: InputProps["labelPlacement"];
  variant?: InputProps["variant"];
  radius?: InputProps["radius"];
  value?: any;
  type?: InputProps["type"];
  isCopy?: boolean;
  endContent?: InputProps["endContent"];
}

export const InputCustom = ({
  label = undefined,
  placeholder = "Sin registro",
  labelPlacement = "outside",
  variant = "faded",
  radius = "sm",
  value = undefined,
  type,
  isCopy = false,
  endContent,
}: InputCustomProps) => {
  return (
    <Input
      classNames={{
        inputWrapper: clsx("border", "dark:hover:border-green-800", "dark:group-data-[focus=true]:border-green-800"),
      }}      
      endContent={isCopy ? (
        <CopyButton text={value} tooltip="Copiar" placement="bottom" />
      ) : endContent
      }
      label={label}
      labelPlacement={labelPlacement}
      placeholder={placeholder}
      radius={radius}
      type={type}
      value={value ?? undefined}
      variant={variant}
    />
  );
};
