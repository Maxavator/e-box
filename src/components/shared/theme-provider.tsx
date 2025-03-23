
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Define the Attribute type that was missing
type Attribute = string;

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
  attribute,
  defaultTheme,
  storageKey,
  value,
  enableSystem,
  disableTransitionOnChange,
  forcedTheme
}: ThemeProviderProps) {
  // Explicitly cast attribute to Attribute | Attribute[] type
  const attributeValue = attribute as Attribute | Attribute[];
  
  return (
    <NextThemesProvider 
      attribute={attributeValue}
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
