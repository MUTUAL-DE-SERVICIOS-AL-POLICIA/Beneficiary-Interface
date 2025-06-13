import { DateInput } from "@heroui/date-input";
import { parseDate } from "@internationalized/date";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof DateInput>, "value"> & {
  value?:  Date | string | null; // formato "aaaa-mm-dd"
};

const classNames = {
  inputWrapper: [
    "border",
    "dark:hover:border-green-800",
    "dark:group-data-[focus=true]:border-green-800",
  ],
};

export const DateInputCustom = ({ value, ...props }: Props) => {
  const parsedValue = isValidISODate(value) ? parseDate(value!) : undefined;

  return <DateInput {...props} labelPlacement="outside" variant="faded" radius="sm" value={parsedValue} classNames={classNames} />;
};

function isValidISODate(date: unknown): date is string {
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
}
