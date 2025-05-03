import { ChatMember, ErrorFormat, TypicalReturnObj } from "../types"
import env from "../zod"

export interface JoinChatParams {
    workspaceId: number;
    chatId: number;
    role: ChatMember['role'];
}

export default async function joinChat({ workspaceId, chatId, role }: JoinChatParams) {
    try {
        const resp = await fetch(`${env.VITE_API_URL}/api/chat/${workspaceId}/${chatId}/join?role=${role}`, {
            method: "PATCH",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            },
            credentials: 'include',
        })

        if (!resp.ok) {
            throw await resp.json() as ErrorFormat
        }

        return await resp.json() as TypicalReturnObj
    }catch(err) {
        console.log(err)
        throw new Error("some error joining chat, check console")
    }
}
