import { NavbarBrand, NavbarContent, NavbarItem, Navbar as NextUINavbar } from "@heroui/navbar";
import { Link } from "@heroui/link";
import React, { Suspense } from "react";

import { Logo } from "@/components/common/icons";
import { ThemeSwitch } from "@/components/common/theme-switch";
import UserComponent from "@/components/header/user";
import { urlLogin } from "@/utils/services";
import { getUserCookie } from "@/utils/helpers/cookie";

export const Navbar = async () => {
  const { data } = await getUserCookie();

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <NextUINavbar isBordered maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <Link className="flex justify-start items-center gap-1" href={`${urlLogin}/apphub`}>
              <Logo height={30} width={80} />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="hidden sm:flex gap-2">
            <ThemeSwitch />
          </NavbarItem>
          <UserComponent user={data} />
        </NavbarContent>
      </NextUINavbar>
    </Suspense>
  );
};
