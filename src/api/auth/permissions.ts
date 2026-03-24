"use server";

import { apiClient } from "@/utils/services";
import type { Permission } from "@/utils/interfaces";
import { frontend } from "@/utils/env";

export async function getPermissions(): Promise<Permission[]> {
  const r = await apiClient.GET("auth/permissions", {
    audience: frontend.clientId,
    clientId: frontend.clientId,
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || "No se pudieron obtener los permisos");
  }

  const data = await r.json();
  return data.permissions ?? [];
}