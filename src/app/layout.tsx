import "@/utils/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { Navbar } from "@/components/header/navbar";
import { fontSans } from "@/utils/fonts";
import { SidebarRoot } from "@/components/header/sidebarRoot";
import { getDeployEnvironment } from "@/utils/env";
import { GatewayRequestError, isAccessDeniedCode } from "@/utils/services/GatewayRequestError";
import { redirect } from "next/navigation";
import { hubPublicUrl, invalidSessionUrl } from "@/utils/auth/urls";
import { AlertServer } from "@/components/common";
import { getBeneficiaryContext, WebPermission } from "@/utils/auth/context";

export const metadata: Metadata = {
  title: {
    default: "Beneficiarios",
    template: `%s - Beneficiarios`,
  },
  description: "Beneficiarios",
  icons: {
    icon: "/icono_muserpol.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const environment = getDeployEnvironment();
  const computerToolName = "HERRAMIENTA TECNOLÓGICA BENEFICIARIOS";
  let sessionSnapshot;
  let permissions: WebPermission[] = [];
  let sessionError: GatewayRequestError | undefined;

  try {
    sessionSnapshot = await getBeneficiaryContext();
    ({ permissions } = sessionSnapshot);
  } catch (error) {
    if (error instanceof GatewayRequestError) {
      if (error.code === "SESSION_INVALID") redirect(invalidSessionUrl().toString());
      sessionError = error;
    } else {
      sessionError = new GatewayRequestError(502, "AUTH_UPSTREAM_ERROR");
    }
  }

  const identity = sessionSnapshot?.identity;
  const user = {
    name: identity?.name ?? identity?.preferredUsername ?? "Usuario",
    username: identity?.preferredUsername ?? identity?.sub ?? "Usuario",
    email: identity?.email,
    groups: sessionSnapshot?.groups ?? [],
    clientRoles: sessionSnapshot?.clientRoles ?? [],
  };
  const hubUrl = hubPublicUrl("/apphub").toString();
  const logoutUrl = hubPublicUrl("/api/auth/logout").toString();

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Providers permissions={permissions} themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="flex flex-col h-screen">
            <Navbar
              computerToolName={computerToolName}
              environment={environment}
              hubUrl={hubUrl}
              logoutUrl={logoutUrl}
              user={user}
            />
            <div className="flex flex-1 overflow-x-hidden">
              <SidebarRoot />
              <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-neutral-950">
                {sessionError ? (
                  <AlertServer
                    color={isAccessDeniedCode(sessionError.code) ? "warning" : "danger"}
                    description={sessionError.message}
                    href={hubUrl}
                  />
                ) : (
                  children
                )}
              </main>
            </div>
            {/* <footer className="bg-red-600 text-white text-center py-2 text-sm">
              <span className="uppercase text-sm font-semibold">Versión de pruebas</span>
            </footer> */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
