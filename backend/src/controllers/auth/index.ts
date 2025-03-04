import { NextFunction, Request, Response } from "express";
import logger from "../../logger.js";
import { Errorr } from "../../middlewares/error.middleware.js";
import db from "../../services/mqsql/mysql.service.js";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("loggin in")

    if (!req.head) {
        logger.warn("use viaLogin middleware developer");
        res.status(500); // internal server error
        res.json({ error: "developer hasn't used middlewares (fire him)" })
        return
    }

    const { viaEmail } = req.head;
    const { username, email, password } = req.body;

    try {
        // TODO: you are here
        const user = await db.findUser({ username, email })
        console.log({ user })

        if (viaEmail) {
            logger.info("logging using email")
            res.json({ message: "loggin using email" })
            return
            // login using email
        }

        logger.info("logging using username")
        res.json({ message: "loggin using username" })
    } catch (err) {
        next(new Errorr(`${err}`));
    }


    return

    // login using username
}

export const signup = (req: Request, res: Response, next: NextFunction) => {
    next()
}


export const OAuth = (req: Request, res: Response, next: NextFunction) => {
    next()
}
