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

    const hasJoinedChatRoomRef = useRef(false)
    const [chatMembersMap, setChatMembersMap] = useState<chatMemberMapState>({})
    const [isChatMember, setIsChatMember] = useState(false)

    const bottomRef = useRef<HTMLDivElement>(null);


    // effect to always keep the latest message in view.
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // effect to have a map of chat members to access their data in jsx
    useEffect(() => {
        if (!selectedChatMembers) {
            return;
        }

        // check if the user is the member of this chat
        console.log({ selectedChatMembers })

        // create a map for ui
        const map: chatMemberMapState = {};
        selectedChatMembers.forEach(member => {
            map[member.id] = member;
        });
        setChatMembersMap(map);

    }, [selectedChatMembers])


    // effect to reset the neccessary states
    useEffect(() => {
        return () => {
            console.log("cleaning.....")
            setIsChatMember(false);
            setMessages([])
            hasJoinedChatRoomRef.current = false;
        }
    }, [selectedChat?.id]);

    // effect to emit socket events
    useEffect(() => {

        console.log("socket hook rendering....")
        console.log({ isChatMember, joinChatRoom: hasJoinedChatRoomRef.current, socketConnected })

        const hasJoined = hasJoinedChatRoomRef.current;

        // derive current member status directly
        let isMbr = false;

        // INFO: had to do this to get the latest (non-staled) value of isChatMember
        //  issues arises when the user selects a chat which they are not a member of
        setIsChatMember(prev => {
            isMbr = prev;
            return prev
        })

        const isActuallyMember = isMbr || selectedChatMembers?.some(m => m.id === user?.id);
        if (isActuallyMember) {
            setIsChatMember(true) // not adding isChatMember to this effect dependency array
            //
            // REASON: when if the isChatMember is false => it is set to true here and rest of the logic below is executed
            //  now but as the isChatMember state is changed it will cause this hook to re-render thus disrupting the below logic asynchronously
            //
            //  SEEN SCENARIO: user joins the chat and the fetchMessages fuction also get called but the messages are never recieved i.e the handleChatMessages is not invoked (cause the re-render initiated in middle of execution of the fetchMessages which de-registers the handleChatMessages in the cleanup function.
        }

        if (!socketConnected || !selectedChat || !isActuallyMember || hasJoined) {
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
            console.log("fetching messages...")
            socket.emit("get-messages", {
                workspaceId: workspaceId,
                chatId: selectedChat.id,
                offset: 0,
                limit: 0,
            } as GetMessagesEventParams);
        }

        // join the chat room
        const joinChatRoom = () => {
            if (!isActuallyMember) {
                console.warn("Attempted to join a chat room without being a member.");
                return;
            }

            console.log(`joining the chat: ${selectedChat.name}, id: ${selectedChat.id}`)
            socket.emit("join-chat", {
                "workspaceId": workspaceId,
                "chatId": selectedChat.id,
            } as JoinChatEventParams);

            hasJoinedChatRoomRef.current = true;
            fetchMessages()
        }

        socket.on("chat-messages", handleChatMessages)
        socket.on("new-message", handleNewMessage)

        joinChatRoom();

        return () => {
            // leave the chat room
            console.log(`leaving the chat room`)
            socket.emit("leave-chat", {
                workspaceId: workspaceId,
                chatId: selectedChat.id,
            } as LeaveChatEventParams)

            socket.off("chat-messages", handleChatMessages);
            socket.off("new-message", handleNewMessage);

        }

    }, [selectedChat, socketConnected, selectedChatMembers])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedChat || !socketConnected || !isChatMember) {
            return
        }

        const createMessage = () => {
            console.log("creating a new message....")
            socket.emit("create-message", {
                "workspaceId": workspaceId,
                chat: {
                    id: selectedChat.id,
                    type: selectedChat.type,
                },
                message: {
                    type: 'text',
                    text: newMessage,
                },
            } as CreateMessageEventParams);

        }

        createMessage()
        setNewMessage("")
    };

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
                        alt={oneOneChatRecievers[selectedChat.id]?.username.charAt(0).toUpperCase()}
                        className='w-6 h-6 rounded-full bg-amber-100 text-center m-2'
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
                            <JoinChatPopupButton onJoin={onJoin} />
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
