"use client";
import { Avatar, Card } from "@heroui/react";
import { useState } from "react";

import { CopyButton, ButtonEdition, ButtonRegister, ButtonEdit, ButtonDelete } from "@/components";

interface Props {
  user: {
    fullName: string;
    identityCard: string;
    nup?: string;
    kinship?: string;
    state?: boolean;
  };
  isPolice: boolean;
  isRegister?: boolean;
  isEdit?: boolean;
  isDelete?: boolean;
  hasPhoto?: boolean;
  onPressRegister?: () => void;
  onPressEdit?: () => void;
  onPressDelete?: () => void;
}

export const UserInfo = ({
  user,
  isPolice,
  isRegister = false,
  isEdit = false,
  isDelete = false,
  hasPhoto = false,
  onPressRegister = () => {},
  onPressEdit = () => {},
  onPressDelete = () => {},
}: Props) => {
  const [isEdition, setEdition] = useState(false);

  const switchEdit = () => {
    setEdition(!isEdition);
  };

  return (
    <Card className="justify-center flex border-2 border-default-300 min-w-90 w-full">
      <div className="flex flex-col gap-1 items-center">
        <div className="relative">
          <Avatar className="size-40">
            <Avatar.Image alt="Extra Large" src={isPolice ? "/svg/police.svg" : "/svg/person.svg"} />
          </Avatar>
          <span className="absolute bottom-1 right-1">
            {hasPhoto ? (
              <ButtonEdition isIconOnly isEdit={isEdition} onPress={switchEdit} />
            ) : (
              isRegister && <ButtonRegister isIconOnly onPress={onPressRegister} />
            )}
          </span>
        </div>
        {isEdition && (
          <div className="flex items-center gap-1">
            {hasPhoto && isEdit && <ButtonEdit onPress={onPressEdit} />}
            {hasPhoto && isDelete && <ButtonDelete onPress={onPressDelete} />}
          </div>
        )}
        <h4 className="text-medium font-bold text-default-800 text-pretty text-center uppercase">
          {user?.fullName}
        </h4>
        <div className="flex items-center gap-1 leading-none">
          <p className="font-semibold text-default-800 text-small">C.I.</p>
          <p className="text-default-600 text-small">{user?.identityCard}</p>
          <CopyButton text={user?.identityCard} />
        </div>
        {isPolice && (
          <div className="flex items-center gap-1 leading-none">
            <p className="text-small font-semibold text-default-800">NUP.</p>
            <p className="text-small text-default-600">{user?.nup}</p>
            <CopyButton text={user?.nup} />
          </div>
        )}
        {user?.kinship && (
          <div className="flex items-center gap-1 leading-none">
            <p className="text-small font-semibold text-default-800">{user?.kinship}</p>
          </div>
        )}
        {!user?.state && (
          <p className="text-small text-yellow-600 text-center leading-none">- No vigente -</p>
        )}
      </div>
    </Card>
  );
};
