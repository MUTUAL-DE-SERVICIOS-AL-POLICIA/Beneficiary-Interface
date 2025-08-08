"use client";

import { AvatarIcon } from "@heroui/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { User } from "@heroui/user";

interface Props {
  username: string;
  name: string;
  onLogout: () => void;
}
export const UserSession = ({ username, name, onLogout }: Props) => {
  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            icon: <AvatarIcon />,
          }}
          className="transition-transform"
          description={username}
          name={name}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-bold text-green-700">Sesión activa</p>
          <p>{name}</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={onLogout}>
          <p className="text-red-600">Cerrar sesión</p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
