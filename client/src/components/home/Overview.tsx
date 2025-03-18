import { MessagesSquare, SquareKanban, ClipboardCheck } from 'lucide-react'
import React from 'react'

const Overview = () => {
  return (
    <>
    <div className='py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 dark:bg-[#242424]'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-5xl font-semibold mb-12 text-center dark:text-amber-50'>
            Our <span className='text-customYellow'>Features</span>
          </h2>

          <div className='flex flex-col md:flex-row items-center gap-12 md:gap-24'>
            {/*Left side Circle Design*/}
            <div className='relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex-shrink-0'>
              {/*Outer Dashed Circle*/}
              <div className='absolute inset-0 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-200'></div>

              {/*Inner Dashed Circle*/}
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%]
              rounded-full border-2 border-dashed border-gray-400'></div>

              {/*Top Circle*/}
              <div className='absolute top-1 left-1/2 w-30 h-30 transform -translate-x-1/2 bg-[#3ADAD9] 
              rounded-full flex items-center justify-center'>
                <MessagesSquare className='w-12 h-12 text-white'/>
              </div>

              {/*Bottom-left Circle*/}
              <div className='absolute bottom-8 left-8 w-30 h-30 bg-customYellow 
              rounded-full flex items-center justify-center'>
                <SquareKanban className='w-12 h-12 text-white'/>
              </div>

              {/*Bottom-right Circle*/}
              <div className='absolute bottom-8 right-8 w-30 h-30 bg-[#FD9B79] 
              rounded-full flex items-center justify-center'>
                <ClipboardCheck className='w-12 h-12 text-white'/>
              </div>

              {/*Decorative dots*/}
              <div className='absolute top-1/4 right-1/4 w-6 h-6 bg-orange-500 rounded-full'></div>
              <div className='absolute top-1/3 left-1/4 w-8 h-8 bg-green-500 rounded-full'></div>
              <div className='absolute bottom-1/3 right-8 w-3 h-3 bg-blue-500 rounded-full'></div>
            </div>

            {/*Right Side Text Content*/}
            <div className='flex-1'>
              <h3 className='text-3xl md:text-4xl font-bold text-customBlack mb-6 dark:text-amber-50'>
                Manage Everything in one <span className='border-b-customYellow border-b-4'>workspace</span></h3>
              <p className='text-gray-600 text-lg leading-relaxed dark:text-gray-300'>
                Stay connected with real-time chat, collaborate seamlessly through easy file sharing, 
                and manage tasks effortlessly with an interactive Kanban board. 
                Plan efficiently using the meeting scheduler, and track team progress with powerful analytics & insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Overview