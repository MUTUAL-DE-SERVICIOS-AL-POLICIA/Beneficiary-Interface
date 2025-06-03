import { InputCustom } from "@/components/common";

export const Address = () => {
  return (
    <fieldset className="border border-gray-400 rounded-md p-4 mb-1 flex-1">
      <legend className="text-sm px-2 font-semibold">DIRECCIÓN</legend>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/3 space-y-2">
          <InputCustom label="Ciudad" type="text" value="" />
        </div>
        <div className="flex flex-col space-y-2">
          <InputCustom label="Zona" type="text" value="" />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col w-full space-y-2 mt-6">
          <InputCustom label="Calle" type="text" value="" />
        </div>
      </div>
    </fieldset>
  );
};
