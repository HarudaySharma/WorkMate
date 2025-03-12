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
