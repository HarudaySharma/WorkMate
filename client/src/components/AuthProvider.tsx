import { ReactNode, useState, useEffect, useCallback } from "react"
import { ErrorFormat, User } from "../types"
import { AuthContext } from "../hooks/useAuth"
import env from "../zod"
import { GoogleOAuthProvider } from "@react-oauth/google"


const dummyUser: User = {
    name: "dev",
    email: "dev@mail.io",
    username: "dev",
    profilePicture: "https://avatars.githubusercontent.com/u/136163887?v=4",
}

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<ErrorFormat | null>(null)

    const fetchUserData = useCallback(async () => {
        const resp = await fetch(`${env.VITE_API_URL}/api/user/me`, {
            method: "GET",
            credentials: "include",
        })

        if (!resp.ok) {
            setUser(null)
            setError(await resp.json() as ErrorFormat)
            return
        }

        setError(null)
        setUser(await resp.json())
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [fetchUserData])

    return (
        <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={{ user, setUser, error, refetch: fetchUserData }}>
                {children}
            </AuthContext.Provider >
        </GoogleOAuthProvider>
    )

}

export default AuthProvider;
