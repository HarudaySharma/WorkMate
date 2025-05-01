import { Copy, Link } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import getInviteLink from '../../utils/getInviteLink';
import { ErrorFormat } from '../../types';
import createWorkSpace from '../../utils/createWorkspace';

interface CreateWorkspaceModalProp {
    onClose: () => void;
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProp> = ({ onClose }) => {

    const [step, setStep] = useState(1);
    const [workspaceName, setWorkspaceName] = useState('');
    const [inviteLink, setInviteLink] = useState('');

    const handleGenerateLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        try {
            const inviteLink = await getInviteLink();
            setInviteLink(inviteLink);
        } catch (err) {
            toast.error((err as ErrorFormat).message)
        }
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        //you can add toast notification
        toast.success("copied")
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // Handle workspace creation and invitation logic here
        // create new workspace
        if (!workspaceName) {
            toast.error("please give name to your workspace")
            return
        }
        if (!inviteLink) {
            toast.error("please generate invite link")
            return;
        }

        try {
            const workspace = await createWorkSpace({
                name: workspaceName,
                inviteLink: inviteLink,
            })

            // Reset step for next time
            setStep(1);
            setWorkspaceName('');
            setInviteLink('');
            onClose();

            toast.success(`workspace: ${workspace.name} created`)

            // navigate to workspace pane for the specific workspace

        } catch (err) {
            toast.error((err as ErrorFormat).message)
        }

    }
    return (
        <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='bg-gray-50 rounded-2xl w-full max-w-2xl p-8 relative border border-gray-200
            dark:bg-[#242424]'>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl 
                    dark:text-gray-100 dark:hover:text-gray-400'
                >
                    ×
                </button>

                {/* for First Step */}
                {step === 1 ? (
                    <>
                        <div className='text-center mb-8'>
                            <h2 className='text-3xl font-bold text-gray-800 dark:text-gray-200'>
                                What would you like to name your Workspace?
                            </h2>
                            <p className='text-gray-600 mt-2 dark:text-gray-400 '>
                                Try the name of your company or organization.
                            </p>
                        </div>

                        <input
                            type='text'
                            placeholder='Enter Workspace Name'
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none
                focus:border-customBlue dark:focus:border-customYellow dark:text-gray-200'
                        />

                        <div className='mt-8 flex justify-end'>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!workspaceName.trim()}
                                className='bg-customBlue text-white px-6 py-2 rounded-lg hover:bg-blue-700
                    transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed 
                    dark:bg-customYellow dark:text-gray-700 dark:hover:bg-yellow-500'
                            >
                                Next ˃
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='text-center mb-8'>
                            <h2 className='text-3xl font-bold text-gray-800 dark:text-gray-200'>
                                Invite People to your Workspace
                            </h2>
                            <p className='text-gray-600 mt-2 dark:text-gray-400'>
                                Share the invite link with your team members.
                            </p>
                        </div>

                        <div className='space-y-4'>
                            <button
                                className='bg-customBlue text-white px-6 py-3 rounded-lg hover:bg-blue-700
                    transition-colors flex items-center justify-center gap-2 w-full
                    dark:bg-customYellow dark:text-gray-700 dark:hover:bg-yellow-500'
                                onClick={handleGenerateLink}>
                                <Link size={20} />
                                Generate Invite Link
                            </button>

                            {inviteLink && (
                                <div className='flex gap-2'>
                                    <input
                                        type='text'
                                        value={inviteLink}
                                        readOnly
                                        className='flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50
                                        dark:bg-gray-200'
                                    />

                                    <button
                                        onClick={handleCopyLink}
                                        className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50
                            transition-colors flex items-center gap-2 dark:text-gray-100 dark:hover:bg-[#242424] dark:hover:text-customYellow'
                                    >
                                        <Copy size={18} />
                                        Copy
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className='mt-8 flex justify-end'>
                            <button
                                onClick={handleSubmit}
                                className='bg-customBlue text-white px-6 py-2 rounded-lg hover:bg-blue-700
                    transition-colors dark:bg-customYellow dark:text-gray-700 dark:hover:bg-yellow-500'
                            >
                                Done
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CreateWorkspaceModal
