
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

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
  defaultTheme,
  storageKey,
  value,
  enableSystem,
  disableTransitionOnChange,
  forcedTheme
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute={attribute}
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      value={value}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      forcedTheme={forcedTheme}
    >
      {children}
    </NextThemesProvider>
  );
}
