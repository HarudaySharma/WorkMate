import { ErrorFormat, User } from "../types"
import env from "../zod"

async function getUserInfo() {
    const resp = await fetch(`${env.VITE_API_URL}/api/user/me`, {
        method: "GET",
    })

    if (!resp.ok) {
        throw await resp.json() as ErrorFormat
    }

    const data = await resp.json()

    return data as User;
}

export default getUserInfo;
