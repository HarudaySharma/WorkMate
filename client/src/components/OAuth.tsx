import { useGoogleLogin } from '@react-oauth/google'
import env from '../zod';
import useAuth from '../hooks/useAuth';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../types';


const OAuth = () => {
    const { user, refetch } = useAuth();

    const loginGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            await sendToServer(response.access_token, "google")
            await refetch();
            console.log({ user })
        },
        onError: err => console.log(err),
        flow: 'implicit',
    })


    const loginFacebook = () => {
    }

    return (
        <>
            <button
                className='p-1.5 border border-gray-300 rounded-full hover:bg-gray-50 hover:cursor-pointer'
                onClick={(e) => {
                    e.preventDefault()
                    loginGoogle()
                }}
            >
                <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google'
                    className='w-6 h-6' />
            </button>

            <a
                className='p-1.5 border border-gray-300 rounded-full hover:bg-gray-50 hover:cursor-pointer'
                href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${env.VITE_GITHUB_REDIRECT_URI}`}
            >
                <img src='https://www.svgrepo.com/show/512317/github-142.svg' alt='GitHub'
                    className='w-6 h-6' />
            </a>

            <button
                className='p-1.5 border border-gray-300 rounded-full hover:bg-gray-50 hover:cursor-pointer'
                onClick={(e) => {
                    e.preventDefault()
                    loginFacebook()
                }}
            >
                <img src='https://www.svgrepo.com/show/475647/facebook-color.svg' alt='Facebook'
                    className='w-6 h-6 rounded-xl' />
            </button>
        </>
    )
}

const Callback = () => {
    const { user, refetch } = useAuth()
    const navigate = useNavigate()
    const { provider } = useParams() as { provider: AuthProvider }

    const [text, setText] = useState("logging in....")
    const [searchParams] = useSearchParams()

    const code = searchParams.get("code")

    console.log({ provider, code })

    useEffect(() => {
        if (!code || !provider) {
            console.log("failed to login")
            return
        }

        sendToServer(code, provider)
            .then(() => {
                setText("login successfull, redirecting to home page");
                refetch()
                    .then(() => {
                        console.log({ user })
                        setTimeout(() => {
                            navigate("/")
                        }, 2000);
                    })
            })
            .catch((err) => {
                setText("failed to login, please try again");
                console.log(err)

                setTimeout(() => {
                    navigate("/login")
                }, 2000);
            })
    }, [])

    return (
        <div>{text}</div>
    )
}

async function sendToServer(code: string, provider: AuthProvider) {
    const res = await fetch(`${env.VITE_API_URL}/api/auth/oauth/${provider}?redirect_uri=${env.VITE_GITHUB_REDIRECT_URI}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code, })
    })

    if (res.ok) {
        console.log(await res.json())
    }
}


OAuth.Callback = Callback;
export default OAuth
