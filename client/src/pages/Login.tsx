import React, { useState } from 'react'
import bg from '../assets/LoginBG.png';
import logoWM from '../assets/logoWMnew-Photoroom.png';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    
  return (
    <>
          <div className='min-h-screen w-full relative bg-[#B4BDED] font-nunito px-4 sm:px-8 md:px-16 lg:px-32'>
              {/*Background Image*/}
              <img
                  src={bg}
                  alt="Background"
                  className="absolute top-0 right-0 w-full h-full object-contain md:pl-40 lg:pl-80 lg:pt-0"
              />

              {/* Content Wrapper with Background */}
              <div className="absolute inset-0 bg-[#E8E4B2] -z-10"></div>

              <div className='relative min-h-screen  flex items-center justify-start p-4 sm:pr-8 md:pr-12'>
                  <div className='w-full max-w-md  backdrop-filter backdrop-blur-lg  rounded-3xl shadow-2xl shadow-[#6b6a4e] p-4 sm:p-6'>
                      {/*Logo*/}
                      <div className='flex justify-start mb-2 pt-3 sm:pt-5'>
                          <img src={logoWM} alt='logo' className='sm:h-6 md:h-10' />
                      </div>

                      {/*SignUp-from*/}

                      <h2 className='text-2xl sm:text-3xl font-bold text-left mb-4 sm:mb-6'>Login</h2>

                      <form className='space-y-2 sm:space-y-3'>

                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                  type="email"
                                  placeholder="username@gmail.com"
                                  className="w-full px-3 py-1.5 border bg-white border-gray-300 rounded-lg 
                                  focus:border-transparent"
                              />
                          </div>

                          <div className="relative mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                              <input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  className="w-full px-3 py-1.5 border bg-white border-gray-300 rounded-lg 
                                  focus:border-transparent"
                              />
                              <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-[52%] text-gray-500"
                              >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                          </div>

                          {/* Forgot Password Link */}
                          <div className="flex justify-end">
                              <a href="#" className="text-sm text-[#F25019] hover:text-customBlue">
                                  Forgot Password?
                              </a>
                          </div>


                          <button
                              type='submit'
                              className='w-full bg-[#F25019] hover:bg-[#FF5722] text-white font-semibold 
                          py-1.5 rounded-lg transition-colors mt-4 opacity-100'
                          >
                              Sign In
                          </button>

                          <div className='text-center mt-3'>
                              <p className='text-sm text-gray-600'>Or Continue With</p>
                              <div className='flex justify-center gap-4 mt-3'>
                                  <button className='p-1.5 border border-gray-300 rounded-full hover:bg-gray-50'>
                                      <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google'
                                          className='w-6 h-6' />
                                  </button>

                                  <button className='p-1.5 border border-gray-300 rounded-full hover:bg-gray-50'>
                                      <img src='https://www.svgrepo.com/show/512317/github-142.svg' alt='GitHub'
                                          className='w-6 h-6' />
                                  </button>

                                  <button className='p-1.5 border border-gray-300 rounded-full hover:bg-gray-50'>
                                      <img src='https://www.svgrepo.com/show/475647/facebook-color.svg' alt='Facebook'
                                          className='w-6 h-6 rounded-xl' />
                                  </button>
                              </div>
                          </div>

                           {/* Register Link */}
                           <div className="text-center mt-4">
                              <p className="text-sm text-gray-600">
                                  Don't have an account?{' '}
                                  <a href="#" className="text-[#F25019] hover:text-customBlue font-medium">
                                      Register for free
                                  </a>
                              </p>
                          </div>

                      </form>
                  </div>
              </div>
          </div>
    </>
  )
}

export default Login