import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"

import env from "../zod.js";
import { Errorr } from "./error.middleware.js";
import { JWTPayload } from "../types/index.js";


const verifyToken = (req: Request, _: Response, next: NextFunction) => {
    if (!req.cookies) {
        next(new Errorr("missing cookies", StatusCodes.UNAUTHORIZED))
        return
    }

    const { access_token } = req.cookies;
    if (!access_token) {
        next(new Errorr("missing access_token", StatusCodes.UNAUTHORIZED))
        return
    }

    try {
        const decoded = jwt.verify(access_token, env.JWT_SECRET) as JWTPayload;
        req.user = decoded.data.user;
        next();
    }
    catch (err) {
        next(new Errorr("access token not verified", StatusCodes.UNAUTHORIZED))
    }

}

export default verifyToken
