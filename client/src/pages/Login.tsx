import { useEffect, useState } from 'react'
import bg from '../assets/LoginBG.png';
import logoWM from '../assets/logoWMnew-Photoroom.png';
import { Eye, EyeOff } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, NavLink } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import useLogIn from '../hooks/useLogin';
import OAuth from '../components/OAuth';


interface IFormInput {
    username?: string;
    email?: string;
    password: string;
}

const Login = () => {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: {
        errors,
        isSubmitting,
    } } = useForm<IFormInput>();

    const { logIn, logInState, error } = useLogIn()
    const { refetch } = useAuth()

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        await logIn({
            username: data.username,
            email: data.email,
            password: data.password,
        })

    }

    useEffect(() => {
        if (logInState === "successfull") {
            refetch()
            //setTimeout(() => navigate("/user"), 2000)
        }
    }, [logInState, navigate, refetch])

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

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className='space-y-2 sm:space-y-3'>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="username@gmail.com"
                                    className="w-full px-3 py-1.5 border bg-white border-gray-300 rounded-lg
                                  focus:border-transparent"
                                    {...register("email", { required: "please enter valid email" })}
                                />
                                {errors.email &&
                                    <p className='block text-md text-red-600 mb-1 font-semibold'>
                                        {errors.email.message}
                                    </p>
                                }
                            </div>

                            <div className="relative mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full px-3 py-1.5 border bg-white border-gray-300 rounded-lg
                                  focus:border-transparent"
                                    {...register("password", {
                                        required: true,
                                        minLength: { value: 6, message: "password must be atleast 6 characters" }
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[52%] text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {errors.password &&
                                    <p className='block text-md text-red-600 mb-1 font-semibold'>
                                        {errors.password.message}
                                    </p>
                                }
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <a href="#" className="text-sm text-[#F25019] hover:text-customBlue">
                                    Forgot Password?
                                </a>
                            </div>


                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full bg-[#F25019] hover:bg-[#FF5722] text-white font-semibold
                          py-1.5 rounded-lg transition-colors mt-4 opacity-100 hover:cursor-pointer'
                            >
                                {isSubmitting ? "Submitting..." : "Log In"}
                            </button>

                            <div title="meta data">
                                {logInState === "successfull" &&
                                    <p
                                        className='text-green-500 font-semibold'
                                    >
                                        Logged In successfully
                                    </p>
                                }
                                {logInState === "un-successfull" &&
                                    <p
                                        className='text-red-500 font-semibold'
                                    >
                                        Failed to Login, Try Again!
                                    </p>
                                }
                                {error &&
                                    <p
                                        className='text-red-500 font-semibold'
                                    >
                                        Error: {error.message}
                                    </p>
                                }

                            </div>

                            <div className='text-center mt-3'>
                                <p className='text-sm text-gray-600'>Or Continue With</p>
                                <div className='flex justify-center gap-4 mt-3'>
                                    <OAuth />
                                </div>
                            </div>

                            {/* Register Link */}
                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <NavLink
                                        to={'/signup'}
                                        className="text-[#F25019] hover:text-customBlue font-medium">
                                        Register for free
                                    </NavLink>
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
