import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "white");

  useEffect(() => {
    document.body.style.backgroundColor = theme;
    document.body.style.color = theme === "black" ? "white" : "black";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = (color) => {
    setTheme(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
