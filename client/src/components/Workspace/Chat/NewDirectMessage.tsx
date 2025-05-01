import React, { useEffect, useState } from 'react'
import useChatContext from '../../../hooks/useChatContext';
import toast from 'react-hot-toast';
import createChat from '../../../utils/createChat';
import { Chat, ErrorFormat, WorkspaceMemberReturn } from '../../../types';
import useWorkspaceMembersList from '../../../hooks/useWorkspaceMembersList';
import Loader from '../../Loader';

interface NewDirectMessageProp {
    onClose: () => void;
    existingMemberChats: Chat[];
}

// mock members
const NewDirectMessage: React.FC<NewDirectMessageProp> = ({ onClose, existingMemberChats}) => {

    const { workspace: { id: workspaceId }, refetchChatList, setSelectedChat } = useChatContext()

    const { data: members, isFetching } = useWorkspaceMembersList({
        workspaceId,
    })

    const [shownMembers, setShownMembers] = useState<WorkspaceMemberReturn[]>([])


    // Temporary fix
    useEffect(() => {
        if (members) {
            const alreadyPresent = new Set();
            existingMemberChats.forEach(chat => alreadyPresent.add(chat.name))// chat name will be the recievers username
            setShownMembers(members.filter(mbr => alreadyPresent.has(mbr.username)))
        }
    }, [members])

    const handleSelect = async (member: WorkspaceMemberReturn) => {
        // add to direct messages
        if (!workspaceId) {
            toast.error("something's wrong, missing workspaceId")
            return;
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
        }
        onClose();
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
                    {shownMembers?.map((member) => (
                        <div
                            key={member.id}
                            onClick={() => handleSelect(member)}
                            className='flex items-center gap-4 p-2 rounded-lg border-none outline-2 outline-gray-200 hover:bg-gray-100 cursor-pointer'
                        >
                            <img src={member.profile_picture} alt={member.name || member.username} className='w-8 h-8 rounded-full' />
                            <span className='text-gray-700'>{member.username}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewDirectMessage
