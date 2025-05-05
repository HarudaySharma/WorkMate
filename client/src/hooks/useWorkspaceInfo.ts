import env from "../zod"
import { ErrorFormat, WorkSpaceInfo } from "../types"
import { useQuery } from "@tanstack/react-query"


export interface UseWorkpaceInfoParams {
    workspaceId?: number
}

const useWorkspaceInfo = ({ workspaceId }: UseWorkpaceInfoParams) => {
    return useQuery({
        queryKey: ["workspace-info", workspaceId],
        queryFn: async () => {
            const resp = await fetch(`${env.VITE_API_URL}/api/workspace/${workspaceId}`, {
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

            return data.data.workspace as WorkSpaceInfo;
        },
        enabled: !!workspaceId,
    })
}

export default useWorkspaceInfo
