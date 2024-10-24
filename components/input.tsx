import { Input } from "@nextui-org/input"
import { ComponentProps } from "react"

type InputProps = ComponentProps<typeof Input>

const classNames = {
  inputWrapper: [
    "border",
    "dark:hover:border-lime-400",
    "dark:group-data-[focus=true]:border-lime-400"
  ]
}

interface InputCustomProps {
  label: string
  placeholder?: string,
  labelPlacement?: InputProps["labelPlacement"]
  variant?: InputProps["variant"]
  radius?: InputProps["radius"]
  value: string
  type?: InputProps["type"]
}

export const InputCustom = (props: InputCustomProps) => {

  const { label, placeholder, labelPlacement, variant, radius, value, type } = props

  return (
    <Input
      label={label}
      labelPlacement={labelPlacement ?? 'outside'}
      placeholder={placeholder ?? 'Sin dato'}
      variant={variant ?? 'faded'}
      radius={radius ?? 'sm'}
      value={value ?? 'Sin dato'}
      type={type}
      classNames={classNames}
    />
  )
}