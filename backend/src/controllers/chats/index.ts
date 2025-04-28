import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Errorr } from "../../middlewares/error.middleware.js";
import db from "../../services/mqsql/mysql.service.js";
import logger from "../../logger.js";
import Workmate from "../../services/workmate/workmate.service.js";
import { WorkmateError } from "../../types/workspace.service.js";
import { Chat, ChatMember, WorkSpace } from "../../database_schema.js";

export const createChat = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: PUT /chat")

    if (!req.user) {
        next(new Errorr("no user found, cannot see the workspace chats", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot see the workspace chats", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId } = req.params;
    const { chat } = req.body as { chat: Chat }

    if (workspaceId === undefined) {
        next(new Errorr("no Workspace Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.createChat({
            userId: userId,
            chat: {
                name: chat.name,
                type: chat.type,
                workspace_id: +workspaceId,
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

export const getWorkspaceChats = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: GET /chat/all")

    if (!req.user) {
        next(new Errorr("no user found, cannot see the workspace chats", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot see the workspace chats", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new Errorr("no Workspace Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.getWorkspaceChats({
            userId: userId,
            workspaceId: +workspaceId,
        })

        res.status(StatusCodes.OK).json(ret) // show user the workspace -> redirect them to the workspace
    } catch (err) {
        const er = err as WorkmateError;// err will always be of type WorkmateError
        if (er.type === undefined) {
            next(new Errorr("internal server error"));
            return
        }

        logger.error(er.error)
        const statusCode = (er.type === "USER_ERROR" ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR);
        next(new Errorr(er.message, er.httpStatusCode || statusCode))
    }
}

export const joinChat = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: PATCH /chat/:workspaceId/:chatId/")

    if (!req.user) {
        next(new Errorr("no user found, cannot join the chat", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot join the chat", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new Errorr("no Workspace Id provided or chat Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    const { role } = req.query as { role: ChatMember["role"] };

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.joinChat({
            workspaceId: +workspaceId,
            chatId: +chatId,
            userId: userId,
            role: role,
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

export const getChatMembers = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: GET /chat/:workspaceId/:chatId/members")

    if (!req.user) {
        next(new Errorr("no user found, cannot get chat members", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot get chat members", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new Errorr("no Workspace Id provided or chat Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.getChatMembers({
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

export const leaveChat = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: DELETE /chat/leave")

    if (!req.user) {
        next(new Errorr("no user found, cannot leave chat", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot leave chat", StatusCodes.UNAUTHORIZED));
    }

    const { chatId, workspaceId } = req.params

    if (workspaceId === undefined || chatId === undefined) {
        next(new Errorr("no Workspace Id provided or chat Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db);

        const ret = await workmate.leaveChat({
            chat: {
                id: +chatId,
                workspace_id: +workspaceId,
            },
            userId: userId,
        })

        res.status(StatusCodes.OK).json(ret)
    } catch (err) {
        const er = err as WorkmateError; // err will always be of type WorkmateError
        if (er.type === undefined) { // this won't happen usually
            logger.error(err)
            next(new Errorr("internal server error"));
            return
        }

        logger.error(er.error)

        const statusCode = (er.type === "USER_ERROR" ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR);
        next(new Errorr(er.message, er.httpStatusCode || statusCode))
    }
}

export const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: DELETE /chat")

    if (!req.user) {
        next(new Errorr("no user found, cannot delete chat", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot delete chat", StatusCodes.UNAUTHORIZED));
    }

    const { chatId, workspaceId } = req.params

    if (workspaceId === undefined || chatId === undefined) {
        next(new Errorr("no Workspace Id provided or chat Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db);

        const ret = await workmate.deleteChat({
            chat: {
                id: +chatId,
                workspace_id: +workspaceId,
            },
            userId: userId,
        })

        res.status(StatusCodes.OK).json(ret)
    } catch (err) {
        const er = err as WorkmateError; // err will always be of type WorkmateError
        if (er.type === undefined) { // this won't happen usually
            logger.error(err)
            next(new Errorr("internal server error"));
            return
        }

        logger.error(er.error)

        const statusCode = (er.type === "USER_ERROR" ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR);
        next(new Errorr(er.message, er.httpStatusCode || statusCode))
    }
}
