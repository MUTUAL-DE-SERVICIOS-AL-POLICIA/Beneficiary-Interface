import { Link } from "@heroui/link";
import { Tooltip } from "@heroui/tooltip";
import { NavbarBrand, NavbarContent, NavbarItem, Navbar as NextUINavbar } from "@heroui/navbar";

import { UserSession, ThemeSwitch, Search } from "@/components/common";
import { Logo } from "@/components/icons";
import { searchPerson } from "@/api/person";
interface Props {
  user: { name: string; username: string; email?: string; groups: string[]; clientRoles: string[] };
  environment: string;
  computerToolName: string;
  hubUrl: string;
  logoutUrl: string;
}

export const Navbar = ({ user, environment, computerToolName, hubUrl, logoutUrl }: Props) => {
  return (
    <NextUINavbar
      isBordered
      className="border-r light:border-gray-200 dark:border-gray-500"
      maxWidth="full"
      position="sticky"
    >
      <NavbarContent className="hidden sm:flex" justify="start">
        <NavbarBrand className="gap-7">
          <Tooltip content="Ir inicio" placement="bottom">
            <Link className="flex justify-start items-center gap-1" href={hubUrl}>
              <Logo height={105} width={105} />
            </Link>
          </Tooltip>
          <div className="flex flex-col items-center text-center leading-tight">
            <span className="font-bold text-md uppercase">{computerToolName}</span>
            {(environment === "dev" || environment === "test") && (
              <span className="mt-1 text-xs font-medium text-white bg-red-500 px-2 py-0.5 rounded-sm shadow-xs shadow-red-300 border border-white/20">
                {environment === "test" ? "VERSIÓN DE PRUEBAS" : "VERSIÓN DE DESARROLLO"}
              </span>
            )}
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Search searchPerson={searchPerson} />
          <ThemeSwitch />
          <UserSession
            clientRoles={user.clientRoles}
            email={user.email}
            groups={user.groups}
            logoutUrl={logoutUrl}
            name={user.name}
            username={user.username}
          />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
