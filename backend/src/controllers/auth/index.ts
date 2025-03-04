import { NextFunction, Request, Response } from "express";
import logger from "../../logger.js";
import { Errorr } from "../../middlewares/error.middleware.js";
import db from "../../services/mqsql/mysql.service.js";
import { User } from "../../database_schema.js";
import generateHashedPass from "../../utils/generateHashedPass.js";
import { StatusCodes } from "http-status-codes";
import comparePassword from "../../utils/comparePassword.js";
import { generateToken } from "../../utils/jwt.js";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("loggin in")

    const { username, email, password } = req.body

    try {
        const user = await db.findUser({ username, email })

        console.log({ user })
        if (user === null) {
            next(new Errorr("user not found", StatusCodes.NOT_FOUND))
            return
        }

        // user is found
        const validPass = await comparePassword(password, user.hashed_password)
        if (!validPass) {
            next(new Errorr("invalid password", StatusCodes.UNAUTHORIZED))
        }


        const token = generateToken(username)
        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 2// two hours
        })
    } catch (err) {
        next(new Errorr(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR))
    }


    return
    // login using username
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { username, name, email, password } = req.body;

    if (username === undefined || email === undefined || password === undefined) {
        next(new Errorr("Insufficient data provided", StatusCodes.BAD_REQUEST));
        return
    }
    // check for the user in db
    try {
        await db.deleteTable("user")
        await db.createTable("user")
        const user = await db.findUser({ username, email });
        if (user !== null) {
            next(new Errorr("account already exists with username or email", StatusCodes.CONFLICT)) // conflict
            return
        }

        const { hashedPass, salt } = await generateHashedPass(password)

        const newUser: Partial<User> = {
            username,
            name,
            email,
            hashed_password: hashedPass,
            hash_salt: salt,
            profile_picture: `https://ui-avatars.com/api/?name=${username}` // default profile pics
        }

        await db.addUser(newUser);
        const { hash_salt, hashed_password, ...cleanUser } = newUser

        res.json({ message: "added user to db", user: cleanUser })

    } catch (err) {
        logger.error(err)
        next(new Errorr("", StatusCodes.INTERNAL_SERVER_ERROR))
    }


}


export const OAuth = (req: Request, res: Response, next: NextFunction) => {
    next()
}
