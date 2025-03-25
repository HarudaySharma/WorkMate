import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Errorr } from "../../middlewares/error.middleware.js";
import WorkspaceRepository from "../../services/mqsql/WorkspaceRepository.service.js";
import db from "../../services/mqsql/mysql.service.js";
import MemberRepository from "../../services/mqsql/MemberRepository.service.js";
import UserRepository from "../../services/mqsql/UserRepository.service.js";
import logger from "../../logger.js";
import Workmate from "../../services/workmate/workmate.service.js";

export const getWorkspaceMembers = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: GET /workspace/members")

    if (!req.user) {
        next(new Errorr("no user found, cannot see the workspace members", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === "" || userId === undefined) {
        next(new Errorr("invalid user id, cannot see the workspace members", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new Errorr("workspace not found", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        // make sure that the user is authorized to recieve the workspace info
        const mbrsRepo = new MemberRepository(await db.getConnection())

        const mbrs = await mbrsRepo.findByWkspcId({
            workspace_id: +workspaceId,
        })
        if (mbrs === null) {
            next(new Errorr(`user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED));
            return
        }

        const userRepo = new UserRepository(await db.getConnection())
        const resBody = mbrs.map(async ({ user_id, role }) => {
            try {
                const usr = await userRepo.findById(user_id)

                if (usr === null) {
                    return null;
                }

                return {
                    username: usr.username,
                    name: usr.name,
                    email: usr.email,
                    profilePicture: usr.profile_picture,
                    role: role,
                }

            } catch (err) {
                logger.error(`error fetching user info for id:${user_id}`)
                logger.error(err)
                return null
            }
        })

        if (resBody.filter(Boolean).length === 0) {
            next(new Errorr(`failed to get any member info from database`, StatusCodes.INTERNAL_SERVER_ERROR));
            return
        }

        res.status(StatusCodes.OK).json(resBody)

    } catch (err) {
        await db.transactionRollback()
        next(new Errorr("failed to get workspace members", StatusCodes.INTERNAL_SERVER_ERROR));
    }
}


export const getWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: GET /workspace")

    if (!req.user) {
        next(new Errorr("no user found, cannot visit the workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === "" || userId === undefined) {
        next(new Errorr("invalid user id, cannot visit the workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new Errorr("workspace not found", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const wkspcRepo = new WorkspaceRepository(await db.getConnection())

        const wkspc = await wkspcRepo.findById(+workspaceId)
        if (wkspc === null) {
            await db.transactionRollback()

            next(new Errorr(`workspace not found, make sure the Workspace ID is valid`, StatusCodes.BAD_REQUEST));
            return;
        }

        // make sure that the user is authorized to recieve the workspace info
        const mbrsRepo = new MemberRepository(await db.getConnection())

        const mbr = await mbrsRepo.find({
            user_id: userId,
            workspace_id: wkspc.id,
        })
        if (mbr === null) {
            next(new Errorr(`user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED));
            return
        }

        if (mbr.role === "admin") {
            res.status(StatusCodes.OK).json(wkspc) // show user the workspace -> redirect them to the workspace
        } else {
            const { invite_link, ...rest } = wkspc;
            res.status(StatusCodes.OK).json(rest) // show user the workspace -> redirect them to the workspace
        }

    } catch (err) {
        await db.transactionRollback()
        next(new Errorr("failed to find workspace", StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

export const joinWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: PATCH /workspace/join")

    if (!req.user) {
        next(new Errorr("no user found, cannot join workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === "" || userId === undefined) {
        next(new Errorr("invalid user id, cannot create workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { inviteLink } = req.params;
    if (inviteLink === undefined) {
        next(new Errorr("invite link invalid", StatusCodes.UNAUTHORIZED));
        return
    }

    try {
        const wkspcRepo = new WorkspaceRepository(await db.getConnection())
        const workmate = new Workmate(db)

        const ret = await workmate.joinWorkspace({
            userId: userId,
            inviteLink: inviteLink,
        })

        console.log(typeof ret)


        await db.startTransaction()

        const wkspc = await wkspcRepo.findByInviteLink(inviteLink)
        if (wkspc === null) {
            await db.transactionRollback()

            next(new Errorr(`workspace not found, make sure your invite link is valid`, StatusCodes.BAD_REQUEST));
            return;
        }

        const mbrsRepo = new MemberRepository(await db.getConnection())
        await mbrsRepo.add({
            user_id: userId,
            workspace_id: wkspc.id,
            role: "user",
        })

        await db.transactionCommit()

        res.status(StatusCodes.OK).json({ message: "joined workspace" }) // show user the workspace -> redirect them to the workspace
    } catch (err) {
        await db.transactionRollback()
        next(new Errorr("failed to join workspace", StatusCodes.INTERNAL_SERVER_ERROR));
    }

}

export const createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("HIT: PUT /workspace")

    if (!req.user) {
        next(new Errorr("no user found, cannot create workspace", StatusCodes.UNAUTHORIZED));
        return
    }

    const { id: userId } = req.user;
    if (userId === "" || userId === undefined) {
        next(new Errorr("invalid user id, cannot create workspace", StatusCodes.UNAUTHORIZED));
    }

    const { name, inviteLink } = req.body;

    if (name === undefined || inviteLink === undefined) {
        next(new Errorr("Insufficient data provided", StatusCodes.BAD_REQUEST));
        return
    }

    try {
        const workmate = new Workmate(db);
        const success = await workmate.createWorkspace({
            name: name,
            creatorId: userId,
            inviteLink: inviteLink,
        })

        if (!success) {
            next(new Errorr("failed to create workspace", StatusCodes.INTERNAL_SERVER_ERROR));
            return
        }

        res.status(StatusCodes.OK).json({ message: "created workspace" })
    } catch (err) {
        next(err as Errorr);
    }
}

