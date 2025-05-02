import { WorkspaceMember, User, WorkSpace, Chat, Message, ChatMember } from "../database_schema";

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

// params

export interface CreateChatParams {
    chat: Omit<Chat, "last_message_at" | "id">;
    recieverId?: User["id"];
    userId: User["id"];
}

export interface LeaveChatParams {
    chat: Pick<Chat, "id" | "workspace_id">
    userId: User["id"];
}

export interface DeleteChatParams {
    chat: Pick<Chat, "id" | "workspace_id">
    userId: User["id"];
}

export interface CreateMessageParams {
    chat: Pick<Chat, "workspace_id" | "id">;
    msg: Omit<Message, "created_at" | "is_deleted" | "message_id" | "sender_id" | "chat_id">;
    userId: User["id"];
}


export interface CreateWorkspaceParams {
    name: WorkSpace["name"];
    creatorId: WorkSpace["creator_id"];
    inviteLink: WorkSpace["invite_link"];
}

export interface JoinWorkspaceParams {
    userId: User["id"];
    inviteLink: WorkSpace["invite_link"];
}

export interface DeleteWorkspaceParams {
    workspaceName: WorkSpace["name"];
    userId: User["id"];
}

export interface GetUserWorkspacesParams {
    userId: User["id"];
}

export interface GetWorkspaceInfoParams {
    userId: User["id"];
    workspaceId: WorkSpace["id"];
}

export interface GetWorkspaceMembersParams {
    userId: User["id"];
    workspaceId: WorkSpace["id"];
}

export interface GetWorkspaceChatsParams {
    userId: User["id"];
    workspaceId: WorkSpace["id"];
}

export interface GetChatMessagesParams {
    userId: User["id"];
    workspaceId: WorkSpace["id"];
    chatId: Chat["id"];
}

export interface DeleteChatMessageParams {
    userId: User["id"];
    messageId: Message["message_id"],
}

export interface JoinChatParams {
    userId: User["id"];
    workspaceId: WorkSpace["id"];
    chatId: Chat["id"];
    role: ChatMember["role"],
}

export interface GetChatMembersParams {
    userId: User["id"];
    workspaceId: WorkSpace["id"];
    chatId: Chat["id"];
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

export interface LeaveChatRet extends WorkmateReturnObj { }
export interface DeleteWorkspaceRet extends WorkmateReturnObj { }

export interface DeleteChatRet extends WorkmateReturnObj { }

export interface GetWorkspaceMembersRet extends WorkmateReturnObj {
    data: {
        members: (Pick<WorkspaceMember, "role"> & Pick<User, "id" | "username" | "name" | "email" | "profile_picture">)[]
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
        messages: Omit<Message, "is_deleted">[];
    }
}

export interface JoinChatRet extends WorkmateReturnObj { }

export interface ChatMemberReturn extends Pick<User, "name" | "username" | "email" | "profile_picture" | "id">, Pick<ChatMember, "role" | "joined_at"> { };
export interface GetChatMembersRet extends WorkmateReturnObj {
    data: {
        members: ChatMemberReturn[];
    }
}

export interface DeleteChatMessageRet extends WorkmateReturnObj { }


// SOCKETTTTTTTTTS

export interface GetMessagesEventParams {
    workspaceId: WorkSpace["id"];
    chatId: Chat["id"];
    offset: number;
    limit: number;
}

export interface CreateMessageEventParams {
    workspaceId: WorkSpace["id"];
    chatId: Chat["id"];
    message: Pick<Message, "type" | "text" | "image_url" | "audio_url">;
}

export interface JoinChatEventParams {
    workspaceId: WorkSpace["id"];
    chatId: Chat["id"];
}

export interface LeaveChatEventParams {
    workspaceId: WorkSpace["id"];
    chatId: Chat["id"];
}
