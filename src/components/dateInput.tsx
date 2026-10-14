import type { ComponentProps } from "react";

import { DateField, Label } from "@heroui/react";
import { parseDate } from "@internationalized/date";

type DateFieldValue = ComponentProps<typeof DateField>["value"];

type Props = Omit<ComponentProps<typeof DateField>, "children" | "fullWidth" | "value"> & {
  label?: string;
  labelPlacement?: "inside" | "outside";
  radius?: string;
  value?: Date | string | null;
  variant?: string;
};

export const DateInputCustom = ({
  label,
  labelPlacement: _labelPlacement,
  radius: _radius,
  value,
  variant: _variant,
  ...props
}: Props) => {
  const parsedValue = parseDateValue(value);

  return (
    <DateField
      {...props}
      fullWidth
      aria-label={label ? undefined : (props["aria-label"] ?? "Fecha")}
      value={parsedValue}
    >
      <Label>{label ?? "Fecha"}</Label>
      <DateField.Group className="border dark:hover:border-green-800 dark:group-data-[focus-within=true]:border-green-800">
        <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
      </DateField.Group>
    </DateField>
  );
};

function parseDateValue(value: Date | string | null | undefined): DateFieldValue {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;

    return parseDate(value.toISOString().slice(0, 10)) as unknown as DateFieldValue;
  }

  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  try {
    return parseDate(value) as unknown as DateFieldValue;
  } catch {
    return null;
  }
}
