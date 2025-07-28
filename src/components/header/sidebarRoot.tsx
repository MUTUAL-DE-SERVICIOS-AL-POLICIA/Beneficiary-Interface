"use client";

import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { useRouter, usePathname } from "next/navigation";

import { PersonsIcon, CollapseTrueIcon, CollapseFalseIcon } from "@/components";
import { useSidebar } from "@/app/providers";

export const SidebarRoot = () => {
  const { collapsed, toggleCollapsed } = useSidebar();
  const CollapseIcon = collapsed ? CollapseFalseIcon : CollapseTrueIcon;
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: "Personas", href: "/persons" },
    // { label: "Otro", href: "/" },
  ];

  return (
    <aside
      className={`text-black transition-all duration-300 h-full border-r border-gray-200 dark:border-gray-700 flex flex-col ${
        collapsed ? "w-14 items-center" : "w-60"
      }`}
    >
      <div
        className={`flex flex-col gap-2 p-2 ${
          collapsed ? "items-center" : ""
        } overflow-y-auto flex-grow max-h-full`}
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {menuItems.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");

          return (
            <Tooltip key={label} content={label} isDisabled={!collapsed} placement="right">
              <Button
                className={`flex items-center py-2 overflow-hidden transition-all duration-300 ${
                  collapsed ? "justify-center px-0 max-w-full" : "justify-start gap-2 px-3 max-w-full"
                } ${
                  isActive
                    ? "bg-green-200 dark:bg-green-950 text-black dark:text-white"
                    : "bg-transparent text-default-900 dark:text-default-100"
                }`}
                isIconOnly={collapsed}
                style={{ maxWidth: collapsed ? "3rem" : "15rem" }}
                variant={isActive ? "solid" : "light"}
                onPress={() => router.push(href)}
              >
                <PersonsIcon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span
                    className="text-base font-medium truncate"
                    style={{ maxWidth: "calc(100% - 1.25rem)" }}
                  >
                    {label}
                  </span>
                )}
              </Button>
            </Tooltip>
          );
        })}
      </div>

      <div
        className={`mt-auto p-2 flex transition-all duration-300 ${
          collapsed ? "flex-col items-center gap-2" : "items-center justify-between"
        }`}
      >
        <h2
          className={`text-xl font-bold tracking-wide transition-all duration-300 whitespace-nowrap overflow-hidden ${
            collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-full"
          }`}
        >
          Menú
        </h2>
        <Tooltip content={collapsed ? "Expandir" : "Colapsar"} placement="top">
          <Button
            isIconOnly
            className="flex items-center justify-center"
            variant="light"
            onPress={toggleCollapsed}
          >
            <CollapseIcon />
          </Button>
        </Tooltip>
      </div>
    </aside>
  );
};
