import React from 'react'
import { PiHandWavingLight } from "react-icons/pi";


const Hero = () => {
  return (
    <>
          <div className='flex flex-col lg:flex-row relative overflow-hidden font-nunito'>
              {/*left side with content and color blue and half diagonal cut */}
              <div className='w-full lg:3/5 bg-customBlue text-white p-8 sm:p-16 md:p-24 lg:p-32 relative
              dark:bg-[#242424]'>

                  {/*gradient styling waves */}
                  <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-60 transform rotate-[-8deg]'></div>
                  <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-60 transform rotate-[-15deg]'></div>


                  <div className='max-w-lg relative z-10'>
                      <h2 className='text-xl sm:text-2xl md:text-3xl font-medium mb-6 sm:b-10 md:mb-20 flex items-center gap-2'>
                          Welcome to WorkMate<PiHandWavingLight />
                      </h2>

                      <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-10 md:mb-20'>
                          Work the way that works for you
                      </h1>

                      <p className='text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 md:mb-20 '>
                          Create, Build, Collaborate, Manage and make work efficient
                      </p>

                      <button className='bg-customYellow hover:bg-yellow-500 text-customBlack font-bold py-3 px-8 rounded-lg transition-colors'>
                          Get Started
                      </button>
                  </div>

                  {/*Diagonal cut effect - reversed direction*/}
                  <div className='hidden lg:block absolute top-0 right-0 h-full w-24 lg:w-48
                   bg-white transform translate-x-1/2 skew-x-[-14deg] dark:bg-[#242424]'></div>
              </div>
              {/*right side empty for now*/}
              <div className='hidden lg:block lg:w-2/5 bg-white dark:bg-[#242424]'></div>

          </div>
    </>
  )
}

export default Hero