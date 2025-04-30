import { Plus, Send, SquarePen } from 'lucide-react'
import React, { useState } from 'react'
import NewGroupChat from './NewGroupChat';
import NewDirectMessage from './NewDirectMessage';

interface Channel {
    id: number;
    name: string;
    unread: number;
}

interface DirectMessage {
    id: number;
    name: string;
    avatar: string;
    unread: number;
    status: 'online' | 'offline' | 'away';
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'other';
    timestamp: string;
    avatar: string;
}

const Chat = () => {

    const [newMessage, setNewMessage] = useState('');
    const [showNewGroup, setShowNewGroup] = useState(false);
    const [showNewDirect, setShowNewDirect] = useState(false);

    //Mock data for Channels and Direct Messages
    const channels: Channel[] = [
        {id: 1, name: 'The Den', unread: 3},
        {id: 2, name: 'Project Work', unread: 0},
        {id: 1, name: 'General', unread: 1},
    ];

    const directMessages: DirectMessage[] = [
        {
            id: 1,
            name: 'Sarah Wilson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
            unread: 2,
            status: 'online'
        },
        {
            id: 2,
            name: 'Mike Johnson',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
            unread: 0,
            status: 'away'
        },
    ];

    const messages: Message[] = [
        {
            id: 1,
            text: "Hey team! How's the progress on the new feature?",
            sender: 'other',
            timestamp: '10:30 AM',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
        },
        {
            id: 2,
            text: "We're making good progress! The core functionality is almost complete.",
            sender: 'user',
            timestamp: '10:32 AM',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
        },
    ];


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(newMessage.trim())
        {
            //Add Message Handling Logic Here
            setNewMessage('');
        }
    };

  return (
    <div className='flex h-full'>
        {/* Left Side  */}
        <div className='w-64 bg-gray-50 border-r border-gray-200 flex flex-col'>
            {/* New Channel or Chat button */}
            <div className='p-2 border-b border-gray-200 flex justify-between items-center'>
                <span
                className='text-xl font-semibold'
                >Chats
                </span>

                <button className='bg-customBlue text-white px-2 py-2 rounded-lg flex items-center
                justify-center hover:bg-blue-700 transition-colors'>
                    <SquarePen size={20}/>
                </button>
            </div>

            {/* Under Left Section */}
            <div>
                {/* Channel Section */}
                <div className='p-4'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-sm font-semibold text-gray-500'>Group Chats</h3>
                        <button
                        onClick={() => setShowNewGroup(true)}
                        className='text-gray-400 hover:text-gray-600'>
                            <Plus size={16}/>
                        </button>
                    </div>

                    {/* Channels List */}
                    <div className='space-y-2'>
                        {channels.map((channel)=>(
                            <button
                            key={channel.id}
                            className='w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors
                            flex items-center justify-between'
                            >
                                <span className='text-gray-700'># {channel.name}</span>
                                {channel.unread > 0 && (
                                    <span className='bg-customBlue text-white text-xs px-2 py-1 rounded-full'>
                                        {channel.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Direct Messages Section */}
                <div className='p-4 border-t border-gray-200'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-sm font-semibold text-gray-500'>Direct Messages</h3>
                        <button
                        onClick={() => setShowNewDirect(true)} 
                        className='text-gray-400 hover:text-gray-500'>
                            <Plus size={16}/>
                        </button>
                    </div>

                    {/* DMs List */}
                    <div className='space-y-2'>
                        {directMessages.map((dm) => (
                            <button
                            key={dm.id}
                            className='w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100
                            transition-colors flex items-center justify-between'
                            >
                                <div className='flex items-center gap-2'>
                                    <div className='relative'>
                                        <img
                                        src={dm.avatar}
                                        alt={dm.name}
                                        className='w-6 h-6 rounded-full'
                                        />
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                                        border-2 border-white
                                        ${dm.status === 'online' ? 'bg-green-500' : dm.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`}/>
                                    </div>
                                    <span className='text-gray-700'>{dm.name}</span>
                                </div>
                                {dm.unread > 0 && (
                                    <span className='bg-customBlue text-white text-xs px-2 py-1 rounded-full'>
                                        {dm.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

        </div>

        {/* Main Chat Area */}

        <div className='flex flex-1 flex-col'>

            {/* Chat header */}
            <div className="h-16 border-b border-gray-200 px-6 flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800">The Den Group Chat</h2>
            </div>

            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto p-6 space-y-6'>
                {messages.map((message) => (
                    <div
                    key={message.id}
                    className={`flex items-start gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <img
                        src={message.avatar}
                        alt='Avatar'
                        className='w-10 h-10 rounded-full'
                        />

                        <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : ''}`}>
                            <div className={`px-4 py-2  rounded-lg max-w-xl ${message.sender === 'user'
                                ? 'bg-customBlue text-white'
                                : 'bg-gray-200'
                            }`}>
                                {message.text}
                            </div>
                            <span className='text-sm text-gray-500 mt-1'>{message.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <form
            onSubmit={handleSendMessage}
            className='border-t border-gray-200 p-4 flex items-center gap-4'
            >
                <input
                type='text'
                placeholder='Message'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none
                focus:border-customBlue'
                />
                <button
                type='submit'
                className='bg-customYellow text-white p-2 rounded-lg hover:bg-blue-700 transition-colors'
                >
                    <Send size={20}/>
                </button>
            </form>
        </div>

        {showNewGroup && <NewGroupChat onClose={() => setShowNewGroup(false)}/>}
        {showNewDirect && <NewDirectMessage onClose={() => setShowNewDirect(false)}/>}

    </div>
  )
}

export default Chat
