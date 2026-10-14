export interface Props {
  text?: string;
}

export const EmptyContent = ({ text = "NO EXISTE REGISTROS" }: Props) => {
  return <div className="h-full flex items-center justify-center text-sm text-gray-600 italic">{text}</div>;
};
