import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme configurations
export const themes = {
  dark: {
    name: "dark",
    colors: {
      // Background gradients
      primary: "from-[#033e5b] to-[#012c42]",
      secondary: "bg-[#0c1a25]",
      tertiary: "bg-[#012c42]",
      
      // Borders
      border: "border-[#1a2b3d]",
      borderAccent: "border-[#034a6f]",
      
      // Text colors
      textPrimary: "text-[#e0e6f0]",
      textSecondary: "text-[#b8c5d1]",
      textAccent: "text-[#34d3f5]",
      
      // Interactive elements
      button: "bg-[#34d3f5] hover:bg-cyan-400 text-black",
      buttonSecondary: "bg-[#13202e] hover:bg-[#1a2b3d] text-[#e0e6f0]",
      input: "bg-[#13202e] border-[#1a2b3d] text-[#e0e6f0]",
      
      // Status colors
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white",
      warning: "bg-yellow-600 text-white",
      info: "bg-blue-600 text-white",
    }
  },
  light: {
    name: "light",
    colors: {
      // Background gradients
      primary: "from-gray-50 to-white",
      secondary: "bg-white",
      tertiary: "bg-gray-50",
      
      // Borders
      border: "border-gray-200",
      borderAccent: "border-gray-300",
      
      // Text colors
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-600",
      textAccent: "text-blue-600",
      
      // Interactive elements
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      buttonSecondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
      input: "bg-white border-gray-300 text-gray-900",
      
      // Status colors
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white",
      warning: "bg-yellow-600 text-white",
      info: "bg-blue-600 text-white",
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  const theme = themes[currentTheme];

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem("theme", themeName);
    }
  };

  useEffect(() => {
    // Apply theme class to document root
    document.documentElement.className = currentTheme;
  }, [currentTheme]);

  const value = {
    currentTheme,
    theme,
    toggleTheme,
    setTheme,
    isDark: currentTheme === "dark",
    isLight: currentTheme === "light",
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
