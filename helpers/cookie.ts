"use server";
import { cookies } from "next/headers";

export const checkCookie = async () => {
  const cookie = await getCookie("msp");

  if (cookie == undefined) {
    console.error("Sin cookie");
  }
  if (cookie) return cookie;
};

const getCookie = async (name: string) => {
  return cookies().get(name)?.value ?? undefined;
};
