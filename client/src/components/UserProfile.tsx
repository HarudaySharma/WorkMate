import useAuth from '../hooks/useAuth'
import { useState } from 'react';
import env from '../zod';
import { LogOut, SunMoon, UserRoundPen } from 'lucide-react';


const UserProfile = () => {
    const { user, setUser } = useAuth();
    const [isUserOpen, setIsUserOpen] = useState(false);

    const toggleUser = () => {
        setIsUserOpen(!isUserOpen);
    }

    const handleOnDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const res = await fetch(`${env.VITE_API_URL}/api/user/delete`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                }
            })

            if (res.ok) {
                alert("user successfully deleted")
                setUser(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleOnLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const res = await fetch(`${env.VITE_API_URL}/api/user/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                }
            })

            if (res.ok) {
                alert("logout successfull")
                setUser(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (!user) {
        return (<></>)
    }

    return (
        <>
            {/*Profile Picture*/}

            {/*User menu displayed only when clicked*/}
            <div className='relative'>

                <div
                    className='md:pr-8 md:pl-3'
                    onClick={toggleUser}
                >
                    <img
                        src={user.profilePicture}
                        alt="User Avatar"
                        className='md:h-10 md:w-10 dark:text-gray-300 w-8 h-8 rounded-full hover:cursor-pointer'
                    />
                </div>


                {isUserOpen && (
                    <div className='absolute right-0.5 mt-2 w-fit bg-white dark:bg-gray-200 rounded-lg shadow-lg py-2 z-50 flex-col'>
                        {/* Will Open Profile Setting pop up */}
                        <button className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100
                            flex items-center gap-2'>
                            <UserRoundPen size={18} />
                            <span>Profile</span>
                        </button>

                        {/* User Info */}
                        <div className="flex flex-col text-center items-center gap-3">
                            <img
                                src={user.profilePicture}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="text-sm font-semibold dark:text-gray-400 mx-auto text-center w-full overflow-hidden">{user.username}</p>
                                <p className="text-xs text-gray-500 mx-auto w-full overflow-hidden dark:text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        {/*<div className="flex justify-between items-center mt-3 mb-4">
                            <button
                                onClick={handleOnDelete}
                                className="text-red-500 hover:text-red-600 cursor-pointer"
                            >
                                <MdDelete className="w-5 h-5" />
                            </button>
                        </div>*/}
                        <button className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100
                            flex items-center gap-2'>
                            <SunMoon size={18} />
                            <span>Themes</span>
                        </button>

                        <div className='h-[1px] bg-gray-200 my-2'></div>

                        <button
                            className='w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100
                            flex items-center gap-2'
                            onClick={handleOnLogout}
                        >
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    </div>
                )}
            </div>
        </>
    )

}

export default UserProfile
