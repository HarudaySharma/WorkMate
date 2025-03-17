import React, { use, useEffect } from 'react'
import { MdLightMode, MdDarkMode } from "react-icons/md";
import useDarkMode from '../hooks/useDarkMode';


const DarkModetoggler = () => {
    const { darkMode, setDarkMode } = useDarkMode();

    return (
        <button onClick={() => setDarkMode(!darkMode)} className='px-6 py-2 rounded-md transition-all '>
            {darkMode ? <MdLightMode className='text-2xl text-gray-100' /> : <MdDarkMode className='text-2xl' />}
        </button>
    )
}

export default DarkModetoggler