import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, THEME } from "../constants/constants";

const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem(STORAGE_KEYS.THEME) === THEME.DARK,
  );

  useEffect(() => {
    document.documentElement.classList.toggle(THEME.DARK, isDark);
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? THEME.DARK : THEME.LIGHT);
  }, [isDark]);

  const toggleTheme = () => setIsDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
