import { Avatar } from "@heroui/avatar";

import { basicPersonInfo } from "@/utils/types";

interface Props {
  user: basicPersonInfo;
  isPolice: boolean;
}
export const UserInfo = ({ user, isPolice }: Props) => {
  return (
    <div className="flex my-4">
      <div className="flex flex-col gap-1 items-center">
        <Avatar
          isBordered
          showFallback
          className="my-2"
          radius="sm"
          size="lg"
          src={isPolice ? "/svg/police.svg" : undefined}
        />
        <h4 className="text-medium font-semibold leading-none text-default-800 text-pretty text-center">
          {user?.fullName}
        </h4>
        <div className="flex gap-1">
          <p className="font-semibold text-default-800 text-small"> C.I. </p>
          <p className="text-default-600 text-small">{user?.identityCard}</p>
        </div>
        {isPolice && (
          <div className="flex gap-1">
            <p className="text-small font-semibold text-default-800">NUP.</p>
            <p className="text-small text-default-600">{user?.nup}</p>
          </div>
        )}
        {user.kinship && (
          <div className="flex gap-1">
            <p className="text-small font-semibold text-default-800">{user?.kinship}</p>
          </div>
        )}
      </div>
    </div>
  );
};
