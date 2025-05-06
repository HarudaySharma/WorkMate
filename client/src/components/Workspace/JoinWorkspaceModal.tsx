import React, { useState } from 'react'
import { ErrorFormat, WorkSpace } from '../../types';
import toast from 'react-hot-toast';
import joinWorkspace from '../../utils/http/joinWorkspace';
import { useNavigate } from 'react-router-dom';
import useWorkspaceContext from '../../hooks/useWorkspaceContext';

interface JoinWorkspaceModalProp {
    onClose: () => void
}

const JoinWorkspaceModal: React.FC<JoinWorkspaceModalProp> = ({ onClose }) => {

    const navigate = useNavigate();
    const [inviteLink, setInviteLink] = useState<WorkSpace['invite_link']>('');
    const {refetchWorkspaceList} = useWorkspaceContext()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const workspace = await joinWorkspace({inviteLink});

            toast.success(`joined workspace: ${workspace.name}`)
            navigate(`/workspace/${workspace.id}`)
            refetchWorkspaceList();

            onClose();
        } catch (err) {
            toast.error((err as ErrorFormat).message)
        }

    }
    return (
        <div className='fixed inset-0 backdrop-blur-md flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl w-full max-w-md p-8 relative border border-gray-300
      dark:bg-[#242424] '>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer
        dark:text-gray-400'>
                    ×
                </button>

                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-gray-800 dark:text-gray-300'>Join a Workpsace</h2>
                    <p className='text-gray-600 mt-2 dark:text-gray-400'>Enter the invite Link to Join the workspace</p>
                </div>


                <form
                    onSubmit={handleSubmit}
                    className='space-y-4'
                >
                    <input
                        type='text'
                        value={inviteLink}
                        onChange={(e) => setInviteLink(e.target.value)}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-customBlue
          dark:text-gray-300 dark:focus:border-customYellow'
                    />
                    <button
                        type='submit'
                        disabled={!inviteLink.trim()}
                        className='w-full bg-customBlue text-white px-6 py-3 rounded-lg hover:bg-blue-700
          transition-colors hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed
          dark:bg-customYellow dark:hover:bg-yellow-500'>
                        Join Workspace
                    </button>
                </form>
            </div>
        </div>
    )
}

export default JoinWorkspaceModal


