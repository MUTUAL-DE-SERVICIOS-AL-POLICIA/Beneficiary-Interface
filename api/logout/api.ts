"use server";

import { cookies } from "next/headers";

export async function logout() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("msp");
  } catch (e: any) {
    console.error(e);
  }
}
