import React, { useState } from 'react'
import logoWM from '../../assets/logoWMnew-Photoroom.png'
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import DarkModetoggler from '../DarkModetoggler';

const NavBar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scroll = (elementId: string) => {
        const el = document.getElementById(elementId)
        el?.scrollIntoView({ behavior: 'smooth', block: "start" })
    }


    return (
        <>
            <nav className='font-nunito relative bg-white dark:bg-[#1E1E1E]'>
                <div className='flex items-center justify-between px-4 sm:px-8 md:px-12 lg:mx-12 py-3'>
                    {/*left side of nav bar - logo and name always visible*/}
                    <div className='flex items-center gap-2'>
                        <img
                            src={logoWM}
                            alt='WorkMate Logo'
                            className='h-10 w-auto sm:h-10'
                        />
                        <span className='text-2xl sm:text-3xl font-bold text-customBlack dark:text-gray-100'>WorkMate</span>
                    </div>


                    {/* mid part of navBar - only visible on larger screen*/}
                    <div className='hidden md:flex gap-9 mr-auto ml-12 py-2.5'>
                        <NavLink
                            className='text-lg text-gray-700 font-semibold hover:text-white hover:font-medium
                             hover:bg-customBlue px-3 py-0.5 rounded-md dark:hover:bg-transparent dark:hover:border-customBlue
                             dark:hover:border-2 dark:text-gray-100 '
                            to={"/login"}
                        >
                            Log In
                        </NavLink>
                        <span className='py-1 dark:text-gray-100'>/</span>
                        <NavLink
                            className='text-lg text-gray-700 font-semibold hover:text-white hover:font-medium
                             hover:bg-customYellow px-3 py-0.5 rounded-md dark:hover:bg-transparent dark:hover:border-customYellow
                             dark:hover:border-2 dark:text-gray-100'
                            to={"/signup"}
                        >
                            Sign Up
                        </NavLink>
                        <button
                            className='text-lg text-gray-700 font-semibold hover:text-customBlack hover:font-bold
                            dark:hover:text-gray-400 dark:text-customYellow'
                            onClick={() => scroll("about")}
                        >
                            About
                        </button>
                    </div>

                    {/*Dark Mode Toggle button */}

                    <div>
                        <DarkModetoggler/>
                    </div>

                    {/*right part of div - only visible on larger screen*/}

                    <div className='hidden md:block'>
                        <button className='bg-customYellow px-8 lg:px-12 py-2.5 font-semibold rounded-lg 
                        tracking-wide text-customBlack hover:font-bold font-nunito hover:bg-yellow-500
                        dark:border-customYellow dark:border-2 dark:bg-customBlack dark:text-gray-100 dark:hover:text-gray-700'>
                            CREATE WORKSPACE
                        </button>
                    </div>

                    {/*hamburger menu button - only visible on smaller screen*/}

                    <button
                        className='md:hidden text-customBlack p-2 dark:text-amber-50'
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>


                {/*Mobile menu only visible when toggled on small screen*/}

                {isMenuOpen && (
                    <div className='md:hidden absolute w-full bg-white shadow-lg z-50 py-4 px-6 flex flex-col gap-4 dark:bg-[#333333]'>
                        <button
                            className='text-lg text-gray-700 font-semibold hover:text-white hover:bg-customBlue
                             py-2 px-4 rounded-md text-left dark:text-amber-50 dark:hover:bg-[#333333]
                              dark:hover:border-customBlue dark:hover:border-2'
                        >Log In</button>
                        <button
                            className='text-lg text-gray-700 font-semibold hover:text-white hover:bg-customYellow
                             py-2 px-4 rounded-md text-left dark:text-amber-50 dark:hover:bg-[#333333]
                              dark:hover:border-customYellow dark:hover:border-2'
                        >Sign Up</button>
                        <button
                            className='text-lg text-gray-700 font-semibold hover:text-white hover:bg-customBlue
                             py-2 px-4 rounded-md text-left dark:text-amber-50 dark:hover:bg-[#333333]
                              dark:hover:border-customBlue dark:hover:border-2'
                        >About</button>
                    </div>
                )}

            </nav>
        </>
    )
}

export default NavBar
