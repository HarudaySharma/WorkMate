import { createContext, useContext } from "react";
import { WorkSpaceInfo, WorkspaceMemberReturn } from "../types";

export interface WorkspaceContextType {
    id: number;
    workspaceMembers: WorkspaceMemberReturn[] | undefined;
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
