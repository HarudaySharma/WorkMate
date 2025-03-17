import { RouterProvider } from "react-router-dom"
import router from "./routes"
import AuthProvider from "./components/AuthProvider"
import { ThemeProvider } from "./components/ThemeContext"

function App() {
    return (
        <>
            <ThemeProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </ThemeProvider>
        </>
    )
}

export default App
