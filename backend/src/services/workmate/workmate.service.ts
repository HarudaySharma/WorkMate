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
    GetWorkspaceChatsRet,
    CreateChatParams,
    CreateChatRet,
    CreateMessageRet,
    CreateMessageParams,
} from "../../types/workspace.service.js";
import UserRepository from "../mqsql/UserRepository.service";
import ChatRepository from "../mqsql/ChatRepository.service";
import ChatMemberRepository from "../mqsql/ChatMemberRepository.service";
import MessageRepository from "../mqsql/MessageRepository.service";
import MessageRecipientRepository from "../mqsql/MessageRecipientRepository.service";
import { P } from "pino";


class Workmate {
    // how should it perform the task?
    #db: Database

    constructor(db: Database) {
        this.#db = db;
    }

    async getWorkspaceChats({ workspaceId, userId }: GetWorkspaceChatsParams): Promise<GetWorkspaceChatsRet> {
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

            const chats = await chatsRepo.findByWkspcId({ workspace_id: workspaceId })

            return {
                success: true,
                message: `chats for workspace with id: ${workspaceId} retrieved successfully`,
                data: {
                    workspace: {
                        id: workspaceId,
                    },
                    chats: chats,
                }
            }

        } catch (err) {
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
            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to get user workspaces", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    async createMessage({ chat, userId, msg }: CreateMessageParams): Promise<CreateMessageRet> {
        try {

            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())

            const wkspc = await wkspcRepo.findById(chat.workspace_id)
            if (wkspc === null) {
                throw new WorkmateError("USER_ERROR", `workspace not found, make sure the Workspace ID is valid`, StatusCodes.BAD_REQUEST)
            }

            // make sure that the user is authorized to create the chat
            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            const mbr = await mbrsRepo.find({
                user_id: userId,
                workspace_id: chat.workspace_id,
            })
            if (mbr === null) {
                throw new WorkmateError("USER_ERROR", `user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED)
            }

            // create the message now and add the message recipient (one-one or group(more than one recipient) to the message_receipent table;
            await this.#db.startTransaction()

            const msgRepo = new MessageRepository(await this.#db.getConnection())
            const { message_id: msgId } = await msgRepo.add({
                sender_id: userId,
                chat_id: chat.id,
                type: msg.type,
                text: msg.text,
                image_url: msg.image_url,
                audio_url: msg.audio_url,
            })

            const chatMembersRepo = new ChatMemberRepository(await this.#db.getConnection());

            // NOTE:
            // what if user trying to send the message is not a chat member ??
            // right now if user if member of wkpsc then they can send messages to any group chats, so if the user is not a chat member -> make it a member.
            const chatMember = await chatMembersRepo.find({
                user_id: userId,
                chat_id: chat.id,
            })

            if (!chatMember) {
                await chatMembersRepo.add({
                    user_id: userId,
                    chat_id: chat.id,
                    role: 'member',
                })
            }

            // get all the members of the chat
            const chatMembers = await chatMembersRepo.findByChatId({
                chat_id: chat.id,
            })

            // logger.info({ chatMembers })


            const msgRecptRepo = new MessageRecipientRepository(await this.#db.getConnection())
            Promise.all(chatMembers.map(async (mbr) => {
                if (mbr.user_id === userId) // sender can not be the receiver
                    return;

                await msgRecptRepo.add({
                    message_id: msgId,
                    user_id: mbr.user_id,// all the members of chat other than sender will be the receivers
                })
            }))

            const insertedMessage = await msgRepo.findById({ message_id: msgId });

            if (insertedMessage === null) {
                // should not happen as the chat was just created
                await this.#db.transactionRollback();
                throw new WorkmateError('DATA_PERSISTENCE_ERROR', `message was not inserted into db with id ${msgId}`, StatusCodes.INTERNAL_SERVER_ERROR)
            }

            await this.#db.transactionCommit()

            return {
                success: true,
                message: "Message created successfully",
                data: {
                    message: insertedMessage,
                    workspace: {
                        id: wkspc.id,
                        name: wkspc.name,
                    },
                    chat: {
                        ...chat,
                    }
                },
            };

        } catch (err) {
            await this.#db.transactionRollback()

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to create message", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    async createChat({ chat, userId }: CreateChatParams): Promise<CreateChatRet> {
        try {

            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())

            const wkspc = await wkspcRepo.findById(chat.workspace_id)
            if (wkspc === null) {
                throw new WorkmateError("USER_ERROR", `workspace not found, make sure the Workspace ID is valid`, StatusCodes.BAD_REQUEST)
            }

            // make sure that the user is authorized to create the chat
            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            const mbr = await mbrsRepo.find({
                user_id: userId,
                workspace_id: chat.workspace_id,
            })
            if (mbr === null) {
                throw new WorkmateError("USER_ERROR", `user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED)
            }

            // create the chat now and add user as a chat_member of this chat in the db
            await this.#db.startTransaction()

            const chatRepo = new ChatRepository(await this.#db.getConnection())
            const { id: chatId } = await chatRepo.add({
                name: chat.name,
                workspace_id: chat.workspace_id,
                type: chat.type,
            })

            const chatMembersRepo = new ChatMemberRepository(await this.#db.getConnection())
            await chatMembersRepo.add({
                user_id: userId,
                chat_id: chatId,
                role: 'admin', // user creating the chat should be "admin"
            });

            const insertedChat = await chatRepo.find({ id: chatId });

            if (insertedChat === null) {
                // should not happen as the chat was just created
                await this.#db.transactionRollback();
                throw new WorkmateError('DATA_PERSISTENCE_ERROR', `chat was not inserted into db with id ${chatId}`, StatusCodes.INTERNAL_SERVER_ERROR)
            }

            await this.#db.transactionCommit()

            return {
                success: true,
                message: "chat created successfully",
                data: {
                    chat: insertedChat,
                    workspace: {
                        id: wkspc.id,
                        name: wkspc.name,
                    }
                },
            }

        } catch (err) {
            await this.#db.transactionRollback()

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to create workspace", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    // create workspaces?
    // patch ----?
    async createWorkspace({ name, creatorId, inviteLink }: CreateWorkspaceParams): Promise<CreateWorkspaceRet> {
        try {

            // create the workspace
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection());

            // checking if the workspace with the name is already created by the user
            let wkspc = await wkspcRepo.find({
                creator_id: creatorId,
                name: name,
            });

            if (wkspc !== null) {
                throw new WorkmateError("USER_ERROR", `workspace with name: ${name} is already present, please choose different name`, StatusCodes.BAD_REQUEST)
            }

            // checking if the inviteLink is already not in the db assigned to another workspace
            wkspc = await wkspcRepo.findByInviteLink(inviteLink)

            if (wkspc !== null) {
                throw new WorkmateError("USER_ERROR", `invite link: {${inviteLink}} is already used by another workspace, please generate a different inviteLink`, StatusCodes.BAD_REQUEST)
            }

            await this.#db.startTransaction()

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

            const wkspc = await wkspcRepo.findByInviteLink(inviteLink)
            if (wkspc === null) {
                throw new WorkmateError("USER_ERROR", "workspace not found, make sure your invite link is valid", StatusCodes.BAD_REQUEST)
            }

            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            const mbr = await mbrsRepo.find({
                user_id: userId,
                workspace_id: wkspc.id,
            })

            if (mbr !== null) {
                throw new WorkmateError("USER_ERROR", "user is already a member of this workspace", StatusCodes.BAD_REQUEST)
            }


            await mbrsRepo.add({
                user_id: userId,
                workspace_id: wkspc.id,
                role: "member",
            })

            return {
                success: true,
                message: "successfully joined the workspace",
                data: {
                    workspace: wkspc,
                }
            }

        } catch (err) {
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
            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to join workspace", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }
}

export default Workmate;
