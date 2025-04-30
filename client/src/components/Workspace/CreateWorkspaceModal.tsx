import { Copy, Link } from 'lucide-react';
import React, { use, useState } from 'react'

interface CreateWorkspaceModalProp {
    onClose: () => void;
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProp> = ({onClose}) => {

    const [step, setStep] = useState(1);
    const [workspaceName, setWorkspaceName] = useState('');
    const [inviteLink, setInviteLink] = useState('');


    const handleGenerateLink = () => {
        //irl it should make API call
        const uniqueId = Math.random().toString(36).substring(2, 15);
        setInviteLink(`https://workmate.com/invite/${uniqueId}`);
    }


    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        //you can add toast notification
    }

    const handleSubmit = () => {
        // Handle workspace creation and invitation logic here
        onClose();
        setStep(1); // Reset step for next time
        setWorkspaceName('');
        setInviteLink('');
    }
  return (
    <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'>
        <div className='bg-white rounded-2xl w-full max-w-2xl p-8 relative'>
            {/* Close button */}
            <button
            onClick={onClose}
            className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl'
            >
                ×
            </button>

            {/* for First Step */}
            {step === 1 ? (
                <>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-gray-800'>
                        What would you like to name your Workspace?
                    </h2>
                    <p className='text-gray-600 mt-2'>
                        Try the name of your company or organization.
                    </p>
                </div>

                <input
                type='text'
                placeholder='Enter Workspace Name'
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:border-customBlue'
                />

                <div className='mt-8 flex justify-end'>
                    <button
                    onClick={() => setStep(2)}
                    disabled={!workspaceName.trim()}
                    className='bg-customBlue text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                    transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
                    >
                        Next ˃
                    </button>
                </div>
                </>
            ) : (
                <>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-gray-800'>
                        Invite People to your Workspace
                    </h2>
                    <p className='text-gray-600 mt-2'>
                        Share the invite link with your team members.
                    </p>
                </div>

                <div className='space-y-4'>
                    <button
                    className='bg-customBlue text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                    transition-colors flex items-center justify-center gap-2 w-full'
                    onClick={handleGenerateLink}>
                        <Link size={20}/>
                        Generate Invite Link
                    </button>

                    {inviteLink && (
                        <div className='flex gap-2'>
                            <input
                            type='text'
                            value={inviteLink}
                            readOnly
                            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50'
                            />

                            <button
                            onClick={handleCopyLink}
                            className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 
                            transition-colors flex items-center gap-2'
                            >
                                <Copy size={18}/>
                                Copy
                            </button>
                        </div>
                    )}
                </div>

                <div className='mt-8 flex justify-end'>
                    <button
                    onClick={handleSubmit}
                    className='bg-customBlue text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                    transition-colors'
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
