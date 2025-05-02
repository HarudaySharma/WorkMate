import { useState } from "react";
import useChatContext from "../../../hooks/useChatContext";
import { Send } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'other';
    timestamp: string;
    avatar: string;
}

function MessageArea() {
    const {user} = useAuth();
    const { selectedChat, oneOneChatRecievers } = useChatContext()

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

    const [newMessage, setNewMessage] = useState('');

    //Mock data for Channels and Direct Messages
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            //Add Message Handling Logic Here
            setNewMessage('');
        }
    };


    if (!selectedChat) {
        return <></>;
    }

    return (

        < div className='flex flex-1 flex-col' >
            {/* Main Chat Area */}
            {/* the state here should be changed dynamically*/}

            {/* Chat header */}
            {selectedChat.type === 'group' ?
                < div className="h-16 border-b border-gray-200 px-6 flex items-center" >
                    <h2 className="text-xl font-semibold text-gray-800">{selectedChat.name}</h2>
                </div >
                :
                < div className="relative h-16 border-b border-gray-200 px-6 flex items-center" >
                    <img
                        src={oneOneChatRecievers[selectedChat.id]?.profile_picture}
                        alt={oneOneChatRecievers[selectedChat.id]?.username}
                        className='w-6 h-6 rounded-full'
                    />
                    <h2 className="text-xl font-semibold text-gray-800">
                        {oneOneChatRecievers[selectedChat.id]?.name || oneOneChatRecievers[selectedChat.id]?.username}
                        {user?.username === oneOneChatRecievers[selectedChat.id].name && " (You)"}
                    </h2>
                </div >
            }

            {/* Messages Area */}
            < div className='flex-1 overflow-y-auto p-6 space-y-6' >
                {
                    messages.map((message) => (
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
                    ))
                }
            </div >

            {/* Message Input */}
            < form
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
                    <Send size={20} />
                </button>
            </form >
        </div >

    )
}

export default MessageArea
