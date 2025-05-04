import { SquarePen } from 'lucide-react'
import { useEffect, useState } from 'react'
import useWorkspaceChatList from '../../../hooks/useWorkspaceChatList';
import ChatList from './ChatList';
import { ChatContext, ChatContextType, ChatRecieverState } from '../../../hooks/useChatContext';
import Loader from '../../Loader';
import MessageArea from './MessageArea';
import { Chat as ChatType } from '../../../types';
import toast from 'react-hot-toast';
import NewDirectMessage from './NewDirectMessage';
import NewGroupChat from './NewGroupChat';
import { useSocket } from '../../../hooks/useSocket';
import useChatMembers from '../../../hooks/useChatMembers';

interface ChatProps {
    workspaceId: number;
}

const Chat = ({ workspaceId }: ChatProps) => {
    const [showNewGroup, setShowNewGroup] = useState(false);
    const [showNewDirect, setShowNewDirect] = useState(false);

    const { data: chats, refetch, isFetching, error } = useWorkspaceChatList({ workspaceId: workspaceId });
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
    const { data: selectedChatMembers } = useChatMembers({ chatId: selectedChat?.id, workspaceId })

    const [oneOneChatRecievers, setOneOneChatRecievers] = useState<ChatRecieverState>({}) // the direct message recievers whose already having a chat with the user

    const { socket, connected: socketConnected } = useSocket()

    const chatContextValue: ChatContextType = {
        workspace: {
            id: workspaceId,
        },
        oneOneChatRecievers,
        setOneOneChatRecievers,

        chats,
        refetchChatList: refetch,

        selectedChat,
        setSelectedChat,

        selectedChatMembers,

        setShowNewDirect,
        setShowNewGroup,

        socket,
        socketConnected,
    }

    if (error) {
        toast.error(error.message)
    }

    return (
        <ChatContext.Provider value={chatContextValue}>
            <div className='flex h-full'>
                {/* Left Side  */}
                <div className='w-64 bg-gray-50 border-r border-gray-200 flex flex-col'>
                    {/* New Channel or Chat button */}
                    <div className='p-2 border-b border-gray-200 flex justify-between items-center'>
                        <span
                            className='text-xl font-semibold'
                        >Chats
                        </span>

                        <button className='bg-customBlue text-white px-2 py-2 rounded-lg flex items-center
                justify-center hover:bg-blue-700 transition-colors'>
                            <SquarePen size={20} />
                        </button>
                    </div>

                    {/* Under Left Section */}
                    {isFetching && <Loader width='12' height='12' />}
                    <ChatList />

                </div>

                <MessageArea />

                {showNewGroup && <NewGroupChat onClose={() => setShowNewGroup(false)} />}
                {showNewDirect &&
                    <NewDirectMessage
                        onClose={() => setShowNewDirect(false)}
                    />}

            </div>
        </ChatContext.Provider>
    )
}

export default Chat
