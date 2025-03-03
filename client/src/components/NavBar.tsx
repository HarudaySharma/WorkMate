import React from 'react'
import logoWM from '../assets/logoWMnew-Photoroom.jpg'

const NavBar = () => {
  return (
    <>
    <nav className='flex items-center justify-between mx-24 py-3 font-nunito'>
      {/*left side of nav bar*/}
        <div className='flex items-center gap-2'>
          <img
          src={logoWM}
          alt='WorkMate Logo'
          className='h-10 w-auto'
          />
          <span className='text-3xl font-bold text-customBlack'>WorkMate</span>
        </div>


        {/* mid part of navBar*/}
        <div className='flex gap-9 mr-auto ml-12 py-2.5'>
          <button className='text-lg text-gray-700 font-semibold hover:text-white hover:font-medium hover:bg-customBlue px-3 py-0.5 rounded-md'>
            Log In
          </button>
          <span className='py-1'>/</span>
          <button className='text-lg text-gray-700 font-semibold hover:text-white hover:font-medium hover:bg-customYellow px-3 py-0.5 rounded-md'>
            Sign Up
          </button>
          <button className='text-lg text-gray-700 font-semibold hover:text-customBlack hover:font-bold'>
            About
          </button>
        </div>

        {/*right part of div*/}

        <div className=''>
          <button className='bg-customYellow px-12 py-2.5 font-semibold rounded-lg tracking-wide text-customBlack hover:font-bold font-nunito hover:bg-yellow-500'>
            CREATE WORKSPACE
          </button>
        </div>
    </nav>
    </>
  )
}

export default NavBar