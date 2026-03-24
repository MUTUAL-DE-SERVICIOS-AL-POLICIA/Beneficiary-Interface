"use server";

import { backend, frontend, hubFrontend } from "@/utils/env";

export async function login(returnTo = "/persons"): Promise<string> {
  const loginUrl = new URL(`${backend.url}/api/auth/login`);
  loginUrl.searchParams.set("returnTo", `${frontend.url}${returnTo}`);
  loginUrl.searchParams.set("clientId", hubFrontend.clientId);
  return loginUrl.toString();
}