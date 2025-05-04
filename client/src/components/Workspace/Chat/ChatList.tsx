import React, { useEffect } from 'react'
import { Chat, ChatMemberReturn, ErrorFormat } from '../../../types'
import { Plus } from 'lucide-react';
import useChatContext, { ChatRecieverState } from '../../../hooks/useChatContext';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import getChatMembers from '../../../utils/getChatMembers';

export interface ChatListParams {
    className?: string;
}

function ChatList({ className }: ChatListParams) {

    const { setShowNewGroup, setShowNewDirect } = useChatContext();

    return (
        <div className={` ${className}`}>
            {/* Group Section */}
            <div className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-sm font-semibold text-gray-500'>Group Chats</h3>
                    <button
                        onClick={() => setShowNewGroup(true)}
                        className='text-gray-400 hover:text-gray-600 cursor-pointer'>
                        <Plus size={16} />
                    </button>
                </div>

                {/* Groups List */}
                <GroupsList />

                {/* Direct Messages Section */}
                <div className='p-4 border-t border-gray-200'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-sm font-semibold text-gray-500'>Direct Messages</h3>
                        <button
                            onClick={() => setShowNewDirect(true)}
                            className='text-gray-400 hover:text-gray-600 cursor-pointer'>
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* DMs List */}
                    <OneOneChatList />
                </div>
            </div>
        </div >
    )
}

export default ChatList


export interface OneOneChatListParams {
    chats: Chat[]// chats with type as group
    setOneOneChatMembers: React.Dispatch<React.SetStateAction<ChatMemberReturn[]>>
    oneOneChatMembers: ChatMemberReturn[];
}

function OneOneChatList() {
    const {
        workspace: { id: workspaceId },
        setSelectedChat,
        chats,
        oneOneChatRecievers,
        setOneOneChatRecievers,
    } = useChatContext()

    const { user } = useAuth();
    const oneOneChats = chats?.filter(chat => chat.type === 'one-one');

    useEffect(() => {
        console.log("chats changed")
    }, [chats])

    // hook to fill the chat recievers state for all the DM's
    useEffect(() => {
        if (!oneOneChats || !user || !workspaceId) return;

        const fetchMembers = async () => {
            try {
                const results = await Promise.all(
                    oneOneChats.map(async (chat) => {
                        const mbrs = await getChatMembers({ chatId: chat.id, workspaceId: +workspaceId });

                        // if chat contains only one member that means it is the user personal chat
                        if (mbrs.length === 1) {
                            return mbrs[0] ? { chatId: chat.id, receiver: mbrs[0] } : null;
                        }

                        const receiver = mbrs.find(mbr => mbr.id !== user.id);
                        return receiver ? { chatId: chat.id, receiver } : null;
                    })
                );

                const newReceivers = results.reduce((acc, curr) => {
                    if (curr) {
                        const { chatId, receiver } = curr;
                        acc[chatId] = receiver;
                    }
                    return acc;
                }, {} as ChatRecieverState)

                setOneOneChatRecievers(prev => ({ ...prev, ...newReceivers }));
            } catch (err) {
                toast.error((err as ErrorFormat).message);
            }
        };

        fetchMembers();
    }, [chats, workspaceId, user]);

    if (!oneOneChats) {
        return <></>
    }

    return (
        <div className='space-y-2'>
            {oneOneChats.map((chat) => (
                <button
                    key={`${chat.id} + ${oneOneChatRecievers[chat.id]?.username}`}
                    onClick={() => setSelectedChat(chat)}
                    className='w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100
                            transition-colors flex items-center justify-between'
                >
                    <div className='flex items-center gap-2'>
                        <div className='relative'>
                            <img
                                src={oneOneChatRecievers[chat.id]?.profile_picture}
                                alt={oneOneChatRecievers[chat.id]?.username}
                                className='w-6 h-6 rounded-full'
                            />
                            {/*<div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                                        border-2 border-white
                                        ${dm.status === 'online' ? 'bg-green-500' : dm.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                                        */}
                        </div>

                        <span className='text-gray-700'> {oneOneChatRecievers[chat.id]?.name || oneOneChatRecievers[chat.id]?.username}
                            {oneOneChatRecievers[chat.id]?.username === user?.username && " (You)"}
                        </span>
                    </div>
                    {/*dm.unread > 0 && (
                        <span className='bg-customBlue text-white text-xs px-2 py-1 rounded-full'>
                            {dm.unread}
                        </span>
                    )*/}
                </button>
            ))}
        </div>
    )
}

// type GroupChat = Extract<Chat, { type: 'group' }>;
export interface GroupChatListParams {
    chats: Chat[] // chats with type as group
}

function GroupsList() {
    const { setSelectedChat: changeSelectedChat, chats } = useChatContext()

    const groupChats = chats?.filter(chat => chat.type === 'group')

    if (!groupChats) {
        return <></>
    }

    return (
        <div className='space-y-2'>
            {groupChats.map((chat) => (
                <button
                    key={chat.id + chat.name! /*there will always be a name of group chats*/}
                    onClick={() => changeSelectedChat(chat)}
                    className='w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors
                            flex items-center justify-between'
                >
                    <span className='text-gray-700'># {chat.name}</span>
                    {/*chat.unread > 0 && (
                        <span className='bg-customBlue text-white text-xs px-2 py-1 rounded-full'>
                            {chat.unread}
                        </span>
                    )*/}
                </button>
            ))}
        </div>
    )
}
