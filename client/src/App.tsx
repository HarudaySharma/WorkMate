import { RouterProvider } from "react-router-dom"
import router from "./routes"
import AuthProvider from "./components/AuthProvider"
import { ThemeProvider } from "./components/ThemeContext"
import { Toaster } from "react-hot-toast"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <RouterProvider router={router} />
                        <Toaster />
                    </AuthProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </>
    )
}

export default App
