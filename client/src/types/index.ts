export interface ErrorFormat {
    message: string,
    statusCode: number,
}

export interface User {
    id: number
    name?: string,
    username: string,
    email: string,
    profilePicture: string,
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

export type WorkSpaceOmitInviteLink = Omit<WorkSpace, 'invite_link'>

export type AuthProvider = "google" | "github" | "facebook";

