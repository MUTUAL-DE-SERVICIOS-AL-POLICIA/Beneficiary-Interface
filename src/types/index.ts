import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ResponseData {
  error: boolean;
  message: string;
  [key: string]: any; // Permite otros campos con nombres arbitrarios y valores de cualquier tipo
}
