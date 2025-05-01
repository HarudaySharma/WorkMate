import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { ErrorFormat } from '../../../types'
import createChat from '../../../utils/createChat'
import { useParams } from 'react-router-dom'
import useChatContext from '../../../hooks/useChatContext'

interface NewGroupChatProp {
    onClose: () => void
}

const NewGroupChat: React.FC<NewGroupChatProp> = ({ onClose }) => {
    const {setSelectedChat, refetchChatList} = useChatContext();

    const {workspaceId} = useParams()

    const [groupName, setGroupName] = useState('')

    const handleCreate = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if(!groupName.trim()) {
            toast.error("group name should be valid")
            return
        }
        if(!workspaceId) {
            toast.error("something's wrong, missing workspaceId")
            return;
        }

        try {
            const chat = await createChat({
                chatName: groupName,
                chatType: 'group',
                workspaceId: +workspaceId,
            })

            setSelectedChat(chat)
            refetchChatList()

            onClose()
        } catch(err) {
            toast.error((err as ErrorFormat).message)
        }

    }

    return (
        <div className='fixed inset-0  flex items-center justify-center z-50 '>
            <div className='bg-gray-50 rounded-2xl w-full max-w-2xl p-8 relative'>
            {/*<div className='bg-gray-50 rounded-2xl p-8 w-full max-w-md relative border border-gray-200'>*/}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-500 text-2xl'
                >
                    ×
                </button>
                <h2 className='text-2xl font-bold mb-4'>Create New Group Chat</h2>

                <input
                    type='text'
                    placeholder='Group Name'
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none
            focus:border-customBlue'
                />

                <button
                    onClick={handleCreate}
                    className='bg-customBlue text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer'
                >Done</button>
            </div>
        </div>
    )
}

export default NewGroupChat

