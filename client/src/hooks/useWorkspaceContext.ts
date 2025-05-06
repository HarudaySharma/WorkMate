import { createContext, useContext } from "react";
import { WorkSpaceInfo, WorkspaceMemberReturn, WorkSpaceOmitInviteLink } from "../types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export interface WorkspaceContextType {
    id: number;

    workspaceMembers: WorkspaceMemberReturn[] | undefined;
    refetchWorkspaceMembers: (options?: RefetchOptions) => Promise<QueryObserverResult<WorkspaceMemberReturn[], Error>>

    refetchWorkspaceList: (options?: RefetchOptions) => Promise<QueryObserverResult<WorkSpaceOmitInviteLink[], Error>>

    workspaceInfo: WorkSpaceInfo | undefined;
 }

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null)

const useWorkspaceContext = () => {
    const context = useContext(WorkspaceContext)

    if (!context) {
        throw Error("accessing workspace context in a component not wrapped under WorkspaceContext")
    }

    return context;
}

export default useWorkspaceContext;
