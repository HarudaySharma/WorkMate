import bcrypt from "bcrypt"
import randomSalt from "./randomSalt"

export default async function generateHashedPass(password: string) {
    try {
        const salt = randomSalt()
        const passString = password + salt;
        const hashedPass = await bcrypt.hash(passString, 10)

        return { hashedPass, salt }
    }
    catch (err) {
        throw err
    }
}


