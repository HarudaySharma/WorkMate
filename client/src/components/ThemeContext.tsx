import { ReactNode, useEffect, useState } from "react";
import { ThemeContext } from "../hooks/useDarkMode";


export const ThemeProvider = ({children}: {children: ReactNode}) => {

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") == "dark"
    );

    useEffect(() => {
        if(darkMode)
        {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        else 
        {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode])

    return (
        <ThemeContext.Provider value={{darkMode, setDarkMode}}>
            {children}
        </ThemeContext.Provider>
    )
}