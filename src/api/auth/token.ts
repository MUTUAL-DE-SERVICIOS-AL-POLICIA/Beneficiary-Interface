"use server";

import { apiClient } from "@/utils/services";
import { frontend } from "@/utils/env";
import { getPermissions } from "./permissions";
import type { Permission, User } from "@/utils/interfaces";
import { getCookie, getProfileCookie } from "@/utils/helpers/cookie";
import { cookies } from "next/headers";

const clientId = frontend.clientId;

export async function exchangeCurrentClient() {
  const r = await apiClient.POST("auth/token/exchange", {
    audience: clientId,
  });

  const data = await r.json();
  return data;
}

type EnsureBeneficiaryClientSessionResult = {
  profile: User | null;
  permissions: Permission[];
};

export async function ensureBeneficiaryClientSession(): Promise<EnsureBeneficiaryClientSessionResult> {
  try {
    const { data: profile } = await getProfileCookie();
    const permissions = await getPermissions();

    if (profile) {
      return {
        profile,
        permissions,
      };
    }
  } catch {
    // seguimos con token exchange
  }

  const exchanged = await exchangeCurrentClient();

  return {
    profile: exchanged.profile as User,
    permissions: (exchanged.permissions ?? []) as Permission[],
  };
}
export async function tokenStatus(clientId: string): Promise<{
  exists: boolean;
  valid: boolean;
}> {
  try {
    const sid = (await cookies()).get("sid")?.value;

    if (!sid) {
      return { exists: false, valid: false };
    }

    const res = await apiClient.GET("auth/token/verify", {
      clientId,
    });

    const data = await res.json();

    return {
      exists: data.exists === true,
      valid: data.isValid === true,
    };
  } catch {
    return { exists: false, valid: false };
  }
}

export async function prepareCurrentClient() {
  const sid = await getCookie("sid");

  if (!sid) {
    throw new Error("Falta cookie sid");
  }

  const r = await apiClient.POST("auth/token/exchange", {
    sid,
    audience: frontend.clientId,
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || "No se pudo preparar el cliente actual");
  }

  return await r.json();
}