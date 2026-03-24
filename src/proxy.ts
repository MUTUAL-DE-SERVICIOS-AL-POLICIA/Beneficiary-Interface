import { NextRequest, NextResponse } from "next/server";
import { login } from "./api/auth/login";

export async function proxy(req: NextRequest) {
  const sid = req.cookies.get("sid")?.value;
  const pathname = req.nextUrl.pathname;
  const search = req.nextUrl.search;

  if (pathname === "/") {
    if (!sid) {
      const urlLogin = await login("/persons");
      return NextResponse.redirect(urlLogin);
    }

    const u = req.nextUrl.clone();
    u.pathname = "/persons";
    u.search = "";
    return NextResponse.redirect(u);
  }

  if (!sid) {
    const urlLogin = await login(pathname + search);
    return NextResponse.redirect(urlLogin);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth/|_next/|favicon.ico).*)"],
};