import { ErrorFormat, WorkSpace } from "../types"
import env from "../zod"

export interface CreateWorkspaceParams {
    name: string;
    inviteLink: string;
}

async function createWorkSpace({ name, inviteLink }: CreateWorkspaceParams) {
    const resp = await fetch(`${env.VITE_API_URL}/api/workspace`, {
        method: "PUT",
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            inviteLink: inviteLink,
        }),
        credentials: 'include',
    })

    if (!resp.ok) {
        throw await resp.json() as ErrorFormat
    }

    // refer to the workmate backend service return types for data structure
    const data = await resp.json()

    return data.data.workspace as WorkSpace;
}

export default createWorkSpace;
