"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

import { subtitle } from "./primitives";

import { urlLogin } from "@/utils/services";

export const BreadcrumbsState = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const getLabelFromSegment = (segment: string): string => {
    if (/^persons$/.test(segment)) return "Personas";
    if (/^[0-9a-fA-F-]{36}$/.test(segment)) return "Perfil";

    return segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = getLabelFromSegment(segment);

    return { href, label };
  });

  return (
    <Breadcrumbs className={subtitle() + "w-full m-2"} underline="hover">
      <BreadcrumbItem key="roles">
        <Link href={urlLogin}>Inicio</Link>
      </BreadcrumbItem>

      {breadcrumbs.map((crumb, index) => {
        const isCurrent = index === breadcrumbs.length - 1;

        return (
          <BreadcrumbItem key={crumb.href} isCurrent={isCurrent}>
            <Link href={crumb.href}>{crumb.label}</Link>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
};
