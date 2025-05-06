import { Chat, ErrorFormat } from "../../types"
import env from "../../zod"

export interface GetWorkspaceChatsParams {
    workspaceId: number;
}

export default async function getWorkspaceChats({workspaceId}: GetWorkspaceChatsParams) {
    const resp = await fetch(`${env.VITE_API_URL}/api/chat/${workspaceId}/all`, {
        method: "GET",
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

    return data.data.chats as Chat[];
}
