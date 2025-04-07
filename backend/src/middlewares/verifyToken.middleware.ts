import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"

import env from "../zod.js";
import { Errorr } from "./error.middleware.js";
import { JWTPayload } from "../types/index.js";
import { ExtendedError, Socket } from "socket.io";
import logger from "../logger.js";

export const verifyToken = (req: Request, _: Response, next: NextFunction) => {
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

export const wsVerifyToken = (socket: Socket, next: (err?: ExtendedError) => void) => {
    const { access_token } = socket.handshake.auth;
    logger.info("here")
    if (!access_token) {
        next(new Errorr("missing access_token", StatusCodes.UNAUTHORIZED))
        return
    }

    try {
        const decoded = jwt.verify(access_token, env.JWT_SECRET) as JWTPayload;
        socket.data.user = decoded.data.user;
        next();
    }
    catch (err) {
        next(new Errorr("access token not verified", StatusCodes.UNAUTHORIZED))
    }

}
