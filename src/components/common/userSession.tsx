"use client";

import { AvatarIcon } from "@heroui/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { User } from "@heroui/user";

interface Props {
  username: string;
  name: string;
  onLogout: () => void;
  urlLogin: string;
}
export const UserSession = ({ username, name, onLogout, urlLogin }: Props) => {
  const handleOnPress = async () => {
    await onLogout();
    window.location.href = urlLogin;
  };

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
        <DropdownItem key="profile" className="h-14 gap-2" color="success">
          <p className="font-bold text-green-700">Sesión activa</p>
          <p>{name}</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={handleOnPress}>
          <p className="text-red-600">Cerrar sesión</p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
