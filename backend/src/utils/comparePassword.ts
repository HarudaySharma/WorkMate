import bcrypt from "bcrypt"

export default async function comparePassword(password: string, userSalt: string, hash: string) {
    try {
        return await bcrypt.compare(password + userSalt, hash)
    }
    catch(err) {
        throw err
    }
}
