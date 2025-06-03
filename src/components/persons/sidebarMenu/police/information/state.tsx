import { InputCustom } from "@/components/common";

interface Props {
  nameAffiliateState: string;
  type: string;
}
export const State = ({ nameAffiliateState, type }: Props) => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1 flex-1">
      <legend className="text-sm px-2 font-semibold">ESTADO DEL POLICÍA</legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2">
          <InputCustom label="Estado" type="text" value={nameAffiliateState} />
        </div>
        <div className="flex flex-col w-1/2">
          <InputCustom label="Tipo" type="text" value={type} />
        </div>
      </div>
    </fieldset>
  );
};
