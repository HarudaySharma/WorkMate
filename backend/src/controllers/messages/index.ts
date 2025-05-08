import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Errorr } from "../../middlewares/error.middleware.js";
import db from "../../services/mqsql/mysql.service.js";
import logger from "../../logger.js";
import Workmate from "../../services/workmate/workmate.service.js";
import { WorkmateError } from "../../types/workspace.service.js";
import { Chat, Message } from "../../database_schema.js";

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: PUT /chat/:workspaceId/:chatId/message")

    if (!req.user) {
        next(new Errorr("no user found, cannot create a message", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot create a message", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new Errorr("no Workspace Id provided or chat Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    const { message, chat } = req.body as { message: Message, chat: Chat }

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.createMessage({
            userId: userId,
            chat: {
                id: +chatId,
                workspace_id: +workspaceId,
                type: chat.type,
            },
            msg: {
                type: message.type,
                text: message.text,
                audio_url: message.audio_url,
                image_url: message.image_url,
            }
        })

        res.status(StatusCodes.OK).json(ret) // show user the workspace -> redirect them to the workspace
    } catch (err) {
        const er = err as WorkmateError;// err will always be of type WorkmateError
        if (er.type === undefined) {
            console.log(err)
            next(new Errorr("internal server error"));
            return
        }

        logger.error(er.error)
        const statusCode = (er.type === "USER_ERROR" ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR);
        next(new Errorr(er.message, er.httpStatusCode || statusCode))
    }
}

export const getChatMessages = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: GET /chat/:workspaceId/:chatId/messages")

    if (!req.user) {
        next(new Errorr("no user found, cannot get messages", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot get messages", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new Errorr("no Workspace Id provided or chat Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.getChatMessages({
            userId: userId,
            workspaceId: +workspaceId,
            chatId: +chatId,
        })

        res.status(StatusCodes.OK).json(ret) // show user the workspace -> redirect them to the workspace
    } catch (err) {
        const er = err as WorkmateError;// err will always be of type WorkmateError
        if (er.type === undefined) {
            console.log(err)
            next(new Errorr("internal server error"));
            return
        }

        logger.error(er.error)
        const statusCode = (er.type === "USER_ERROR" ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR);
        next(new Errorr(er.message, er.httpStatusCode || statusCode))
    }
}

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: DELETE /chat/:workspaceId/:chatId/message")

    if (!req.user) {
        next(new Errorr("no user found, cannot get messages", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot get messages", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new Errorr("no Workspace Id provided or chat Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    const { messageId } = req.body as { messageId: Message["message_id"] };

    if (messageId == undefined) {
        next(new Errorr("missing messageId in request body", StatusCodes.BAD_REQUEST));
        return
    }

    try {
        const workmate = new Workmate(db);

        const ret = await workmate.deleteMessage({
            messageId: messageId,
            userId: userId,
        })

        res.status(StatusCodes.OK).json(ret)
    } catch (err) {
        const er = err as WorkmateError;// err will always be of type WorkmateError
        if (er.type === undefined) {
            console.log(err)
            next(new Errorr("internal server error"));
            return
        }

        logger.error(er.error)
        const statusCode = (er.type === "USER_ERROR" ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR);
        next(new Errorr(er.message, er.httpStatusCode || statusCode))
    }
}
