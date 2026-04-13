import { createContext, useState } from "react";
import { THEME, STORAGE_KEYS } from "../constants/constants";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage
      .getItem(STORAGE_KEYS.THEME)
      ?.toLocaleUpperCase();

    return THEME.hasOwnProperty(storedTheme) ? THEME[storedTheme] : THEME.LIGHT;
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      return newTheme;
    });
  };

  const themeConfig = {
    [THEME.LIGHT]: {
      bg: "bg-gray-50",
      bgGradient: "bg-gradient-to-br from-orange-50 to-yellow-50",
      card: "bg-white",
      text: "text-gray-900",
      textMuted: "text-gray-600",
      textSecondary: "text-gray-500",
      border: "border-gray-300",
      accent: "orange",
      accentBg: "bg-orange-50",
      accentBg2: "bg-orange-100",
      accentHover: "hover:bg-orange-100",
      accentText: "text-orange-600",
      accentTextHover: "hover:text-orange-700",
      buttonPrimary: "bg-orange-600 hover:bg-orange-700",
      shadow: "shadow-md",
    },
    [THEME.DARK]: {
      bg: "bg-gray-900",
      bgGradient: "bg-gradient-to-br from-gray-900 to-gray-800",
      card: "bg-gray-800",
      text: "text-gray-100",
      textMuted: "text-gray-300",
      textSecondary: "text-gray-400",
      border: "border-gray-700",
      accent: "orange",
      accentBg: "bg-orange-900 bg-opacity-30",
      accentBg2: "bg-orange-700 bg-opacity-30",
      accentHover: "hover:bg-orange-900 hover:bg-opacity-50",
      accentText: "text-orange-400",
      accentTextHover: "hover:text-orange-300",
      buttonPrimary: "bg-orange-600 hover:bg-orange-700",
      shadow: "shadow-md",
    },
  };

  const currentTheme = themeConfig[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, ...currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
