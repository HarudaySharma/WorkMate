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
    name: string, // type == group ? "group name" : "reciever name"
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

export interface ChatMemberReturn extends Pick<User, "name" | "username" | "email" | "profile_picture" | "id">, Pick<ChatMember, "role" | "joined_at"> { };

export type WorkSpaceOmitInviteLink = Omit<WorkSpace, 'invite_link'>

export type AuthProvider = "google" | "github" | "facebook";

