export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { PermissionsProvider } from "@/utils/context/PermissionsContext";
import { getPermissions } from "@/api/auth/permissions";
import { prepareCurrentClient } from "@/api/auth";
import { login } from "@/api/auth/login";
import type { Permission } from "@/utils/interfaces";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let permissions: Permission[] = [];

  try {
    permissions = await getPermissions();
  } catch (firstError) {
    console.warn("[persons/layout] getPermissions falló, intentando token exchange");

    try {
      await prepareCurrentClient();
      permissions = await getPermissions();
    } catch (secondError) {
      console.warn("[persons/layout] no se pudo recuperar el cliente actual");
      redirect(await login("/persons"));
    }
  }
  return (
    <PermissionsProvider permissions={permissions}>
      <div className="ml-2 mr-2 my-2">{children}</div>
    </PermissionsProvider>
  );
}