import { FiLogOut } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import useAuth from '../hooks/useAuth'
import { useState } from 'react';
import env from '../zod';

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
                    <div className='absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 mt-2 w-fit bg-white
                            shadow-lg z-50 py-2 px-6 flex flex-col gap-3 dark:bg-[#333333] rounded-lg'>

                        {/* User Info */}
                        <div className="flex flex-col text-center items-center gap-3">
                            <img
                                src={user.profilePicture}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="text-sm font-semibold dark:text-gray-200">{user.username}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center mt-3 mb-4">
                            <button
                                onClick={handleOnDelete}
                                className="text-red-500 hover:text-red-600 cursor-pointer"
                            >
                                <MdDelete className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleOnLogout}
                                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 cursor-pointer"
                            >
                                <FiLogOut className="w-5 h-5" />
                            </button>
                        </div>

                    </div>
                )}

            </div>
        </>
    )

}

export default UserProfile
