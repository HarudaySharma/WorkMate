import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Errorr } from "../../middlewares/error.middleware.js";
import db from "../../services/mqsql/mysql.service.js";
import logger from "../../logger.js";
import Workmate from "../../services/workmate/workmate.service.js";
import { WorkmateError } from "../../types/workspace.service.js";


// TODO: test all these routes
export const getWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: GET /workspace")

    if (!req.user) {
        next(new Errorr("no user found, cannot visit the workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot visit the workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new Errorr("workspace not found", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.getWorkspaceInfo({
            userId: userId,
            workspaceId: +workspaceId,
        });

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

export const joinWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: PATCH /workspace/join")

    if (!req.user) {
        next(new Errorr("no user found, cannot join workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot create workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { inviteLink } = req.params;
    if (inviteLink === undefined) {
        next(new Errorr("invite link invalid", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.joinWorkspace({
            userId: userId,
            inviteLink: inviteLink,
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

export const createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: PUT /workspace")

    if (!req.user) {
        next(new Errorr("no user found, cannot create workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot create workspace", StatusCodes.UNAUTHORIZED));
    }

    const { name, inviteLink } = req.body;

    if (name === undefined || inviteLink === undefined) {
        next(new Errorr("Insufficient data provided", StatusCodes.BAD_REQUEST));
        return
    }

    try {
        const workmate = new Workmate(db);
        const ret = await workmate.createWorkspace({
            name: name,
            creatorId: userId,
            inviteLink: inviteLink,
        })

        res.status(StatusCodes.OK).json(ret)

    } catch (err) {
        const er = err as WorkmateError;// err will always be of type WorkmateError
        if (er.type === undefined) {
            logger.error(err)
            next(new Errorr("internal server error"));
            return
        }

        logger.error(er.error)

        const statusCode = (er.type === "USER_ERROR" ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR);
        next(new Errorr(er.message, er.httpStatusCode || statusCode))
    }
}


export const deleteWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: DELETE /workspace")

    if (!req.user) {
        next(new Errorr("no user found, cannot delete workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot delete workspace", StatusCodes.UNAUTHORIZED));
    }

    const { workspaceName } = req.body;

    if (workspaceName === undefined) {
        next(new Errorr("Insufficient data provided", StatusCodes.BAD_REQUEST));
        return
    }

    try {
        const workmate = new Workmate(db);
        // user can either provide the name of the workspace or id to delete it.
        const ret = await workmate.deleteWorkspace({
            workspaceName: workspaceName,
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

export const getUserWorkspaces = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: GET /workspace/all")

    if (!req.user) {
        next(new Errorr("no user found, cannot see the workspace members", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot see the workspace members", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.getUserWorkspaces({
            userId: userId,
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

export const getWorkspaceMembers = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: GET /workspace/members")

    if (!req.user) {
        next(new Errorr("no user found, cannot see the workspace members", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new Errorr("invalid user id, cannot see the workspace members", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new Errorr("no Workspace Id provided", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const workmate = new Workmate(db)

        const ret = await workmate.getWorkspaceMembers({
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


