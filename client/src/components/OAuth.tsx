import { useGoogleLogin } from '@react-oauth/google'
import { GoogleUser } from '../types';
import env from '../zod';

const OAuth = () => {

    const sendToServer = async (user: GoogleUser, provider: "google" | "github" | "facebook") => {

        const res = await fetch(`${env.VITE_API_URL}/api/auth/oauth/${provider}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                email_verified: user.email_verified,
                profile_picture: user.picture,
            })
        })
        console.log(res)

        if (res.ok) {
            console.log(await res.json())
        }

    }

    const loginGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                    },
                })

                const data = await res.json() as GoogleUser;

                await sendToServer(data, "google")

            } catch (err) {
                console.log(err)
            }
        },
        onError: err => console.log(err),
        flow: 'implicit',
    })

    const loginGithub = () => {
    }

    const loginFacebook = () => {
    }

    return (
        <>
            <button
                className='p-1.5 border border-gray-300 rounded-full hover:bg-gray-50'
                onClick={() => loginGoogle()}
            >
                <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google'
                    className='w-6 h-6' />
            </button>

            <button
                className='p-1.5 border border-gray-300 rounded-full hover:bg-gray-50'
                onClick={() => loginGithub()}
            >
                <img src='https://www.svgrepo.com/show/512317/github-142.svg' alt='GitHub'
                    className='w-6 h-6' />
            </button>

            <button
                className='p-1.5 border border-gray-300 rounded-full hover:bg-gray-50'
                onClick={() => loginFacebook()}
            >
                <img src='https://www.svgrepo.com/show/475647/facebook-color.svg' alt='Facebook'
                    className='w-6 h-6 rounded-xl' />
            </button>
        </>
    )
}

export default OAuth

