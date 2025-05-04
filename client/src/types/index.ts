export interface ErrorFormat {
    message: string,
    statusCode: number,
}

export interface User {
    id: number
    name?: string,
    username: string,
    email: string,
    profile_picture: string,
}

export interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    email: string;
    email_verified: boolean;
    picture: string;
}

export type WorkSpace = {
    // each workspace is a container for all kinds of functionality
    id: number, // workSpace id
    name: string,
    creator_id: number,
    inviteLink: string;
    // members: Member[], // join requests should also be there.
    //    chats: string[] // Foreign Key (Chat.id)
    //    // multiple chats in one workspace (one-one or group chats)
}

export type Chat = {
    id: number, // chat id
    name: string | null, // type == group ? "group name" : "reciever name"
    type: 'group' | 'one-one',
    workspace_id: number // Foreign Key (WorkSpace.id)
    last_message_at: Date | null,
    // participants: ChatMember[], // chat members
}

export type ChatMember = {
    chat_id: number;
    user_id: number;
    joined_at: Date;
    role: 'admin' | 'member',
}

export type Message = {
    message_id: string, // UUID
    sender_id: number, // Foreign Key (User.id)
    chat_id: number // Foreign Key (Chat.id)

    type: "text" | "image" | "audio",
    text: string | null,
    image_url: string | null, // url to the image
    audio_url: string | null, // url to the audio file
    created_at: Date,
    is_deleted: 0 | 1;
    // optional:
    // isUpdated: boolean
}

export type TypicalReturnObj = {
    success: boolean;
    message: string | undefined;

}



export type MessageReturn = Omit<Message, "is_deleted">;

export interface ChatMemberReturn extends Pick<User, "name" | "username" | "email" | "profile_picture" | "id">, Pick<ChatMember, "role" | "joined_at"> { };


export type WorkspaceMember = {
    user_id: number, // Foreign Key (User.id)
    workspace_id: number, // Foreign Key (WorkSpace.id)
    role: 'admin' | 'member',
}

export interface WorkspaceMemberReturn extends Pick<WorkspaceMember, "role">, Pick<User, "id" | "username" | "name" | "email" | "profile_picture"> { }

export type WorkSpaceOmitInviteLink = Omit<WorkSpace, 'invite_link'>;

export type AuthProvider = "google" | "github" | "facebook";



// socket types
export interface GetMessagesEventParams {
    workspaceId: WorkSpace["id"];
    chatId: Chat["id"];
    offset: number;
    limit: number;
}

export interface CreateMessageEventParams {
    workspaceId: WorkSpace["id"];
    chat: Pick<Chat, "id" | "type">;
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

