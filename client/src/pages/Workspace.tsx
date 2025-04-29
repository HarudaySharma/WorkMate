import React, { useEffect, useState } from 'react'
import logo from '../assets/logoWMnew-Photoroom.png'
import { Bolt, CalendarCheck2, Home, Info, LogOut, MessageCircleMore, Plus, Search, SunMoon, User, UserRoundPen } from 'lucide-react'

const Workspace = () => {

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isWorkspaceOpen, setIsWorkpaceOpen] = useState(false);

    // Mock workspace data - replace with actual data later
  const workspaces = [
    { id: 1, name: 'Personal Workspace', color: 'bg-purple-500' },
    { id: 2, name: 'Team Project', color: 'bg-green-500' },
  ];

  useEffect(() => {
    console.log({isWorkspaceOpen})
  }, [isWorkspaceOpen]
);

  return (
    <div className='h-screen flex pt-2'>
        {/* Left Sidebar */}
        <div className='w-16 bg-white flex flex-col items-center '>
            {/* Logo */}
            <div className='py-4'>
                <img 
                src={logo}
                alt='WorkMate'
                className='h-9 w-auto'/>
            </div>

            {/* User Workspace Switcher */}
            <div className='mt-8 relative'>
                <button
                onClick={() => { console.log('Workspace button clicked'); setIsWorkpaceOpen(!isWorkspaceOpen)}} 
                className='w-10 h-10 bg-customYellow rounded-lg flex items-center justify-center
                 text-white hover:bg-customBlue transition-colors'>
                    <User size={20}/>
                </button>

                {/* Workspace switcher domain */}
                {isWorkspaceOpen && (
                    <div className='absolute left-12 top-0 w-64 bg-white rounded-lg shadow-lg py-3 z-50'>
                        <div className='px-4 mb-2'>
                            <h3 className='text-sm font-semibold text-gray-700'>Your Workspaces</h3>
                        </div>

                        {/* Workspace List */}
                        <div className="max-h-64 overflow-y-auto">
                            {workspaces.map((workspace) =>(
                                <button
                                key={workspace.id}
                                className='w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3'>

                                    <div className={`w-8 h-8 ${workspace.color} rounded-lg flex items-center 
                                    justify-center text-white font-medium`}>
                                        {workspace.name[0]}
                                    </div>
                                    <span className='text-sm text-gray-700'>
                                        {workspace.name}
                                        </span>
                                </button>
                            ))}
                        </div>

                        {/* Create new Workspace option */}
                        <div className="px-2 mt-2 pt-2 border-t">
                            <button className="w-full px-3 py-2 text-left text-sm text-customBlue 
                            hover:bg-gray-50 rounded-md flex items-center gap-2">
                                <Plus size={18}/> 
                                <span>Create New Workspace</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <div className='flex flex-col space-y-6 mt-12'>

                <button className="w-10 h-10 rounded-lg flex items-center justify-center 
                text-gray-600 hover:bg-gray-100 transition-colors">
                    <Home size={24}/>
                </button>

                <button className="w-10 h-10 rounded-lg flex items-center justify-center 
                text-gray-600 hover:bg-gray-100 transition-colors">
                    <MessageCircleMore size={24}/>
                </button>

                <button className="w-10 h-10 rounded-lg flex items-center justify-center 
                text-gray-600 hover:bg-gray-100 transition-colors">
                    <CalendarCheck2 size={24}/>
                </button>

                <button className="w-10 h-10 rounded-lg flex items-center justify-center 
                text-gray-600 hover:bg-gray-100 transition-colors">
                    <Info size={24}/>
                </button>

                <button className="w-10 h-10 rounded-lg flex items-center justify-center 
                text-gray-600 hover:bg-gray-100 transition-colors mt-64">
                    <Bolt size={24}/>
                </button>
            </div>
        </div>

        {/* Miain Cntent Area */}
        <div className='flex-1'>
            {/* Top NAvigation Bar */}
            <div className='h-16 bg-white px-4 flex items-center justify-between'>
                {/* Title */}
                <span className='text-3xl font-semibold text-gray-800 -ml-3'>WorkMate</span>

                {/* Search Bar */}
                <div className='flex-1 max-w-2xl mx-8'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                        size={20}
                        />
                        <input
                        type='text'
                        placeholder='Search...'
                        className='w-full pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-customBlue'/>
                    </div>
                </div>

                {/* Create New Workspace Button */}
                <button className='bg-customBlue text-white px-4 py-2 rounded-lg flex items-center space-x-2
                hover:bg-blue-700 transition-colors'>
                    <Plus size={20}/>
                    <span>Create New Workspace</span>
                </button>

                {/* Profile button with dropdown */}
                <div className='relative'>
                    <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)} 
                    className='w-9 h-9 bg-customYellow rounded-lg flex items-center justify-center
                    text-white hover:bg-yellow-500 transition-colors'>
                        <User size={20}/>
                    </button>

                    {/* Drop Menu */}
                    {isProfileOpen && (
                        <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50'>
                            <button className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100
                            flex items-center gap-2'>
                                <UserRoundPen size={18}/>
                                <span>Profile</span>
                            </button>

                            <button className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100
                            flex items-center gap-2'>
                                <SunMoon size={18}/>
                                <span>Themes</span>
                            </button>

                            <div className='h-[1px] bg-gray-200 my-2'></div>

                            <button className='w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100
                            flex items-center gap-2'>
                                <LogOut size={18}/>
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Arear */}
            <div className='p-2'>
                <div className='bg-white rounded-lg h-[calc(100vh-4.5rem)] w-full border-1 border-gray-300 drop-shadow-lg'></div>
            </div>
        </div>
    </div>
  )
}

export default Workspace