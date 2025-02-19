import { createContext, useContext, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
   theme: Theme;
   setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
   theme: "dark",
   setTheme: (theme: Theme) => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
   const [theme, setTheme] = useState<Theme>("dark");

   return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
         {children}
      </ThemeContext.Provider>
   );
};
