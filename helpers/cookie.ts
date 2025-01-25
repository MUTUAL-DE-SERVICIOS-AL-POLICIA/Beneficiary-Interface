"use server";
import { cookies } from "next/headers";

export const checkCookie = async () => {
  const cookie = getCookie("msp");

  if (cookie == undefined) {
    console.error("Sin cookie");
  }
  if (cookie) return cookie;
};

const getCookie = async (name: string) => {
  const cookie = await cookies();

  return cookie.get(name)?.value ?? undefined;
};
