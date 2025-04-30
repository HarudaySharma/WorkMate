import env from "../zod"
import { WorkSpaceOmitInviteLink } from "../types"
import { useQuery } from "@tanstack/react-query"


const useWorkspaceList = () => {
    return useQuery({
        queryKey: ["workspace-list"],
        queryFn: async () => {
            const resp = await fetch(`${env.VITE_API_URL}/api/workspace/all`, {
                method: "GET",
                credentials: "include",
            })

            return (await resp.json()).data.workspaces as WorkSpaceOmitInviteLink[];
        }
    })
}

export default useWorkspaceList
