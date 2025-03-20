import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { buildBackendUrl } from "@/helpers/utils";

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next();
  const cookieStore = await cookies();
  const cookie = cookieStore.get("msp");
  const token = cookie?.value;

  response.headers.set("Access-Control-Allow-Origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN!);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, next-action, next-router-state-tree, Credentials",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  const host = process.env.NEXT_PUBLIC_SERVER_FRONTEND || "";
  const port = process.env.LOGIN_FRONTEND_PORT || "";
  const constructedURL = buildBackendUrl({
    host,
    port,
    path: "login",
  });

  try {
    if (request.nextUrl.pathname == "/") {
      if (token) {
        const url = request.nextUrl.clone();

        url.pathname = "/persons";

        return NextResponse.redirect(url);
      } else {
        return NextResponse.redirect(constructedURL);
      }
    }
    if (request.nextUrl.pathname == "/persons") {
      if (token) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(constructedURL);
      }
    }
    if (request.nextUrl.pathname == "/person") {
      if (token) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(constructedURL);
      }
    }
    if (request.nextUrl.pathname.startsWith("/person")) {
      if (token) {
        return NextResponse.next();
      } else {
        const url = request.nextUrl.clone();

        url.pathname = "/login";

        return NextResponse.redirect(constructedURL);
      }
    }
  } catch (e) {
    console.error("Error verficando token en middleware", e);

    return NextResponse.redirect(constructedURL);
  }
};
