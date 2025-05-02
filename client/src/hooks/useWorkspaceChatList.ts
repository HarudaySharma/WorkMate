import env from "../zod"
import { Chat, ErrorFormat } from "../types"
import { useQuery } from "@tanstack/react-query"


export interface UseWorkpaceChatListParams {
    workspaceId: number
}

const useWorkspaceChatList = ({ workspaceId }: UseWorkpaceChatListParams) => {
    return useQuery({
        queryKey: ["workspace-chat-list", "-" + workspaceId],
        queryFn: async () => {
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
    })
}

export default useWorkspaceChatList
