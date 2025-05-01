import env from "../zod"
import { ErrorFormat, WorkspaceMemberReturn } from "../types"
import { useQuery } from "@tanstack/react-query"


export interface UseWorkpaceMembersListParams {
    workspaceId: number
}

const useWorkspaceMembersList = ({ workspaceId }: UseWorkpaceMembersListParams) => {
    return useQuery({
        queryKey: ["workspace-members-list", "-" + workspaceId],
        queryFn: async () => {
            const resp = await fetch(`${env.VITE_API_URL}/api/workspace/${workspaceId}/members`, {
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

            return data.data.members as WorkspaceMemberReturn[];
        }
    })
}

export default useWorkspaceMembersList
