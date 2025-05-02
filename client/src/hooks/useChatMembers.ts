import env from "../zod"
import { ChatMemberReturn, ErrorFormat } from "../types"
import { useQuery } from "@tanstack/react-query"


export interface UseChatMembersParams {
    workspaceId: number | undefined;
    chatId: number | undefined;
    offset?: number
    limit?: number
}

const useChatMembers = ({ workspaceId, chatId }: UseChatMembersParams) => {
    return useQuery({
        queryKey: ["chat-members", chatId, workspaceId],
        queryFn: async () => {
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
        },
        enabled: !!chatId && !!workspaceId, // <-- don't run unless both are defined
    })
}

export default useChatMembers
