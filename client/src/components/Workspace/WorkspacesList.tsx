import { Plus } from 'lucide-react';
import React, { useEffect } from 'react'
import useAuth from '../../hooks/useAuth';
import useWorkspaceList from '../../hooks/useWorkspaceList';
import toast from 'react-hot-toast';
import Loader from '../Loader';

export type Workspace = {
    id: number;
    name: string;
    creator_id: number;
};

//Mock data
const workspaces: Workspace[] = [
    { id: 1, name: 'Personal Project', creator_id: 1 },
    { id: 2, name: 'Team Alpha', creator_id: 1 },
    { id: 3, name: 'Design Team', creator_id: 2 },
]

interface WorkspacesListProps {
    onClose: () => void
}

const WorkspacesList: React.FC<WorkspacesListProps> = ({ onClose }) => {


    const { user } = useAuth();
    const { data, error, isFetching } = useWorkspaceList()


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

            <div className='bg-white rounded-2xl w-full max-w-4xl p-8 relative'>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl'
                >
                    ×
                </button>

                {/* Header */}
                <div className='mb-8'>
                    <h2 className='text-3xl font-bold text-gray-800'>Your Workspaces</h2>
                    <p className='text-gray-600 mt-2'>Select Workspace or Create a new one</p>
                </div>


                {/* Loader */}
                {isFetching && <Loader className='self-center' height='12' width='12' />}

                {!isFetching && data && <>
                    {/* Workspace Grid */}
                    <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {/* Create New Workspace Card */}
                        <div className='border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col
                    items-center justify-center hover:border-customBlue transition-colors cursor-pointer'>

                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                <Plus size={32} className='text-gray-500' />
                            </div>
                            <h3 className='text-lg font-semibold text-gray-800'>Create New Workspace</h3>
                            <p className='text-gray-500 text-sm text-center mt-2'>Start a New Workspace for your team</p>
                        </div>

                        {/* Existing Workspaces */}
                        {data.map((workspace) => (
                            <div
                                key={workspace.id}
                                className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg
                        transition-shadow cursor-pointer'
                            >
                                <div className='flex items-center gap-4'>
                                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-customBlue
                                to-blue-400 flex items-center justify-center text-white text-2xl font-bold'>
                                        {workspace.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-800'>{workspace.name}</h3>
                                        <p className='text-gray-500 text-sm mt-1'>{user.id === workspace.creator_id ? 'Admin' : 'Member'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>}
            </div>

        </div>
    )
}

export default WorkspacesList;
