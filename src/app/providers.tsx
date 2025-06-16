"use client";

import type { ThemeProviderProps } from "next-themes";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  initialSidebarCollapsed?: boolean;
}

type SidebarContextType = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  initialCollapsed = true,
}: {
  children: ReactNode;
  initialCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");

    if (stored !== null) {
      setCollapsed(stored === "true");
    } else {
      setCollapsed(initialCollapsed);
    }
  }, [initialCollapsed]);

  useEffect(() => {
    if (collapsed !== null) {
      localStorage.setItem("sidebar-collapsed", collapsed.toString());
    }
  }, [collapsed]);

  if (collapsed === null) {
    return null;
  }

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}

export function Providers({ children, themeProps, initialSidebarCollapsed }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ToastProvider />
        <SidebarProvider initialCollapsed={initialSidebarCollapsed ?? true}>{children}</SidebarProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
