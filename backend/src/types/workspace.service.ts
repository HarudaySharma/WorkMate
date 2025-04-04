import { WorkspaceMember, User, WorkSpace, Chat, Message } from "../database_schema";

type ERROR_TYPE = "USER_ERROR" | "INTERNAL_ERROR" | "DATA_INCONSISTENCY_ERROR" | "DATA_PERSISTENCE_ERROR";

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

export interface CreateChatParams {
    chat: Omit<Chat, "last_message_at" | "id">;
    userId: number;
}

export interface CreateMessageParams {
    chat: Pick<Chat, "workspace_id" | "id">;
    msg: Omit<Message, "created_at" | "is_deleted" | "message_id">;
    userId: number; // will be the sender id
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
    userId: number;
    workspaceId: number;
}

export interface GetWorkspaceChatsParams {
    userId: number;
    workspaceId: number;
}

export interface GetChatMessagesParams {
    userId: number;
    workspaceId: number;
    chatId: number,
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

export interface CreateChatRet extends WorkmateReturnObj {
    data: {
        chat: Chat;
        workspace: Pick<WorkSpace, "name" | "id">;
    }
}

export interface CreateMessageRet extends WorkmateReturnObj {
    data: {
        message: Omit<Message, "is_deleted">;
        chat: Pick<Chat, "workspace_id" | "id">;
        workspace: Pick<WorkSpace, "name" | "id">;
    }
}

export interface DeleteWorkspaceRet extends WorkmateReturnObj {
}

export interface GetWorkspaceMembersRet extends WorkmateReturnObj {
    data: {
        members: (Pick<WorkspaceMember, "role"> & Pick<User, "username" | "name" | "email" | "profile_picture">)[]
    }
}

export interface GetWorkspaceChatsRet extends WorkmateReturnObj {
    data: {
        workspace: Pick<WorkSpace, "id">;
        chats: Chat[];
    }
}

export interface GetChatMessagesRet extends WorkmateReturnObj {
    data: {
        workspace: Pick<WorkSpace, "id">;
        chat: Pick<Chat, "id">;// | "name" | "last_message_at">;
        messages: Message[];
    }
}
