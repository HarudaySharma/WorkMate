import { Copy, MoreHorizontal, Shield, UserMinus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import useWorkspaceMembersList from '../../hooks/useWorkspaceMembersList';
import useAuth from '../../hooks/useAuth';
import useWorkspaceContext from '../../hooks/useWorkspaceContext';
import { WorkSpace, WorkspaceMember } from '../../types';
import Loader from '../Loader';
import toast from 'react-hot-toast';

interface Member {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Member';
    avatar: string;
}

// Mock data - in a real app this would come from your backend
const members: Member[] = [
    {
        id: 1,
        name: 'Harshit Thakur',
        email: 'harrythakur2102@gmail.com',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
        id: 2,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        role: 'Member',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100'
    }
];

const WorkSpaceInfo = () => {

    const { user } = useAuth();
    const { workspaceMembers, workspaceInfo } = useWorkspaceContext()

    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<WorkspaceMember['role']>('member')
    const [adminsCount, setAdminsCount] = useState<number>(0)

    const [inviteLink, setInviteLink] = useState("")


    useEffect(() => {
        if (!workspaceInfo) {
            return
        }

        setInviteLink((workspaceInfo as WorkSpace).invite_link || "")
    }, [workspaceInfo])

    useEffect(() => {
        if (!workspaceMembers || !user) {
            return
        }

        const currentUserMbrData = workspaceMembers.find(mbr => mbr.id === user.id)
        if (!currentUserMbrData) {
            toast.error("error getting user member data, logged in user is not a workpace member")
            return;
        }

        setCurrentUserRole(currentUserMbrData.role)
        setAdminsCount(workspaceMembers.filter(mbr => mbr.role === 'admin').length)

    }, [workspaceMembers, user])


    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        //will be better if we could add notification
        toast.success("copied")
    }

    const handleAssignAdmin = (memberId: number) => {
        // Handle admin assignment logic
        toast.error("functionality not added yet")
        console.log('Assign admin:', memberId);
    }

    const handleRemoveMember = (memberId: number) => {
        // Handle member removal logic
        toast.error("functionality not added yet")
        console.log('Remove member:', memberId);
    }

    return (
        <div className='p-6'>
            {/* Header Stats */}
            <div className='flex items-center gap-8 mb-8'>
                <div>
                    <h3 className='text-lg font-semibold text-gray-900'>Full Members ({workspaceMembers?.length})</h3>
                    <p className='text-sm text-gray-500'>Active Members in the Workspace</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Admins ({adminsCount} / {workspaceMembers?.length})</h3>
                    <p className='text-sm text-gray-500'>Wrokspace Administrators</p>
                </div>
            </div>
            {currentUserRole === 'admin' &&
                <div>
                    <h3 className='text-lg font-semibold text-gray-900'>
                        Invite Link: <span className='text-lg text-gray-500'>{inviteLink}</span>
                    </h3>
                </div>
            }

            {/* Members Table */}
            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        <tr className='border-b border-gray-200'>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">NAME</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">EMAIL</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ROLE</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">SETTINGS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!workspaceMembers && <Loader height='12' width='12' />}
                        {workspaceMembers?.map((member) => (
                            <tr
                                key={member.id}
                                className='border-b border-gray-100 hover:bg-gray-50'>
                                <td className='py-3 px-4'>
                                    <div className='flex items-center gap-3'>
                                        <img
                                            src={member.profile_picture}
                                            alt={member.username.charAt(0).toUpperCase()}
                                            className='w-8 h-8 rounded-full'
                                        />
                                        <span className='font-medium text-gray-900'>
                                            {member.username} {member.id === user?.id && "(You)"}
                                        </span>
                                    </div>
                                </td>

                                <td className='py-3 px-4 text-gray-600'>
                                    {member.email}
                                </td>

                                <td className='py-3 px-4'>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm
                                    ${member.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-200 text-gray-700'
                                        }`}>
                                        {member.role === 'admin' && <Shield size={14} />}
                                        {member.role}
                                    </span>
                                </td>

                                <td className='px-4 py-3'>
                                    <div className='relative inline-block'>
                                        <button
                                            onClick={() => setSelectedMemberId(selectedMemberId === member.id ? null : member.id)}
                                            className='p-1 hover:bg-gray-200 rounded-full'>
                                            <MoreHorizontal size={20} className='text-gray-500' />
                                        </button>

                                        {selectedMemberId === member.id && (
                                            <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200'>
                                                <button
                                                    onClick={() => handleCopyEmail(member.email)}
                                                    className='w-full px-4 py-2 text-left text-sm text-gray-700
                                            hover:bg-gray-50 flex items-center gap-2 cursor-pointer'
                                                >
                                                    <Copy size={16} />
                                                    Copy Email
                                                </button>

                                                {(currentUserRole === 'admin') && (member.role === 'member') && (
                                                    <button
                                                        onClick={() => handleAssignAdmin(member.id)}
                                                        className='w-full px-4 py-2 text-left text-sm text-gray-700
                                                hover:bg-gray-50 flex items-center gap-2 cursor-pointer'
                                                    >
                                                        <Shield size={16} />
                                                        Assign as Admin
                                                    </button>
                                                )}

                                                {(currentUserRole === 'admin') && member.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className='w-full px-4 py-2 text-left text-sm text-red-600
                                                hover:bg-gray-50 flex items-center gap-2 cursor-pointer'
                                                    >
                                                        <UserMinus size={16} />
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default WorkSpaceInfo
