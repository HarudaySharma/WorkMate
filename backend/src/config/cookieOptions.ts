import { CookieOptions } from "express"

export default function defaultCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2,// two hours
        secure: false,
        sameSite: 'lax',
    }
}
