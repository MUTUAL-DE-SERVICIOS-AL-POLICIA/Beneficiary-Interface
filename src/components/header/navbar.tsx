import { NavbarBrand, NavbarContent, NavbarItem, Navbar as NextUINavbar } from "@heroui/navbar";
import NextLink from "next/link";

import { UserComponent } from "./user";
import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { getUserCookie } from "@/utils/helpers/cookies";
import { Suspense } from "react";
export const Navbar = async () => {
  const { data } = await getUserCookie();
  return (
    <Suspense>
      <NextUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink className="flex justify-start items-center gap-1" href="/apphub">
              <Logo height={30} width={80} />
            </NextLink>
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
