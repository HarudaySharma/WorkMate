import React, { useEffect, useState } from 'react'
import { Chat, ChatMemberReturn, ErrorFormat } from '../../../types'
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import getChatMembers from '../../../utils/getChatMembers';
import useAuth from '../../../hooks/useAuth';
import useChatContext from '../../../hooks/useChatContext';

export interface ChatListParams {
    chats: Chat[],
}

function ChatList({ chats }: ChatListParams) {
    const { setShowNewGroup, setShowNewDirect } = useChatContext()

    const groupChats = chats.filter(chat => chat.type === 'group')
    const oneOneChats = chats.filter(chat => chat.type === 'one-one')

    return (
        <div>
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

                <GroupsList chats={groupChats} />

                {/* Channels List */}

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
                    <OneOneChatList chats={oneOneChats} />
                </div>
            </div>
        </div >
    )
}

export default ChatList


type OneOneChat = Extract<Chat, { type: 'one-one' }>;
export interface OneOneChatListParams {
    chats: Chat[]// chats with type as group
}

function OneOneChatList({ chats }: OneOneChatListParams) {
    const { workspace: { id: workspaceId, }, setSelectedChat: changeSelectedChat } = useChatContext()
    const { user } = useAuth()


    const chatReciever = new Map<number, ChatMemberReturn>()
    const [reload, setReload] = useState(false)

    useEffect(() => {
        console.log("reloading...")
    }, [reload])

    useEffect(() => {
        try {
            if (!workspaceId) {
                toast.error("something's wrong, workspaceId missing")
                return;
            }

            chats.forEach(async (chat) => {
                const mbrs = await getChatMembers({ chatId: chat.id, workspaceId: +workspaceId })
                console.log(mbrs)
                const reciever = mbrs.find(mbr => mbr.id !== user?.id);

                if (reciever) {
                    chatReciever.set(chat.id, reciever)
                    setReload(prev => !prev);
                }
            })
        } catch (err) {
            toast.error((err as ErrorFormat).message);
        }
        // get the chat members from server and show it to the user.
    }, [chats])


    return (
        <div className='space-y-2'>
            {chats.map((chat) => (
                <button
                    key={chat.id + chat.name}
                    onClick={() => changeSelectedChat(chat)}
                    className='w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100
                            transition-colors flex items-center justify-between'
                >
                    <div className='flex items-center gap-2'>
                        <div className='relative'>
                            <img
                                src={chatReciever.get(chat.id)?.profile_picture || ""}
                                alt={chat.name}
                                className='w-6 h-6 rounded-full'
                            />
                            {/*<div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                                        border-2 border-white
                                        ${dm.status === 'online' ? 'bg-green-500' : dm.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                                        */}
                        </div>
                        <span className='text-gray-700'>{chat.name}</span>
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

type GroupChat = Extract<Chat, { type: 'group' }>;
export interface GroupChatListParams {
    chats: Chat[] // chats with type as group
}

function GroupsList({ chats }: GroupChatListParams) {
    const {setSelectedChat: changeSelectedChat} = useChatContext()
    return (
        <div className='space-y-2'>
            {chats.map((chat) => (
                <button
                    key={chat.id + chat.name}
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
