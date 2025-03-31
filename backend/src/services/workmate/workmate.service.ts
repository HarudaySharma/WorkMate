import WorkspaceRepository from "../mqsql/WorkspaceRepository.service";
import WorkspaceMemberRepository from "../mqsql/WorkspaceMemberRepository.service";
import { Database } from "../mqsql/mysql.service";
import { StatusCodes } from "http-status-codes";
import logger from "../../logger";

import {
    CreateWorkspaceParams,
    WorkmateError,
    CreateWorkspaceRet,
    JoinWorkspaceParams,
    DeleteWorkspaceParams,
    JoinWorkspaceRet,
    DeleteWorkspaceRet,
    GetWorkspaceRet,
    GetUserWorkspacesParams,
    GetWorkspaceInfoParams,
    GetUserWorkspacesRet,
    GetWorkspaceMembersRet,
    GetWorkspaceMembersParams,
    GetWorkspaceChatsParams,
} from "../../types/workspace.service.js";
import UserRepository from "../mqsql/UserRepository.service";
import ChatRepository from "../mqsql/ChatRepository.service";


class Workmate {
    // how should it perform the task?
    #db: Database

    constructor(db: Database) {
        this.#db = db;
    }

    async getWorkspaceChats({ workspaceId, userId }: GetWorkspaceChatsParams): Promise<any> {
        try {
            // make sure that the user is authorized to recieve the workspace info
            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            // checking if the user is the member of workspace.
            const mbr = await mbrsRepo.find({
                workspace_id: workspaceId,
                user_id: userId,
            })
            if (mbr === null) {
                throw new WorkmateError('USER_ERROR', `user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED);
            }


            // fetch chats from the database.
            const chatsRepo = new ChatRepository(await this.#db.getConnection())

            const chats = await chatsRepo.findByWkspcId({workspace_id: workspaceId})

            if (chats === null) {
                throw new WorkmateError('USER_ERROR', `user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED);
            }


        } catch (err) {
            await this.#db.transactionRollback()
            if (!(err instanceof WorkmateError)) {

                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to get workspace members", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }

    }
    async getWorkspaceMembers({ workspaceId, userId }: GetWorkspaceMembersParams): Promise<GetWorkspaceMembersRet> {
        try {
            // make sure that the user is authorized to recieve the workspace info
            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            // checking if the user is the member of workspace.
            const mbr = await mbrsRepo.find({
                workspace_id: workspaceId,
                user_id: userId,
            })
            if (mbr === null) {
                throw new WorkmateError('USER_ERROR', `user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED);
            }

            const mbrs = await mbrsRepo.findByWkspcId({
                workspace_id: workspaceId,
            })
            if (mbrs === null) {
                throw new WorkmateError('DATA_INCONSISTENCY_ERROR', `Unexpected data inconsistency: workspace has no members`, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            const userRepo = new UserRepository(await this.#db.getConnection())
            let ret = await Promise.all(
                mbrs.map(async ({ user_id, role }) => {
                    try {
                        const usr = await userRepo.findById(user_id)

                        if (usr === null) {
                            return null;
                        }

                        return {
                            username: usr.username,
                            name: usr.name,
                            email: usr.email,
                            profile_picture: usr.profile_picture,
                            role: role,
                        }

                    } catch (err) {
                        logger.error(`error fetching user info for id:${user_id}`)
                        logger.error(err)
                        return null
                    }
                })
            )

            const filteredRet = ret.filter((obj): obj is NonNullable<typeof obj> => obj !== null);
            if (filteredRet.length === 0) {
                throw (new WorkmateError('INTERNAL_ERROR', `failed to get any member info from database`, StatusCodes.INTERNAL_SERVER_ERROR));
            }

            return {
                success: true,
                message: `members for workspace {id: ${workspaceId}} retrived successfully`,
                data: {
                    members: filteredRet,
                }
            }

        } catch (err) {
            await this.#db.transactionRollback()
            if (!(err instanceof WorkmateError)) {

                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to get workspace members", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }

    }
    // will return all the workspaces of a user
    async getWorkspaceInfo({ workspaceId, userId }: GetWorkspaceInfoParams): Promise<GetWorkspaceRet> {
        try {
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())

            const wkspc = await wkspcRepo.findById(workspaceId)
            if (wkspc === null) {
                await this.#db.transactionRollback()
                throw new WorkmateError("USER_ERROR", `workspace not found, make sure the Workspace ID is valid`, StatusCodes.BAD_REQUEST)
            }

            // make sure that the user is authorized to recieve the workspace info
            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            const mbr = await mbrsRepo.find({
                user_id: userId,
                workspace_id: wkspc.id,
            })
            if (mbr === null) {
                throw new WorkmateError("USER_ERROR", `user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED)
            }

            const { invite_link, ...rest } = wkspc;
            return {
                success: true,
                message: "workspace retrived successfully",
                data: {
                    workspace: mbr.role === "admin" ? wkspc : rest,
                }
            }

        } catch (err) {
            await this.#db.transactionRollback()
            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to find workspace", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    async getUserWorkspaces({ userId }: GetUserWorkspacesParams): Promise<GetUserWorkspacesRet> {
        try {
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection());

            let wkspcs = await wkspcRepo.findUserWorkspaces(userId)

            if (wkspcs === null) {
                await this.#db.transactionRollback()
                throw new WorkmateError("INTERNAL_ERROR", `something wrong when getting user workspaces`, StatusCodes.INTERNAL_SERVER_ERROR)
            }

            const filteredWkspcs = wkspcs.map(({ invite_link, ...rest }) => rest)

            return {
                success: true,
                message: "user workspaces retrived successfully",
                data: {
                    workspaces: filteredWkspcs,
                },
            }

        } catch (err) {
            await this.#db.transactionRollback()

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to get user workspaces", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }
    // create workspaces?
    // patch ----?
    async createWorkspace({ name, creatorId, inviteLink }: CreateWorkspaceParams): Promise<CreateWorkspaceRet> {
        try {
            await this.#db.startTransaction()

            // create the workspace
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection());

            // checking if the workspace with the name is already created by the user
            let wkspc = await wkspcRepo.find({
                creator_id: creatorId,
                name: name,
            });

            if (wkspc !== null) {
                await this.#db.transactionRollback()
                throw new WorkmateError("USER_ERROR", `workspace with name: ${name} is already present, please choose different name`, StatusCodes.BAD_REQUEST)
            }

            // checking if the inviteLink is already not in the db assigned to another workspace
            wkspc = await wkspcRepo.findByInviteLink(inviteLink)

            if (wkspc !== null) {
                await this.#db.transactionRollback()
                throw new WorkmateError("USER_ERROR", `invite link: {${inviteLink}} is already used by another workspace, please generate a different inviteLink`, StatusCodes.BAD_REQUEST)
            }

            await wkspcRepo.createWorkspace(name, creatorId, inviteLink);

            // get the newly created workspace
            wkspc = await wkspcRepo.find({
                creator_id: creatorId,
                name: name,
            });

            if (wkspc === null) {
                await this.#db.transactionRollback()
                throw new WorkmateError("INTERNAL_ERROR", "failed to find workspace", StatusCodes.INTERNAL_SERVER_ERROR)
            }

            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection());
            await mbrsRepo.add({
                workspace_id: wkspc.id,
                user_id: creatorId,
                role: "admin",
            })

            await this.#db.transactionCommit()

            return {
                success: true,
                message: "workspace created successfully",
                data: {
                    workspace: wkspc,
                },
            }

        } catch (err) {
            await this.#db.transactionRollback()

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to join workspace", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    async joinWorkspace({ userId, inviteLink }: JoinWorkspaceParams): Promise<JoinWorkspaceRet> {
        try {
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())

            await this.#db.startTransaction()

            const wkspc = await wkspcRepo.findByInviteLink(inviteLink)
            if (wkspc === null) {
                await this.#db.transactionRollback()

                throw new WorkmateError("USER_ERROR", "workspace not found, make sure your invite link is valid", StatusCodes.BAD_REQUEST)
            }

            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            const mbr = await mbrsRepo.find({
                user_id: userId,
                workspace_id: wkspc.id,
            })

            if (mbr !== null) {
                await this.#db.transactionRollback()

                logger.info("here")
                throw new WorkmateError("USER_ERROR", "user is already a member of this workspace", StatusCodes.BAD_REQUEST)
            }

            await mbrsRepo.add({
                user_id: userId,
                workspace_id: wkspc.id,
                role: "member",
            })

            await this.#db.transactionCommit()

            return {
                success: true,
                message: "successfully joined the workspace",
                data: {
                    workspace: wkspc,
                }
            }

        } catch (err) {
            await this.#db.transactionRollback()

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to join workspace", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    async deleteWorkspace({ workspaceName, userId }: DeleteWorkspaceParams): Promise<DeleteWorkspaceRet> {
        try {

            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())
            const wkspc = await wkspcRepo.findByName(workspaceName)

            if (wkspc === null) {
                throw new WorkmateError("USER_ERROR", "workspace with name: ${name} does not exist", StatusCodes.BAD_REQUEST)
            }

            if (wkspc.creator_id !== userId) {
                throw new WorkmateError("USER_ERROR", "no rights to delete the workspace with name: ${name}", StatusCodes.UNAUTHORIZED)
            }

            await wkspcRepo.deleteWorkspace({ id: wkspc.id })

            return {
                success: true,
                message: `workspace with name: ${workspaceName} deleted successfully`
            }

        } catch (err) {
            await this.#db.transactionRollback()

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to join workspace", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }
}

export default Workmate;
