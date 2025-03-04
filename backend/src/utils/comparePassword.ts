import bcrypt from "bcrypt"

export default async function comparePassword(password: string, hash: string) {
    try {
        return await bcrypt.compare(password, hash)
    }
    catch(err) {
        throw err
    }
}
