import React from 'react'

import illustration from '../../assets/business-illustration.png'

const Collaborate = () => {
  return (
    <>
    <div className='py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:32 bg-[#FAFAFF] dark:bg-[#333333]'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24'>
          {/*Left side - Text Content*/}
          <div className='flex-1'>
            <h2 className='text-3xl md:text-5xl font-bold text-customBlack mb-6 dark:text-amber-50'>
              Start Collaborating <span className='block mt-2'>Instantly</span>
            </h2>

            <div className='h-1 w-24 bg-customYellow mb-8 rounded '></div>

              <p className='text-gray-600 text-lg leading-relaxed dark:text-gray-300'>
              Get your team onboard in minutes with our easy-to-use platform. Set up your workspace, 
              assign tasks, and start real-time conversations effortlessly. Whether you're managing projects, 
              sharing files, or organizing workflows, our tool helps you collaborate efficiently—all in one place.
              </p>
          </div>

          {/*Right side - Image illustration*/}
          <div className='flex-1 relative'>
            <img
            src={illustration}
            alt='illustration'
            className='w-auto h-auto rounded-lg'
            />
            {/*Decorative Elements*/}
            <div className='absolute -top-1 -right-4 w-8 h-8 bg-customYellow rounded-full'></div>
            <div className='absolute -bottom-1 -left-4 w-4 h-4 bg-customBlue rounded-full'></div>
            <div className='absolute -top-4 w-6 h-6 bg-customBlue rounded-full'></div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Collaborate