import { Member, User, WorkSpace } from "../database_schema";

type ERROR_TYPE = "USER_ERROR" | "INTERNAL_ERROR";

export class WorkmateError {
    type: ERROR_TYPE;
    error: Error | undefined;
    message: string;
    httpStatusCode: number | undefined;

    constructor(type: ERROR_TYPE, message: string, httpStatusCode?: number, error?: Error) {
        this.httpStatusCode = httpStatusCode;
        this.type = type;
        this.message = message;
        this.error = error;
    }
}

export class WorkmateReturnObj {
    success: boolean;
    message: string | undefined;

    constructor(success: boolean, message?: string) {
        this.success = success;
        this.message = message;
    }

}

// params
export interface CreateWorkspaceParams {
    name: string;
    creatorId: number;
    inviteLink: string;
}

export interface JoinWorkspaceParams {
    userId: number;
    inviteLink: string;
}

export interface DeleteWorkspaceParams {
    workspaceName: string;
    userId: number;
}

export interface GetUserWorkspacesParams {
    userId: number;
}

export interface GetWorkspaceInfoParams {
    userId: number;
    workspaceId: number;
}

export interface GetWorkspaceMembersParams {
    workspaceId: number;
}


// returns
export interface JoinWorkspaceRet extends WorkmateReturnObj {
    data: {
        workspace: WorkSpace;
    }
}

export interface GetWorkspaceRet extends WorkmateReturnObj {
    data: {
        workspace: WorkSpace | Omit<WorkSpace, 'invite_link'>;
    }
}

export interface GetUserWorkspacesRet extends WorkmateReturnObj {
    data: {
        workspaces: Omit<WorkSpace, 'invite_link'>[];
    }
}

export interface CreateWorkspaceRet extends WorkmateReturnObj {
    data: {
        workspace: WorkSpace;
    }
}

export interface DeleteWorkspaceRet extends WorkmateReturnObj {
}

export interface GetWorkspaceMembersRet extends WorkmateReturnObj {
    data: {
        members: (Pick<Member, "role"> & Pick<User, "username"| "name"| "email"| "profile_picture">) []
    }
}
