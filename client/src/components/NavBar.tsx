import React from 'react'
import logoWM from '../assets/logoWMnew-Photoroom.jpg'

const NavBar = () => {
  return (
    <>
    <nav className='flex items-center justify-between mx-20 py-3'>
      {/*left side of nav bar*/}
        <div className='flex items-center gap-2'>
          <img
          src={logoWM}
          alt='WorkMate Logo'
          className='h-10 w-auto'
          />
          <span className='text-xl font-nunito'>Work Mate</span>
        </div>


        {/* mid part of navBar*/}
        <div>
          <button>Log In</button>
          <button>Sign Up</button>
          <button>About</button>
        </div>

        {/*right part of div*/}

        <div>
          <button>CREATE WORKSPACE</button>
        </div>
    </nav>
    </>
  )
}

export default NavBar