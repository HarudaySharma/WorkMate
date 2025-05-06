import React, { } from 'react'
import useChatContext from '../../../hooks/useChatContext';
import toast from 'react-hot-toast';
import createChat from '../../../utils/http/createChat';
import { ErrorFormat, WorkspaceMemberReturn } from '../../../types';
import useWorkspaceMembersList from '../../../hooks/useWorkspaceMembersList';
import Loader from '../../Loader';
import useAuth from '../../../hooks/useAuth';

interface NewDirectMessageProp {
    onClose: () => void;
}

const NewDirectMessage: React.FC<NewDirectMessageProp> = ({ onClose }) => {
    const {
        workspace: { id: workspaceId },
        oneOneChatRecievers,
        chats,
        refetchChatList,
        setSelectedChat
    } = useChatContext()

    const { data: wkspcMembers, isFetching } = useWorkspaceMembersList({
        workspaceId,
    })

    const { user } = useAuth();

    // members will have id right ?
    const handleSelect = async (member: WorkspaceMemberReturn) => {
        // add to direct messages
        if (!chats) {
            toast.error("chat list is not there")
            return;
        }
        if (!workspaceId) {
            toast.error("something's wrong, missing workspaceId")
            return;
        }

        // check if the chat b/w the user and the workpace member they have selected is existing
        for (const chatId in oneOneChatRecievers) {
            const reciever = oneOneChatRecievers[chatId]
            if (reciever?.id === member.id) {
                const chat = chats.find(chat => chat?.id === +chatId)
                if (!chat) {
                    toast.error("chat exist already but not found in chats array")
                    return;
                }
                setSelectedChat(chat);
                onClose()
                return;
            }
        }

        try {
            const chat = await createChat({
                chatName: null,
                recieverId: member.id,
                chatType: 'one-one',
                workspaceId: +workspaceId,
            })

            setSelectedChat(chat)
            refetchChatList()
        } catch (err) {
            toast.error((err as ErrorFormat).message)
        } finally {
            onClose();
        }
    };

    return (
        <div className='fixed inset-0  flex items-center justify-center z-50'>
            <div className='bg-gray-50 rounded-2xl p-8 w-full max-w-lg relative border border-gray-200'>
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-500 text-2xl'
                >
                    ×
                </button>
                <h2 className='text-2xl font-bold mb-4'>New Direct Message</h2>
                <div className='space-y-4 max-h-80 overflow-y-auto'>
                    {isFetching && <Loader height={'12'} width={'12'} />}
                    {wkspcMembers?.map((mbr) => (
                        <div
                            key={`${mbr.id} + ${mbr.username}`}
                            onClick={() => handleSelect(mbr)}
                            className='flex items-center gap-4 p-2 rounded-lg border-none outline-2 outline-gray-200 hover:bg-gray-100 cursor-pointer'
                        >
                            <img src={mbr.profile_picture} alt={mbr.name || mbr.username} className='w-8 h-8 rounded-full' />
                            <span className='text-gray-700'>
                                {mbr.username}
                                {mbr.username === user?.username && " (You)"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewDirectMessage
