import { useState } from "react"
import env from "../zod"

interface LoginData {
    name?: string,
    username: string,
    email: string,
    password: string,
}

const useSignUp = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")


    const login = async (data: LoginData) => {
        try {
            setIsLoading(true)
            const resp = await fetch(`${env.VITE_API_URL}/api/auth/signup`, {
                method: "POST",
                body: JSON.stringify(data)
            })

            const d = await resp.json()

            console.log(d)

            setIsLoading(false)
        } catch (err) {

            setIsLoading(false)
            setError(`${err}`);
        }
    }

    return { isLoading, error, login }
}

export default useSignUp
