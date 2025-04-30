import React from 'react'

interface WorkspaceMember {
    id: number;
    name: string;
    avatar: string;
  }

  interface NewDirectMessageProp {
    onClose: () => void;
  }

  // mock members
const members: WorkspaceMember[] = [
    { id: 1, name: 'Alice', avatar: '/avatars/alice.png' },
    { id: 2, name: 'Bob', avatar: '/avatars/bob.png' },
  ];

const NewDirectMessage:React.FC<NewDirectMessageProp> = ({onClose}) => {

    const handleSelect = (member: WorkspaceMember) => {
        // add to direct messages
        onClose();
      };

  return (
    <div className='fixed inset-0 backdrop-blur-md flex items-center justify-center z-50'>
        <div className='bg-gray-50 rounded-2xl p-8 w-full max-w-lg relative border border-gray-200'>
            <button
            onClick={onClose}
            className='absolute top-4 right-4 text-gray-500 text-2xl'
            >
                ×
            </button>
            <h2 className='text-2xl font-bold mb-4'>New Direct Message</h2>
            <div className='space-y-4 max-h-80 overflow-y-auto'>
                {members.map((member) => (
                    <div
                    key={member.id}
                    onClick={() => handleSelect}
                    className='flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer'
                    >
                        <img src={member.avatar} alt={member.name} className='w-8 h-8 rounded-full'/>
                        <span className='text-gray-700'>{member.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default NewDirectMessage