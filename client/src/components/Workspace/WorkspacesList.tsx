import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth';
import useWorkspaceList from '../../hooks/useWorkspaceList';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import { useNavigate } from 'react-router-dom';

interface WorkspacesListProps {
    onClose: () => void
}

const WorkspacesList: React.FC<WorkspacesListProps> = ({ onClose }) => {

    const navigate = useNavigate();
    const { user } = useAuth();
    const { data, error, isFetching } = useWorkspaceList()

    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)

    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
    }, [error])

    if (!user) {
        return <></>
    }

    return (
        <div className='fixed inset-0 backdrop-blur-md flex items-center justify-center z-50'>

            <div className='bg-white rounded-2xl w-full max-w-4xl p-8 relative dark:bg-[#242424]'>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl
                    dark:text-gray-200 dark:hover:text-gray-400 cursor-pointer'
                >
                    ×
                </button>

                {/* Header */}
                <div className='mb-8'>
                    <h2 className='text-3xl font-bold text-gray-800 dark:text-gray-200'>Your Workspaces</h2>
                    <p className='text-gray-600 mt-2 dark:text-gray-400'>Select Workspace or Create a new one</p>
                </div>


                {/* Loader */}
                {isFetching && <Loader className='self-center' height='12' width='12' />}

                {!isFetching && data && <>
                    {/* Workspace Grid */}
                    <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {/* Create New Workspace Card */}
                        <div
                            className='border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col
                    items-center justify-center hover:border-customBlue transition-colors cursor-pointer
                    dark:hover:border-customYellow'
                            onClick={() => setIsCreateWorkspaceOpen(true)}
                        >

                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                <Plus size={32} className='text-gray-500' />
                            </div>
                            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Create New Workspace</h3>
                            <p className='text-gray-500 text-sm text-center mt-2 dark:text-gray-400'>Start a New Workspace for your team</p>
                        </div>

                        {/* Existing Workspaces */}
                        {data.map((workspace) => (
                            <div
                                key={workspace.id}
                                onClick={() => navigate(`/workspace/${workspace.id}`)}
                                className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg
                        transition-shadow cursor-pointer dark:bg-[#242424] dark:hover:shadow-md dark:hover:shadow-customYellow '
                            >
                                <div className='flex items-center gap-4'>
                                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-customBlue
                                to-blue-400 flex items-center justify-center text-white text-2xl font-bold
                                dark:text-gray-100'>
                                        {workspace.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>{workspace.name}</h3>
                                        <p className='text-gray-500 text-sm mt-1 dark:text-gray-300'>{user.id === workspace.creator_id ? 'Admin' : 'Member'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>}
            </div>

            {isCreateWorkspaceOpen && (
                <CreateWorkspaceModal
                    onClose={() => setIsCreateWorkspaceOpen(false)} />
            )}
        </div>
    )
}

export default WorkspacesList;
