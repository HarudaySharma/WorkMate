import { useEffect, useState } from 'react'
import bg from '../assets/SignUp-bg.png';
import logoWM from '../assets/logoWMnew-Photoroom.png';
import { EyeOff, Eye } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import useSignUp from '../hooks/useSignUp';
import useAuth from '../hooks/useAuth';
import OAuth from '../components/OAuth';


interface IFormInput {
    username: string;
    name?: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Signup = () => {

    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: {
        errors,
        isSubmitting,
    } } = useForm<IFormInput>();

    const { signUp, signInState, error } = useSignUp()
    const { refetch } = useAuth()

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        await signUp({
            name: data.name,
            username: data.username,
            password: data.password,
            email: data.email,
        })

    }

    useEffect(() => {
        if (signInState === "successfull") {
            refetch()
            //setTimeout(() => navigate("/user"), 2000)
        }
    }, [signInState, navigate, refetch])

    return (
        <>
            <div className='min-h-screen w-full relative bg-[#E8E4B2] font-nunito px-4 sm:px-8 md:px-16 lg:px-32 dark:bg-[#333333]'>
                {/*Background Image*/}
                <img
                    src={bg}
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-contain md:pr-40 lg:pr-80"
                />

                {/* Content Wrapper with Background */}
                <div className="absolute inset-0 bg-[#E8E4B2] -z-10 dark:bg-[#333333]"></div>

                <div className='relative min-h-screen  flex items-center justify-end p-4 sm:pr-8 md:pr-12'>
                    <div className='w-full max-w-md  backdrop-filter backdrop-blur-lg  rounded-3xl shadow-2xl shadow-[#6b6a4e] p-4 sm:p-6 dark:bg-[#2c2b2b] dark:shadow-gray-700'>
                        {/*Logo*/}
                        <div className='flex justify-start mb-2 pt-3 sm:pt-5'>
                            <img src={logoWM} alt='logo' className='sm:h-6 md:h-10' />
                        </div>

                        {/*SignUp-from*/}

                        <h2 className='text-2xl sm:text-3xl font-bold text-left mb-4 sm:mb-6 dark:text-amber-50'>Sign Up</h2>

                        <form
                            className='space-y-2 sm:space-y-3'
                            onSubmit={handleSubmit(onSubmit)}
                        >

                            <div className=''>
                                <label className='block text-sm font-medium text-gray-700 mb-1 dark:text-amber-50'>Username</label>
                                <input
                                    type='text'
                                    placeholder='username'
                                    className='w-full px-3 py-1.5 border border-gray-300 rounded-sm
                                focus:border-customBlue bg-white opacity-100 dark:bg-gray-300'

                                    {...register("username", { required: true })}
                                />
                                {errors.username &&
                                    <p className='block text-md text-red-600 mb-1 font-semibold'>
                                        username is required
                                    </p>
                                }
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-amber-50">Name</label>
                                <input
                                    type="text"
                                    placeholder="name"
                                    className="w-full px-3 py-1.5 border bg-white border-gray-300 rounded-sm
                                  focus:border-transparent dark:bg-gray-300"

                                    {...register("name", { required: false })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-amber-50">Email</label>
                                <input
                                    type="email"
                                    placeholder="username@gmail.com"
                                    className="w-full px-3 py-1.5 border bg-white border-gray-300 rounded-sm
                                  focus:border-transparent dark:bg-gray-300"
                                    {...register("email", { required: "email is required" })}
                                />
                                {errors.email &&
                                    <p className='block text-md text-red-600 mb-1 font-semibold'>
                                        {errors.email.message}
                                    </p>
                                }
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-amber-50">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full px-3 py-1.5 border bg-white border-gray-300 rounded-sm
                                  focus:border-transparent dark:bg-gray-300"
                                    {...register("password", {
                                        required: "password is required",
                                        minLength: { value: 6, message: "password must be atleast 6 characters" },
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

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-amber-50">Confirm Password</label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm
                                  focus:border-transparent bg-white dark:bg-gray-300"

                                    {...register("confirmPassword", {
                                        required: "Confirm Password is required",
                                        validate: (val) => (
                                            val === watch("password") || "password does not match"
                                        ),
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-[52%] text-gray-500"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {errors.confirmPassword &&
                                    <p className='block text-md text-red-600 mb-1 font-semibold'>
                                        {errors.confirmPassword.message}
                                    </p>
                                }
                            </div>


                            <button
                                type='submit'
                                className='w-full bg-[#F25019] hover:bg-[#FF5722] text-white font-semibold
                          py-1.5 rounded-2xl transition-colors mt-4 opacity-100 hover:cursor-pointer'
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Sign Up"}
                            </button>
                            <div title="meta data">
                                {signInState === "successfull" &&
                                    <p
                                        className='text-green-500 font-semibold'
                                    >
                                        Account created successfully
                                    </p>
                                }
                                {signInState === "un-successfull" &&
                                    <p
                                        className='text-red-500 font-semibold'
                                    >
                                        Failed to create account, Try Again!
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
                                <p className='text-sm text-gray-600 dark:text-gray-300'>Or Continue With</p>
                                <div className='flex justify-center gap-4 mt-3'>
                                    <OAuth/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
