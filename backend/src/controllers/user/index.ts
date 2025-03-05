import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import db from "../../services/mqsql/mysql.service.js";

import { Errorr } from "../../middlewares/error.middleware.js";


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user === undefined) {
        next(new Errorr("not authorized to delete this user", StatusCodes.UNAUTHORIZED))
        return
    }

    try {
        await db.deleteUser({
            username: user.username,
            email: user.email,
        })

        res.clearCookie("access_token")
        res.status(StatusCodes.OK).json({ success: true })
    } catch (err) {
        next(new Errorr("failed to delete user", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}
