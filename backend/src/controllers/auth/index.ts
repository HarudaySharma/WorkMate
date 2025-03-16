import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import logger from "../../logger.js";
import db from "../../services/mqsql/mysql.service.js";

import { Errorr } from "../../middlewares/error.middleware.js";
import { User } from "../../database_schema.js";
import defaultCookieOptions from "../../config/cookieOptions.js";

import generateHashedPass from "../../utils/generateHashedPass.js";
import comparePassword from "../../utils/comparePassword.js";
import { generateToken } from "../../utils/jwt.js";
import generatePassword from "../../utils/generatePassword.js";
import UserRepository from "../../services/mqsql/UserRepository.service.js";
import { AuthProvider } from "../../types/index.js";
import fetchOAuthUser from "../../utils/fetchUserDetails.js";
import generateUID from "../../utils/generateUID.js";

//
// TODO: Testing these routes extensively

export const login = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: /auth/login")

    const { username, email, password } = req.body

    try {
        const userRepo = new UserRepository(await db.getConnection())

        const user = await userRepo.find({ username, email })

        logger.info({ user })
        if (user === null) {
            next(new Errorr("user not found", StatusCodes.NOT_FOUND))
            return
        }

        // user is found
        const validPass = await comparePassword(password, user.hash_salt, user.hashed_password)
        if (!validPass) {
            next(new Errorr("invalid password", StatusCodes.UNAUTHORIZED))
        }

        const token = generateToken({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            profile_picture: user.profile_picture,
        })

        res.cookie("access_token", token, defaultCookieOptions())
        res.status(StatusCodes.OK).json({ success: "true" })

    } catch (err) {
        next(new Errorr(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR))
    }

    return
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: /auth/signup")

    const { username, name, email, password } = req.body;

    logger.info(req.body)
    if (username === undefined || email === undefined || password === undefined) {
        next(new Errorr("Insufficient data provided", StatusCodes.BAD_REQUEST));
        return
    }
    // check for the user in db
    try {
        const userRepo = new UserRepository(await db.getConnection())

        const user = await userRepo.find({ username, email });
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
            profile_picture: `https://ui-avatars.com/api/?name=${username}`, // default profile pics
        }

        await userRepo.add(newUser);

        const addedUser = await userRepo.find({ username })
        if (addedUser === null) {
            next(new Errorr("failed to find added user in db", StatusCodes.NOT_FOUND))
            return
        }

        const token = generateToken({
            id: addedUser.id,
            name: addedUser.name,
            username: addedUser.username,
            email: addedUser.email,
            profile_picture: addedUser.profile_picture,
        })

        res.cookie("access_token", token, defaultCookieOptions())
        res.status(StatusCodes.OK).json({ success: "true" })

    } catch (err) {
        logger.error(err)
        next(new Errorr("", StatusCodes.INTERNAL_SERVER_ERROR))
    }


}

export const oAuth = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: /auth/oauth")

    const { provider } = req.params as { provider: AuthProvider };

    const { code } = req.body;
    logger.info({ provider, code })

    let u: Partial<User> | undefined = undefined;
    try {
        u = await fetchOAuthUser(code, provider)
    } catch (err) {
        logger.error(err)
        next(new Errorr("", StatusCodes.INTERNAL_SERVER_ERROR))
        return
    }

    if (u === null || u === undefined || u.email === undefined) {
        next(new Errorr("Insufficient data provided", StatusCodes.BAD_REQUEST));
        return
    }

    // check for the user in db
    try {
        const userRepo = new UserRepository(await db.getConnection())

        const user = await userRepo.find({ email: u.email });
        if (user !== null) {
            logger.info("user found in db")
            // redirect the user to login user must have already signup using the service provider.
            const token = generateToken({
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                profile_picture: user.profile_picture,
            })

            res.cookie('access_token', token, defaultCookieOptions())
            res.status(StatusCodes.OK).json({ success: true });
            return
        }

        const username = u.name + generateUID()
        const { hashedPass, salt } = await generateHashedPass(generatePassword())

        const newUser: Partial<User> = {
            username,
            name: u.name,
            email: u.email,
            email_verified: u.email_verified,
            hashed_password: hashedPass,
            hash_salt: salt,
            profile_picture: u.profile_picture || `https://ui-avatars.com/api/?name=${username}`, // default profile pics
        }

        await userRepo.add(newUser);
        const addedUser = await userRepo.find({ username })
        if (addedUser === null) {
            next(new Errorr("failed to find added user in db", StatusCodes.NOT_FOUND))
            return
        }

        const token = generateToken({
            id: addedUser.id,
            name: addedUser.name,
            username: addedUser.username,
            email: addedUser.email,
            profile_picture: addedUser.profile_picture,
        })

        res.cookie('access_token', token, defaultCookieOptions())
        res.status(StatusCodes.OK).json({ success: "true" })

    } catch (err) {
        logger.error(err)
        next(new Errorr("", StatusCodes.INTERNAL_SERVER_ERROR))
    }
    next()
}
