import { ChatMemberReturn, ErrorFormat } from "../types"
import env from "../zod"

export interface GetChatMembersParams {
    workspaceId: number;
    chatId: number;
}

export default async function getChatMembers({workspaceId, chatId}: GetChatMembersParams) {
    const resp = await fetch(`${env.VITE_API_URL}/api/chat/${workspaceId}/${chatId}/members`, {
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

    return data.data.members as ChatMemberReturn[];
}
