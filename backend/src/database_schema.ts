export type User = {
    id: number, // (Primary Key)
    name: string,
    username: string // (unique)
    email: string, // (unique)
    hashed_password: string // (hashedPass)
    hash_salt: string,
    email_verified: boolean,// make email verified.
    profile_picture: string
    created_at: Date,
    updated_at: Date,
    // optional:
    // status: "online" | "offline"
}


export type WorkSpace = {
    // each workspace is a container for all kinds of functionality
    id: number, // workSpace id
    name: string,
    invite_link: string, // to let users join this particular workspace
    creator_id: number,
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

export type WorkspaceMember = {
    user_id: number, // Foreign Key (User.id)
    workspace_id: number, // Foreign Key (WorkSpace.id)
    role: 'admin' | 'member',
}


export type Message = {
    message_id: string, // UUID
    sender_id: number, // Foreign Key (User.id)
    chat_id: number // Foreign Key (Chat.id)

    type: "text" | "image" | "audio",
    text: string | null,
    image: string | null, // url to the image
    audio: string | null, // url to the audio file
    created_at: Date,
    is_deleted: boolean
    // optional:
    // isUpdated: boolean
}

export type MessageRecipient = {
    message_id: string, // UUID
    user_id: number, // Foreign Key (User.id)
    is_read: 0 | 1;
    read_at: Date | null,
}

type Kanban = { // Board
    lists: List[],
    visibility: "members" | "personal" | "anyone",
}

type List = {
    name: string,
    cards: Card[],
}

type Card = {
    name: string,
    description: string,
    deuDate: Date,
}

//your cards, lists, due dates, and more to keep you organized and on track.

