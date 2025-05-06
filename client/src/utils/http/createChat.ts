import { Chat, ErrorFormat } from "../../types"
import env from "../../zod"

export interface CreateChatParams {
    workspaceId: number;
    chatName: string | null;
    recieverId?: number
    chatType: 'group' | 'one-one';
}

export default async function createChat({chatName, chatType, workspaceId, recieverId}: CreateChatParams) {
    const resp = await fetch(`${env.VITE_API_URL}/api/chat/${workspaceId}`, {
        method: "PUT",
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            chat: {
                name: chatName,
                type: chatType,
            },
            recieverId: recieverId,
        }),
        credentials: 'include',
    })

    if (!resp.ok) {
        throw await resp.json() as ErrorFormat
    }

    // refer to the workmate backend service return types for data structure
    const data = await resp.json()

    return data.data.chat as Chat;
}
