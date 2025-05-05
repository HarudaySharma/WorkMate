import { Copy, MoreHorizontal, Shield, UserMinus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import useWorkspaceMembersList from '../../hooks/useWorkspaceMembersList';
import useAuth from '../../hooks/useAuth';
import useWorkspaceContext from '../../hooks/useWorkspaceContext';
import { ErrorFormat, WorkSpace, WorkspaceMember } from '../../types';
import Loader from '../Loader';
import toast from 'react-hot-toast';
import removeWorkspaceMember from '../../utils/removeWorkspaceMember';
import modifyWorkspaceMember from '../../utils/modifyWorkspaceMember';

const WorkSpaceInfo = () => {

    const { user } = useAuth();
    const {
        id: workspaceId,
        workspaceMembers,
        workspaceInfo,
        refetchWorkspaceMembers,
    } = useWorkspaceContext()

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

    const handleAssignAdmin = async (memberId: number) => {
        // Handle admin assignment logic
        console.log('Assign admin:', memberId);
        try {
            const ret = await modifyWorkspaceMember({
                workspaceId: workspaceId,
                member: {
                    user_id: memberId,
                    role: 'admin',
                }
            })

            toast.success(ret.message || "modified member role")
            refetchWorkspaceMembers();
        }
        catch (err) {
            toast.error((err as ErrorFormat).message)
        }
    }

    const handleRemoveMember = async (memberId: number) => {
        // Handle member removal logic
        console.log('Remove member:', memberId);
        try {
            const ret = await removeWorkspaceMember({
                memberId: memberId,
                workspaceId: workspaceId,
            })

            toast.success(ret.message || "removed member")
            refetchWorkspaceMembers();
        }
        catch (err) {
            toast.error((err as ErrorFormat).message)
        }
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
                                            className='p-1 hover:bg-gray-200 rounded-full hover:cursor-pointer'>
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
