import React from 'react'
import teamboost from '../../assets/boost productivity.png';

const Productivity = () => {
  return (
    <>
    <div className='py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 dark:bg-[#242424]'>
        <div className='max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 md:gap-24'>
          {/*Left side - ciruclar dashed image*/}
          <div className='flex-1 relative'>
            <div className='relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] mx-auto'>
              {/*Dashed circle*/}
              <div className='absolute inset-0 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500'></div>

              {/*Image - circular*/}
              <img
              src={teamboost}
              alt='teamboost'
              className='w-full h-full rounded-full object-cover'
              />

              {/*Decorative dots */}
              <div className='absolute top-0 right-12 w-6 h-6 bg-blue-400 rounded-full'></div>
              <div className='absolute top-1/3 -right-2 w-4 h-4 bg-pink-400 rounded-full'></div>
              <div className='absolute bottom-12 right-0 w-3 h-3 bg-green-400 rounded-full'></div>
              <div className='absolute bottom-1/4 -left-2 w-6 h-6 bg-orange-400 rounded-full'></div>
            </div>
          </div>

          {/*Right side  - text content*/}

          <div className='flex-1'>
            <h2 className='text-3xl md:text-5xl font-bold text-customBlack mb-6 dark:text-amber-50'>
              Boost Team Productivity
            </h2>
            <div className='h-1 w-24 bg-customYellow mb-8'></div>
              <p className='text-gray-600 text-lg leading-relaxed dark:text-gray-300'>
              Assign tasks, set deadlines, and track progress effortlessly. Our platform helps your team stay 
              organized, prioritize important work, and complete projects faster — all while maintaining clear 
              communication in one shared workspace.
              </p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Productivity