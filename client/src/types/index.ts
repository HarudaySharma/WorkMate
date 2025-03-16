export interface ErrorFormat {
    message: string,
    statusCode: number,
}

export interface User {
    name?: string,
    username: string,
    email: string,
    profilePicture: string,
}

export interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    email: string;
    email_verified: boolean;
    picture: string;
}

export type AuthProvider = "google" | "github" | "facebook";
