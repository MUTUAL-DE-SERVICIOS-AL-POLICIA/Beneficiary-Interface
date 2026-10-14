import type { InputHTMLAttributes } from "react";

import clsx from "clsx";

import { CopyButton } from "@/components";

interface InputCustomProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "size"> {
  label?: string;
  placeholder?: string;
  value?: string | number | readonly string[] | undefined;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  isCopy?: boolean;
}

export const InputCustom = ({
  label,
  placeholder = "Sin registro",
  value,
  type = "text",
  isCopy = false,
  className,
  ...props
}: InputCustomProps) => {
  return (
    <div className="w-full">
      {label ? <label className="mb-2 block text-sm font-medium text-foreground">{label}</label> : null}

      <div className="relative">
        <input
          {...props}
          className={clsx(
            "w-full rounded-md border border-default-200 bg-transparent px-3 py-2 text-sm text-foreground outline-none transition focus:border-green-800 dark:border-default-700 dark:focus:border-green-800",
            isCopy && "pr-11",
            className,
          )}
          placeholder={placeholder}
          readOnly={props.readOnly ?? !props.onChange}
          type={type}
          value={value ?? ""}
        />

        {isCopy ? (
          <div className="absolute inset-y-0 right-2 flex items-center">
            <CopyButton
              placement="bottom"
              text={typeof value === "string" ? value : String(value ?? "")}
              tooltip="Copiar"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
