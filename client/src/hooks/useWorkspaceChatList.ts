import env from "../zod"
import { Chat } from "../types"
import { useQuery } from "@tanstack/react-query"


export interface UseWorkpaceChatListParams  {
    workspaceId: number
}

const useWorkspaceChatList = ({workspaceId}: UseWorkpaceChatListParams) => {
    return useQuery({
        queryKey: ["workspace-chat-list"],
        queryFn: async () => {
            const resp = await fetch(`${env.VITE_API_URL}/api/chat/${workspaceId}/all`, {
                method: "GET",
                credentials: "include",
            })

            return (await resp.json()).data.chats as Chat[];
        }
    })
}

export default useWorkspaceChatList
