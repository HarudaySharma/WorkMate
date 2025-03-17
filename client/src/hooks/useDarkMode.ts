import { createContext, Dispatch, useContext } from "react";

type ThemeContextType = {
    darkMode: boolean;
    setDarkMode: Dispatch<React.SetStateAction<boolean>>;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export default function useDarkMode() {
    const context = useContext(ThemeContext);

    if(!context) {
        throw Error("accessing theme information in a component not wrapped under ThemeProvider")
    }

    return context
}