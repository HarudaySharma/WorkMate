import { createContext, useContext } from "react";
import { Chat, ChatMemberReturn } from "../types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Socket } from "socket.io-client";

export type ChatRecieverState = {
    [chatId: number]: ChatMemberReturn;
};

export interface ChatContextType {
    workspace: {
        id: number;
    };
    chats: Chat[] | undefined;
    selectedChat: Chat | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;

    oneOneChatRecievers: ChatRecieverState;
    setOneOneChatRecievers: React.Dispatch<React.SetStateAction<ChatRecieverState>>;

    refetchChatList: (options?: RefetchOptions) => Promise<QueryObserverResult<Chat[], Error>>;

    setShowNewGroup: React.Dispatch<React.SetStateAction<boolean>>;
    setShowNewDirect: React.Dispatch<React.SetStateAction<boolean>>;

    socket: Socket;
    socketConnected: boolean;
}

export const ChatContext = createContext<ChatContextType | null>(null)

const useChatContext = () => {
    const context = useContext(ChatContext)

    if (!context) {
        throw Error("accessing user information in a component not wrapped under AuthProvider")
    }

    return context;
}

export default useChatContext;
