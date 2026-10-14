import { Separator } from "@heroui/react";

import { ButtonEdition, ButtonRegister } from "@/components";

interface Props {
  toRegister?: boolean;
  toEdit?: boolean;
  isLoading?: boolean;
  switchEdit: () => void;
  isEdit: boolean;
  onPressRegister?: () => void;
}

export const HeaderManage = ({
  toRegister = false,
  toEdit = false,
  isLoading = false,
  switchEdit,
  isEdit,
  onPressRegister = () => {},
}: Props) => {
  if (!(toRegister || toEdit)) return null;

  return (
    <>
      <div className="flex justify-end items-center gap-1">
        {toRegister && <ButtonRegister isDisabled={isEdit} isPending={isLoading} onPress={onPressRegister} />}
        {toEdit && <ButtonEdition isEdit={isEdit} onPress={switchEdit} />}
      </div>
      <Separator className="bg-gray-400 mb-2 mt-2 w-full" />
    </>
  );
};
