export type User = {
    id: string, // (Primary Key)
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

type Chat = {
    id: string, // chat id
    type: 'group' | 'one-one',
    workspaceID: string // Foreign Key (WorkSpace.id)
    lastMessageAt: Date,
    participants: Member[]
}

type Message = {
    sender: string, // Foreign Key (User.id)
    reciever: string, // Foreign Key (User.id)
    chatID: string // Foreign Key (Chat.id)

    type: "text" | "image" | "audio",
    text: string,
    image: string, // url to the image
    audio: string, // url to the audio file
    createdAt: Date,
    // optional:
    // isDeleted: boolean
    // isUpdated: boolean
}

export type Member = {
    user_id: number, // Foreign Key (User.id)
    workspace_id: number, // Foreign Key (User.id)
    role: "admin" | "user",
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

