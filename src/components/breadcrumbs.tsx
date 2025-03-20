"use client";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import Link from "next/link";

export function BreadcrumbsComponent() {
  return (
    <div className="flex justify-end mr-8 mb-2">
      <Breadcrumbs radius="sm" variant="light">
        <BreadcrumbItem>inicio</BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/persons">personas</Link>
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}
