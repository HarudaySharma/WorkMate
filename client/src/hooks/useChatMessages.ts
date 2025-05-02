import env from "../zod"
import { ErrorFormat, MessageReturn } from "../types"
import { useQuery } from "@tanstack/react-query"


export interface UseChatMessagesParams {
    workspaceId: number | undefined;
    chatId: number | undefined;
    offset?: number
    limit?: number
}

const useChatMessages = ({ workspaceId, chatId }: UseChatMessagesParams) => {
    return useQuery({
        queryKey: ["chat-messages", chatId, workspaceId],
        queryFn: async () => {
            const resp = await fetch(`${env.VITE_API_URL}/api/chat/${workspaceId}/${chatId}/messages`, {
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

            return data.data.messages as MessageReturn[];
        },
        enabled: !!chatId && !!workspaceId,
    })
}

export default useChatMessages
