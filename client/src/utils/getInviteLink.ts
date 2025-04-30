import { ErrorFormat } from "../types"
import env from "../zod"

async function getInviteLink() {
    const resp = await fetch(`${env.VITE_API_URL}/api/workspace/inviteToken`, {
        method: "GET",
        credentials: 'include',
    })

    if (!resp.ok) {
        throw await resp.json() as ErrorFormat
    }

    const data = await resp.json() as {token: string}

    return data.token;
}

export default getInviteLink;
