"use client";
import { Avatar, AvatarIcon } from "@nextui-org/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";

import { apiServerFrontend } from "@/services";

export function UserComponent() {
  const handleLogout = async () => {
    const response = await apiServerFrontend.POST("logout", {});

    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Avatar isBordered as="button" className="transition-transform" icon={<AvatarIcon />} />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
          Salir sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
