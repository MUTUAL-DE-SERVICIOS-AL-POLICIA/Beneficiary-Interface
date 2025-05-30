import "@/utils/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { Navbar } from "@/components/header/navbar";
import { fontSans } from "@/utils/fonts";
import { title, subtitle, BreadcrumbsState } from "@/components/common";
import { getDeployEnvironment } from "@/utils/env";

export const metadata: Metadata = {
  title: {
    default: "Herramienta Informático Beneficiarios",
    template: `%s - Herramienta Informático Beneficiarios`,
  },
  description: "Herramienta Informático Beneficiarios",
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
          <div className="relative flex flex-col h-screen overflow-y-scroll">
            <Navbar />
            <main className="container mx-auto max-w-7xl flex-grow">
              <span className={title({ size: "sm" })}>Herramienta Informático Beneficiarios</span>
              <div className={subtitle()}>
                <BreadcrumbsState />
              </div>
              {children}
            </main>
            {getDeployEnvironment() === "dev" && (
              <footer className="fixed bottom-0 left-0 w-full bg-red-600 text-white text-center py-2 text-sm z-50">
                <span className="uppercase text-sm font-semibold">Versión de pruebas</span>
              </footer>
            )}
          </div>
        </Providers>
      </body>
    </html>
  );
}
