import "@/utils/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { Navbar } from "@/components/header/navbar";
import { fontSans } from "@/utils/fonts";
import { subtitle, BreadcrumbsState } from "@/components/common";
import { SidebarRoot } from "@/components/header/sidebarRoot";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <SidebarRoot />
              <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-neutral-950">
                <div className={subtitle()}>
                  <BreadcrumbsState />
                </div>
                {children}
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
