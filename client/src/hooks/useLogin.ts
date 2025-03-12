import { useState } from "react"
import env from "../zod"
import { ErrorFormat } from "../types"

interface LoginData {
    username?: string,
    email?: string,
    password: string,
}


const useLogIn = () => {

    const [logInState, setLogInState] = useState<"successfull" | "un-successfull" | "not-initiated" | "initiated">("not-initiated")
    const [error, setError] = useState<ErrorFormat | null>(null)


    const logIn = async (data: LoginData) => {
        try {
            setLogInState("initiated")
            setError(null)

            const resp = await fetch(`${env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })

            if (!resp.ok) {
                const { message, statusCode } = await resp.json() as ErrorFormat

                setError({
                    message,
                    statusCode,
                })
                setLogInState("un-successfull")
                return
            }

            setError(null)
            setLogInState("successfull")

        } catch (err: unknown) {
            console.log({ err })

            setError({
                message: err.message || "unknown error",
                statusCode: err.statusCode || 500,
            })
            setLogInState("un-successfull")
        }

    }

    return { logInState, error, logIn }
}

export default useLogIn
