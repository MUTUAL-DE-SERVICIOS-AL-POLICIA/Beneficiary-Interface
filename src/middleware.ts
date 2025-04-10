import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const middleware = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("msp");
  const token = cookie?.value;

  const host = process.env.NEXT_PUBLIC_SERVER_FRONTEND || "";
  const port = process.env.LOGIN_FRONTEND_PORT || "";
  const url = "http://" + host + ":" + port + "/login";

  try {
    if (!token) {
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (e) {
    console.error("Error verificando token en middleware", e);

    return NextResponse.redirect(url);
  }
};
