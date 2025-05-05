import "@/utils/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import AlertProvider from "@/utils/context/AlertProvider";
import { BreadcrumbsComponent } from "@/components/common/breadcrumbs";
import { Navbar } from "@/components/header/navbar";
import { fontSans } from "@/utils/fonts";
import { title } from "@/components/common";

export const metadata: Metadata = {
  title: {
    default: "Beneficiarios",
    template: `%s - Beneficiarios`,
  },
  description: "Página de beneficiarios",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <AlertProvider>
            <div className="relative flex flex-col h-screen overflow-y-scroll">
              <Navbar />
              <main className="container mx-auto max-w-7xl flex-grow">
                <span className={title({ size: "sm" })}>Beneficiarios</span>
                {/* <div className="container">
                  <BreadcrumbsComponent />
                </div> */}
                {children}
              </main>
            </div>
          </AlertProvider>
        </Providers>
      </body>
    </html>
  );
}
