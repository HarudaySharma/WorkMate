import { ErrorFormat, TypicalReturnObj, WorkSpace, WorkspaceMember } from "../../types";
import env from "../../zod";

export interface ModifyWorkspaceMemberParams {
    workspaceId: WorkSpace["id"];
    member: Pick<WorkspaceMember, "user_id" | "role">;
}

export default async function modifyWorkspaceMember({workspaceId, member}: ModifyWorkspaceMemberParams) {
    const resp = await fetch(`${env.VITE_API_URL}/api/workspace/${workspaceId}/modify/member`, {
        method: "PATCH",
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            member,
        }),
        credentials: 'include',
    })

    if (!resp.ok) {
        throw await resp.json() as ErrorFormat
    }

    // refer to the workmate backend service return types for data structure
    return await resp.json() as TypicalReturnObj
}
