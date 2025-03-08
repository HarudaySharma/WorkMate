import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Errorr } from "../../middlewares/error.middleware.js";
import WorkspaceRepository from "../../services/mqsql/WorkspaceRepository.service.js";
import db from "../../services/mqsql/mysql.service.js";
import MemberRepository from "../../services/mqsql/MemberRepository.service.js";
import logger from "../../logger.js";


export const createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
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
        await db.startTransaction()

        // create the workspace
        const workspaceRepo = new WorkspaceRepository(await db.getConnection());

        // checking if the workspace with the name is already created by the user
        let wkspc = await workspaceRepo.findWorkspace({
            creator_id: userId,
            name: name,
        });

        if (wkspc !== null) {
            await db.transactionRollback()

            next(new Errorr(`workspace with name: ${name} is already present, please choose different name`, StatusCodes.BAD_REQUEST));
            return;
        }


        await workspaceRepo.createWorkspace(name, userId, inviteLink);

        // get the newly created workspace
        wkspc = await workspaceRepo.findWorkspace({
            creator_id: userId,
            name: name,
        });

        if (wkspc === null) {
            await db.transactionRollback()

            next(new Errorr("failed to find workspace", StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }


        const memberRepo = new MemberRepository(await db.getConnection());
        await memberRepo.createMember({
            workspace_id: wkspc.id,
            user_id: userId,
            role: "admin",
        })

        await db.transactionCommit()

        res.status(StatusCodes.OK).json({ message: "created workspace" })
    } catch (err) {
        await db.transactionRollback()
        next(new Errorr("failed to create workspace", StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

// for members
// await memberRepo.createMember({
//     workspace_id: wkspc.id,
//     user_id: userId,
//     role: wkspc.creator_id === userId ? "admin" : role === "admin" ? role : "user",
// })
//
