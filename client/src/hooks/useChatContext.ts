import { createContext, useContext } from "react";
import { Chat, ErrorFormat } from "../types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export interface ChatContextType {
    workspace: {
        id: number;
    };

    refetchChatList: (options?: RefetchOptions) => Promise<QueryObserverResult<Chat[], Error>>
    selectedChat: Chat | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
    setShowNewGroup: React.Dispatch<React.SetStateAction<boolean>>;
    setShowNewDirect: React.Dispatch<React.SetStateAction<boolean>>;
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
