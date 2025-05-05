import { ErrorFormat, TypicalReturnObj, WorkSpace, WorkspaceMember } from "../types";
import env from "../zod";

export interface RemoveWorkspaceMemberParams {
    workspaceId: WorkSpace["id"];
    memberId: WorkspaceMember["user_id"];
}

export default async function removeWorkspaceMember({workspaceId, memberId}: RemoveWorkspaceMemberParams) {
    const resp = await fetch(`${env.VITE_API_URL}/api/workspace/${workspaceId}/member`, {
        method: "DELETE",
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            member: {
                id: memberId,
            }
        }),
        credentials: 'include',
    })

    if (!resp.ok) {
        throw await resp.json() as ErrorFormat
    }

    // refer to the workmate backend service return types for data structure
    return await resp.json() as TypicalReturnObj
}
