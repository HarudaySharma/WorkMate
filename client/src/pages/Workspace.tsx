import { useEffect, useState } from 'react'
import logo from '../assets/logoWMnew-Photoroom.png'
import { Bolt, CalendarCheck2, HomeIcon, Info, MessageCircleMore, Plus, Search, User } from 'lucide-react'
import Chat from '../components/Workspace/Chat/Chat';
import UserProfile from '../components/UserProfile';
import { useNavigate, useParams } from 'react-router-dom';
import CreateWorkspaceModal from '../components/Workspace/CreateWorkspaceModal';
import toast from 'react-hot-toast';
import WorkSpaceInfo from '../components/Workspace/WorkSpaceInfo';
import useWorkspaceList from '../hooks/useWorkspaceList';
import Loader from '../components/Loader';

const Workspace = () => {

    const { workspaceId } = useParams()

    const [isWorkspaceOpen, setIsWorkpaceOpen] = useState(false);
    const [activeTab, setIsActiveTab] = useState('home');
    const [newWorkSpace, setNewWorkSpace] = useState(false);

    const [startWkspcListFetching, setStartWkspcListFetching] = useState(false)
    const { data: workspaces, error, isFetching } = useWorkspaceList({ startFetching: startWkspcListFetching })

    const navigate = useNavigate();

    useEffect(() => {
        if (isWorkspaceOpen && !workspaces) {
            setStartWkspcListFetching(true)
        }
    }, [isWorkspaceOpen]);

    if (!workspaceId) {
        toast.error("something's wrong, workspaceId missing")
        return <></>
    }

    if (error) {
        toast.error(error.message)
    }

    const goToHome = () => {
        navigate('/');
    }

    return (
        <div className='h-screen flex pt-2 dark:bg-[#242424]'>
            {/* Left Sidebar */}
            <div className='w-16 bg-white flex flex-col items-center dark:bg-[#242424]'>
                {/* Logo */}
                <div
                    onClick={goToHome}
                    className='py-4 cursor-pointer'>
                    <img
                        src={logo}
                        alt='WorkMate'
                        className='h-9 w-auto' />
                </div>

                {/* User Workspace Switcher */}
                <div className='mt-8 relative'>
                    <button
                        onClick={() => { console.log('Workspace button clicked'); setIsWorkpaceOpen(!isWorkspaceOpen) }}
                        className='w-10 h-10 bg-customYellow rounded-lg flex items-center justify-center
                 text-white hover:bg-customBlue transition-colors'>
                        <User size={20} />
                    </button>

                    {/* Workspace switcher domain */}
                    {isWorkspaceOpen && (
                        <div className='absolute left-12 top-0 w-64 bg-white rounded-lg shadow-lg py-3 z-50'>
                            <div className='px-4 mb-2'>
                                <h3 className='text-sm font-semibold text-gray-700'>Your Workspaces</h3>
                            </div>

                            {/* Workspace List */}
                            <div className="max-h-64 overflow-y-auto">
                                {isFetching && <Loader width='8' height='8' />}
                                {workspaces?.map((workspace, idx) => (
                                    <button
                                        key={workspace.id}
                                        onClick={() => {
                                            setIsWorkpaceOpen(false)
                                            navigate(`/workspace/${workspace.id}`)
                                        }}
                                        className='w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3'>

                                <div className={`w-8 h-8 ${idx % 2 ? 'bg-purple-500' : 'bg-green-500'} rounded-lg flex items-center
                                    justify-center text-white font-medium`}>
                                    {workspace.name.charAt(0)}
                                </div>
                                <span className='text-sm text-gray-700'>
                                    {workspace.name}
                                </span>
                            </button>
                                ))}
                        </div>

                            {/* Create new Workspace option */}
                    <div className="px-2 mt-2 pt-2 border-t">
                        <button
                            onClick={() => setNewWorkSpace(true)}
                            className="w-full px-3 py-2 text-left text-sm text-customBlue
                              hover:bg-gray-50 rounded-md flex items-center gap-2">
                            <Plus size={18} />
                            <span>Create New Workspace</span>
                        </button>
                    </div>
                </div>
                    )}
            </div>

            {/* Navigation Items */}
            <div className='flex flex-col space-y-6 mt-12 '>

                <button
                    onClick={() => setIsActiveTab('home')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center
                text-gray-600 hover:bg-gray-100 transition-colors hover:text-customBlue
                dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-customYellow
                ${activeTab === 'home' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                    <HomeIcon size={24} />
                </button>

                <button
                    onClick={() => setIsActiveTab('chat')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center
                text-gray-600 hover:bg-gray-100 transition-colors hover:text-customBlue
                dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-customYellow
                ${activeTab === 'chat' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                    <MessageCircleMore size={24} />
                </button>

                <button
                    onClick={() => setIsActiveTab('calendar')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center
                text-gray-600 hover:bg-gray-100 transition-colors hover:text-customBlue
                dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-customYellow
                ${activeTab === 'calendar' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                    <CalendarCheck2 size={24} />
                </button>

                <button
                    onClick={() => setIsActiveTab('info')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center
                text-gray-600 hover:bg-gray-100 transition-colors hover:text-customBlue
                dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-customYellow
                ${activeTab === 'info' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                    <Info size={24} />
                </button>

                <button className={`w-10 h-10 rounded-lg flex items-center justify-center
                text-gray-600 hover:bg-gray-100 transition-colors mt-64
                dark:text-gray-300 dark:hover:bg-gray-500
                ${activeTab === 'settings' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>                        <Bolt size={24} />
                </button>
            </div>
        </div>

            {/* Main Cntent Area */ }
    <div className='flex-1 '>
        {/* Top Navigation Bar */}
        <div className='h-16 bg-white px-4 flex items-center justify-between dark:bg-[#242424]'>
            {/* Title */}
            <span
                onClick={goToHome}
                className='text-3xl font-semibold text-gray-800 -ml-3 cursor-pointer dark:text-gray-100'>WorkMate</span>

            {/* Search Bar */}
            <div className='flex-1 max-w-2xl mx-8'>
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-customBlue dark:text-customYellow'
                        size={20}
                    />
                    <input
                        type='text'
                        placeholder='Search...'
                        className='w-full pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-customBlue dark:text-gray-100 dark:focus:border-customYellow' />
                </div>
            </div>

            {/* Create New Workspace Button */}
            <button
                onClick={() => setNewWorkSpace(true)}
                className='bg-customBlue text-white px-4 py-2 rounded-lg flex items-center space-x-2
                  hover:bg-blue-700 transition-colors'>
                <Plus size={20} />
                <span>Create New Workspace</span>
            </button>

            {/* Profile button with dropdown */}
            <div className="text-center">
                <UserProfile />
            </div>
        </div>

        {/* Main Content Area */}
        <div className='px-2'>
            <div className='bg-white rounded-lg h-[calc(100vh-4.5rem)] w-full border-1
                border-gray-300 drop-shadow-lg'>
                {activeTab === 'chat' ? (
                    <Chat workspaceId={+workspaceId} />

                ) : activeTab === 'info' ? (
                    <WorkSpaceInfo />
                ) : (
                    <div className='flex items-center justify-center h-full text-gray-500 dark:text-gray-100'>
                        Select Tab to view content.
                    </div>
                )}
            </div>
        </div>
    </div>

    {
        newWorkSpace && (
            <CreateWorkspaceModal onClose={() => setNewWorkSpace(false)} />
        )
    }
        </div >
    )
}

export default Workspace
