
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useLocation } from "react-router-dom";

// Define the Attribute type
type Attribute = "class" | "data-theme";

// Define the ThemeProviderProps interface manually since we can't import from next-themes/dist/types
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: Attribute | Attribute[];
  value?: any;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  forcedTheme?: string;
}

export function ThemeProvider({ 
  children,
  attribute = "data-theme",
  defaultTheme = "light", // Set light as the default theme
  storageKey,
  value,
  enableSystem = false, // Disable system preference by default
  disableTransitionOnChange,
  forcedTheme
}: ThemeProviderProps) {
  // Check current route to force light theme on auth page
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const themeToUse = isAuthPage ? "light" : forcedTheme;

  return (
    <NextThemesProvider 
      attribute={attribute}
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      value={value}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      forcedTheme={themeToUse}
    >
      {children}
    </NextThemesProvider>
  );
}
