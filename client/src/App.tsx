import { RouterProvider } from "react-router-dom"
import router from "./routes"
import AuthProvider from "./components/AuthProvider"
import { ThemeProvider } from "./components/ThemeContext"
import { Toaster } from "react-hot-toast"

function App() {
    return (
        <>
            <ThemeProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                    <Toaster />
                </AuthProvider>
            </ThemeProvider>
        </>
    )
}

export default App
