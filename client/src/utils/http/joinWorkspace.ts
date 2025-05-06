import { ErrorFormat, WorkSpace } from "../../types"
import env from "../../zod"

export interface JoinWorkspaceParams {
    inviteLink: WorkSpace['invite_link'];
}

async function joinWorkspace({ inviteLink }: JoinWorkspaceParams) {
    const resp = await fetch(`${env.VITE_API_URL}/api/workspace/${inviteLink}/join`, { method: "PATCH",
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        credentials: 'include',
    })

    if (!resp.ok) {
        throw await resp.json() as ErrorFormat
    }

    // refer to the workmate backend service return types for data structure
    const data = await resp.json()

    return data.data.workspace as WorkSpace;
}

export default joinWorkspace;
