import { FolderOutput, ListTodo, MessagesSquare } from "lucide-react";


const Features = () => {
  return (
    <>
    <div id="about" className='py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 mt-2 font-nunito'>
        <h2 className='text-center text-3xl md:text-5xl font-semibold mb-24 text-customBlack'>
          What you <span className='text-customYellow'>can do?</span>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-36 max-w-6xl mx-auto'>
          {/*Feature 1 - Real Time Chatting*/}

          <div className='flex flex-col items-center text-center'>

            <div className='bg-amber-300 h-20 w-20 rounded-3xl flex items-center justify-center mb-8'>
            <MessagesSquare size={52} className='text-white'/>
            </div>

            <h3 className='text-xl font-bold text-customBlack mb-6'>Real Time Chatting</h3>
            <p className='text-gray-600'>Communicate instantly with your team using our built-in chat feature, ensuring smooth collaboration.</p>
          </div>

          {/*Feature 2 - File Sharing*/}

          <div className='flex flex-col items-center text-center'>

            <div className='bg-customBlue h-20 w-20 rounded-3xl flex items-center justify-center mb-8'>
            <FolderOutput size={52} className='text-white' />
            </div>

            <h3 className='text-xl font-bold text-customBlack mb-6'>File Sharing</h3>
            <p className='text-gray-600'>Easily upload and share files with your team members for seamless document collaboration.</p>
          </div>

          {/*Feature 3 - Task Management*/}

          <div className='flex flex-col items-center text-center'>

            <div className='bg-amber-300 h-20 w-20 rounded-3xl flex items-center justify-center mb-8'>
            <ListTodo size={52} className='text-white'/>
            </div>

            <h3 className='text-xl font-bold text-customBlack mb-6'>Task Management</h3>

            <p className='text-gray-600'>Assign tasks, set deadlines, and monitor project progress to ensure everything stays on track.</p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Features
