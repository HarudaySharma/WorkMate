import { useState } from "react"
import env from "../zod"
import { ErrorFormat } from "../types"

interface LoginData {
    name?: string,
    username: string,
    email: string,
    password: string,
}


const useSignUp = () => {

    const [signInState, setSignInState] = useState<"successfull" | "un-successfull" | "not-initiated" | "initiated">("not-initiated")
    const [error, setError] = useState<ErrorFormat | null>(null)


    const signUp = async (data: LoginData) => {
        try {
            setSignInState("initiated")
            setError(null)

            const resp = await fetch(`${env.VITE_API_URL}/api/auth/signup`, {
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
                setSignInState("un-successfull")
                return
            }

            setError(null)
            setSignInState("successfull")

        } catch (err: unknown) {
            console.log({ err })

            setError({
                message: err.message || "unknown error",
                statusCode: err.statusCode || 500,
            })
            setSignInState("un-successfull")
        }

    }

    return { signInState, error, signUp }
}

export default useSignUp
