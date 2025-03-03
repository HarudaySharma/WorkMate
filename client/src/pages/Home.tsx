import React from 'react'
import NavBar from '../components/NavBar'
import { PiHandWavingLight } from "react-icons/pi";

const Home = () => {
  return (
    <div className='font-nunito min-h-screen bg-white'>
      <NavBar />
      <div className='flex relative overflow-hidden'>
        {/*left side with content and color blue and half diagonal cut */}
        <div className='w-full lg:3/5 bg-customBlue text-white p-32 relative pl-24'>
          <div className='max-w-lg relative z-10'>
            <h2 className='text-3xl font-medium -mt-18 mb-20'>
              Welcome to WorkMate<PiHandWavingLight />
            </h2>

            <h1 className='text-5xl font-extrabold mt-10 mb-20'>
              Work the way that works for you
            </h1>

            <p className='text-2xl mb-20 '>
              Create, Build, Collaborate, Manage and make work efficient
            </p>

            <button className='bg-customYellow hover:bg-yellow-500 text-customBlack font-bold py-3 px-8 rounded-lg transition-colors'>
              Get Started
            </button>
          </div>

          {/*Diagonal cut effect - reversed direction*/}
          <div className='absolute top-0 right-0 h-full w-24 lg:w-48 bg-white transform translate-x-1/2 skew-x-[-15deg]'></div>
        </div>
        {/*right side empty for now*/}
        <div className='lg:block lg:w-2/5 bg-white'></div>

      </div>  
    </div>
  )
}

export default Home