"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import plPL from "antd/locale/pl_PL";

type Mode = "light" | "dark";

const ThemeModeContext = createContext<{ mode: Mode; toggle: () => void }>({
  mode: "light",
  toggle: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

// Stonowane złoto - kolor kuli lotto, świadomie zamiast typowego
// niebieskiego "corporate" akcentu AntD.
const GOLD = "#D4A73A";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("lotto-theme-mode") as Mode | null;
    if (stored) setMode(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("lotto-theme-mode", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode, mounted]);

  const toggle = () => setMode((m) => (m === "light" ? "dark" : "light"));

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ConfigProvider
        locale={plPL}
        theme={{
          algorithm:
            mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: GOLD,
            borderRadius: 10,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
}