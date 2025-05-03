import { useState, useEffect, useRef } from "react";
import useChatContext from "../../../hooks/useChatContext";
import { Send } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { ChatMemberReturn, CreateMessageEventParams, GetMessagesEventParams, JoinChatEventParams, LeaveChatEventParams, MessageReturn } from "../../../types";
import JoinChatPopupButton from "./JoinChatButton";

export type chatMemberMapState = {
    [memberId: number]: ChatMemberReturn;
};

function MessageArea() {
    const { user } = useAuth();
    const {
        workspace: { id: workspaceId },
        oneOneChatRecievers,
        selectedChat,
        selectedChatMembers,
        socket,
        socketConnected,
    } = useChatContext()

    const [newMessage, setNewMessage] = useState('');

    const [messages, setMessages] = useState<MessageReturn[]>([])

    const hasJoinedRef = useRef(false)
    const [chatMembersMap, setChatMembersMap] = useState<chatMemberMapState>({})
    const [isChatMember, setIsChatMember] = useState(false)

    const bottomRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedChat || !socketConnected) {
            return
        }

        const createMessage = () => {
            console.log("creating a new message....")
            socket.emit("create-message", {
                "workspaceId": workspaceId,
                "chatId": selectedChat.id,
                message: {
                    type: 'text',
                    text: newMessage,
                },
            } as CreateMessageEventParams);

        }

        createMessage()
        setNewMessage("")
    };

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (!selectedChatMembers) {
            return;
        }

        // check if the user is the member of this chat
        console.log({ selectedChatMembers })
        if (selectedChatMembers?.find(mbr => mbr.id === user?.id)) {
            setIsChatMember(true)
        } else {
            setIsChatMember(false)
        }

        // create a map for ui
        const map: chatMemberMapState = {};
        selectedChatMembers.forEach(member => {
            map[member.id] = member;
        });
        setChatMembersMap(map);

    }, [selectedChatMembers])

    useEffect(() => {
        setMessages([])

        if (!socketConnected || !selectedChat || hasJoinedRef.current) {
            return
        }

        if (!isChatMember) {
            return
        }

        const handleChatMessages = (msgs: MessageReturn[]) => {
            console.log("chat messages: ", msgs);
            setMessages(msgs);
        };

        const handleNewMessage = (msg: MessageReturn) => {
            console.log("new message received", msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
        };

        // fetch messages
        const fetchMessages = () => {
            socket.emit("get-messages", {
                "workspaceId": workspaceId,
                "chatId": selectedChat.id,
                "offset": 0,
                "limit": 0,
            } as GetMessagesEventParams);
        }

        // join the chat room
        const joinChat = () => {
            console.log(`joining the chat: ${selectedChat.name}, id: ${selectedChat.id}`)
            socket.emit("join-chat", {
                "workspaceId": workspaceId,
                "chatId": selectedChat.id,
            } as JoinChatEventParams);

            hasJoinedRef.current = true;
            fetchMessages()
        }

        socket.on("chat-messages", handleChatMessages)
        socket.on("new-message", handleNewMessage)

        joinChat();

        return () => {
            // leave the chat room
            console.log("leaving chat room")
            socket.emit("leave-chat", {
                workspaceId: workspaceId,
                chatId: selectedChat.id,
            } as LeaveChatEventParams)

            hasJoinedRef.current = false;
            socket.off("chat-messages", handleChatMessages);
            socket.off("new-message", handleNewMessage);

        }

    }, [selectedChat, socketConnected, isChatMember])


    const onJoin = () => {
        setIsChatMember(true)
    }



    if (!selectedChat) {
        return <></>
    }


    return (

        < div className='flex flex-1 flex-col' >
            {/* Main Chat Area */}
            {/* the state here should be changed dynamically*/}

            {/* Chat header */}
            {selectedChat.type === 'group' ?
                < div className="h-16 border-b border-gray-200 px-6 flex items-center" >
                    <h2 className="text-xl font-semibold text-gray-800">{selectedChat.name}</h2>
                </div >
                :
                < div className="relative h-16 border-b border-gray-200 px-6 flex items-center" >
                    <img
                        src={oneOneChatRecievers[selectedChat.id]?.profile_picture}
                        alt={oneOneChatRecievers[selectedChat.id]?.username}
                        className='w-6 h-6 rounded-full'
                    />
                    <h2 className="text-xl font-semibold text-gray-800">
                        {oneOneChatRecievers[selectedChat.id]?.name || oneOneChatRecievers[selectedChat.id]?.username}
                        {user?.username === oneOneChatRecievers[selectedChat.id]?.name && " (You)"}
                    </h2>
                </div >
            }

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isChatMember ?
                    messages
                        .slice()
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // oldest to newest
                        .map((message) => (
                            <div
                                key={message.message_id}
                                className={`flex items-start gap-4 ${message.sender_id === user?.id ? 'flex-row-reverse' : ''}`}
                            >
                                <img
                                    src={message.sender_id !== user?.id ? chatMembersMap[message.sender_id]?.profile_picture : user.profile_picture}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className={`flex flex-col ${message.sender_id === user?.id ? 'items-end' : ''}`}>
                                    <div
                                        className={`px-4 py-2 rounded-lg max-w-xl ${message.sender_id === user?.id
                                            ? 'bg-customBlue text-white'
                                            : 'bg-gray-200'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                    <span className="text-sm text-gray-500 mt-1">
                                        {new Date(message.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    : (
                        <div className="flex justify-center items-center h-full">
                            <JoinChatPopupButton onJoin={onJoin}/>
                        </div>
                    )}
                <div ref={bottomRef} />
            </div>
            {/* Message Input */}
            {isChatMember && < form
                onSubmit={handleSendMessage}
                className='border-t border-gray-200 p-4 flex items-center gap-4'
            >
                <input
                    type='text'
                    placeholder='Message'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none
                focus:border-customBlue'
                />
                <button
                    type='submit'
                    className='bg-customYellow text-white p-2 rounded-lg hover:bg-blue-700 transition-colors'
                >
                    <Send size={20} />
                </button>
            </form >
            }
        </div >

    )
}

export default MessageArea
