"use server";
import { cookies } from "next/headers";

import { ResponseData } from "../interfaces/index";
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

export async function getUserCookie(): Promise<ResponseData> {
  try {
    const raw = await getCookie("user");

    if (!raw) {
      return {
        error: true,
        message: "No se encontró la cookie 'user'",
      };
    }

    return {
      error: false,
      message: "Cookie 'user' obtenida exitosamente",
      data: JSON.parse(raw),
    };
  } catch (error) {
    return {
      error: true,
      message: "Error al parsear la cookie 'user': " + error,
    };
  }
}
