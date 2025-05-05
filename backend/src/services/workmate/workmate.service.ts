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
    GetChatMessagesRet,
    GetChatMessagesParams,
    JoinChatParams,
    JoinChatRet,
    GetChatMembersParams,
    GetChatMembersRet,
    ChatMemberReturn,
    DeleteChatMessageParams,
    DeleteChatMessageRet,
    DeleteChatParams,
    DeleteChatRet,
    LeaveChatRet,
    LeaveChatParams,
    LeaveWorkspaceParams,
    RemoveWorkspaceMemberRet,
    ModifyWorkspaceMemberParams,
    RemoveWorkspaceMember,
} from "../../types/workspace.service.js";
import UserRepository from "../mqsql/UserRepository.service";
import ChatRepository from "../mqsql/ChatRepository.service";
import ChatMemberRepository from "../mqsql/ChatMemberRepository.service";
import MessageRepository from "../mqsql/MessageRepository.service";
import MessageRecipientRepository from "../mqsql/MessageRecipientRepository.service";
import { Chat } from "../../database_schema";

class Workmate {
    // how should it perform the task?
    #db: Database

    constructor(db: Database) {
        this.#db = db;
    }

    // NOTE: ********************************CHAT Related Functions********************************
    async getChatMembers({ workspaceId, userId, chatId }: GetChatMembersParams): Promise<GetChatMembersRet> {
        try {
            // make sure that the user is authorized to recieve the messages
            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            // checking if the user is the member of workspace.
            const mbr = await mbrsRepo.find({
                workspace_id: workspaceId,
                user_id: userId,
            })
            if (mbr === null) {
                throw new WorkmateError('USER_ERROR', `user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED);
            }

            // check if the user is member of chat
            const chatMembersRepo = new ChatMemberRepository(await this.#db.getConnection())
            // NOTE:
            // const chatMbr = await chatMembersRepo.find({ chat_id: chatId, user_id: userId })
            // if (chatMbr === null) {
            //     throw new WorkmateError('USER_ERROR', `user is not a member of chat`, StatusCodes.UNAUTHORIZED);
            // }

            // retrieve all the members of the chat
            const chatMbrs = await chatMembersRepo.findByChatId({ chat_id: chatId })

            const userRepo = new UserRepository(await this.#db.getConnection())

            const chatMbrsRet = await Promise.all(chatMbrs.map(async (mbr): Promise<ChatMemberReturn> => {
                const user = await userRepo.findById(mbr.user_id)

                if (user === null) {
                    // shouldn't be happening
                    throw new WorkmateError("DATA_INCONSISTENCY_ERROR", `user with {id: ${mbr.user_id}} not found in database`, StatusCodes.INTERNAL_SERVER_ERROR)
                }
                return {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    profile_picture: user.profile_picture,
                    role: mbr.role,
                    joined_at: mbr.joined_at,
                };
            }))

            return {
                success: true,
                message: `members for workspace with id: ${workspaceId} and chat with id: ${chatId} retrieved successfully`,
                data: {
                    members: chatMbrsRet,
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

    async joinChat({ workspaceId, userId, chatId, role }: JoinChatParams): Promise<JoinChatRet> {
        try {
            // check if the workspace exists
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())

            const wkspc = await wkspcRepo.findById(workspaceId)
            if (wkspc === null) {
                throw new WorkmateError("USER_ERROR", "workspace not found", StatusCodes.BAD_REQUEST)
            }

            // check if user is the member of workspace
            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            const mbr = await mbrsRepo.find({
                user_id: userId,
                workspace_id: wkspc.id,
            })

            if (mbr === null) {
                throw new WorkmateError("USER_ERROR", "user is not a member of workspace", StatusCodes.BAD_REQUEST)
            }

            // add user as the member of the chat
            const chatMembersRepo = new ChatMemberRepository(await this.#db.getConnection());
            // check if user is already a member of chat
            const chatMbr = await chatMembersRepo.find({ chat_id: chatId, user_id: userId })
            if (chatMbr !== null) {
                throw new WorkmateError("USER_ERROR", "user is already a member of the chat", StatusCodes.BAD_REQUEST)
            }

            await chatMembersRepo.add({
                chat_id: chatId,
                user_id: userId,
                role: role,
            })

            // what should the return of this functions be?
            //  1. messages of the chat?
            //  2. chat data itself? but that should already be at the client's side as without that they won't be able to send a join request.
            //  3. Just status of the request ? **went with this**
            return {
                success: true,
                message: `user with id: ${userId} successfully joined the chat`,
            }

        } catch (err) {
            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to join chat", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    async getWorkspaceChats({ workspaceId, userId }: GetWorkspaceChatsParams): Promise<GetWorkspaceChatsRet> {
        try {
            // make sure that the user is authorized to recieve the workspace chats
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
            const chatMembersRepo = new ChatMemberRepository(await this.#db.getConnection())

            // send only the group chats and the one-one chats of the user
            // INFO: can't use filter with async callbacks so had to use map
            const chatsWithFilter = await Promise.all(chats.map(async (chat) => {
                if (chat.type === 'group') {
                    return { chat, include: true };
                }
                if (chat.type === 'one-one') {
                    // check if the user is member of chat
                    try {
                        const chatMbrs = await chatMembersRepo.findByChatId({ chat_id: chat.id });

                        const include = chatMbrs.some(mrb => mrb.user_id === userId)

                        return { chat, include }
                    } catch (err) {
                        throw new WorkmateError("INTERNAL_ERROR", "failed to retrieve user personal chats", StatusCodes.INTERNAL_SERVER_ERROR);
                    }
                }

                return { chat, include: false }
            }))

            const filteredChat = chatsWithFilter
                .filter(item => item.include)
                .map(item => item.chat)

            return {
                success: true,
                message: `chats for workspace with id: ${workspaceId} retrieved successfully`,
                data: {
                    workspace: {
                        id: workspaceId,
                    },
                    chats: filteredChat,
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

    async createChat({ chat, userId, recieverId }: CreateChatParams): Promise<CreateChatRet> {
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
            const chatMembersRepo = new ChatMemberRepository(await this.#db.getConnection())

            let chatId: Chat["id"] | undefined;
            if (chat.type === 'group') {
                const { id } = await chatRepo.add({
                    name: chat.name,
                    workspace_id: chat.workspace_id,
                    type: chat.type,
                })
                chatId = id;

                await chatMembersRepo.add({
                    user_id: userId,
                    chat_id: chatId,
                    role: 'admin', // user creating the chat should be "admin"
                });
            } else if (chat.type === 'one-one') {
                if (!recieverId) {
                    throw new WorkmateError("USER_ERROR", `reciever can not be found, recieverId missing`, StatusCodes.UNAUTHORIZED)
                }

                const { id } = await chatRepo.add({
                    name: null,
                    workspace_id: chat.workspace_id,
                    type: chat.type,
                })
                chatId = id;

                await chatMembersRepo.add({
                    user_id: userId,
                    chat_id: chatId,
                    role: 'admin', // reciever should also be the admin
                });

                if (recieverId !== userId) {
                    await chatMembersRepo.add({
                        user_id: recieverId,
                        chat_id: chatId,
                        role: 'admin', // user should also be the admin
                    });
                }
            }

            if (!chatId) {
                // fallback for safety — shouldn't be reached
                throw new WorkmateError('DATA_PERSISTENCE_ERROR', 'Chat ID could not be resolved', StatusCodes.INTERNAL_SERVER_ERROR);
            }

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

    async leaveChat({ chat, userId }: LeaveChatParams): Promise<LeaveChatRet> {
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

            const chatMembersRepo = new ChatMemberRepository(await this.#db.getConnection())
            await chatMembersRepo.delete({
                user_id: userId,
                chat_id: chat.id
            })

            return {
                success: true,
                message: `user left the chat successfully`
            }

        } catch (err) {
            await this.#db.transactionRollback()

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", `failed to leave chat {id: ${chat.id}}`, StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    async deleteChat({ chat, userId }: DeleteChatParams): Promise<DeleteChatRet> {
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

            // check if the user has permission to delete the chat
            // role: 'admin'
            const chatMembersRepo = new ChatMemberRepository(await this.#db.getConnection())
            const chatMbr = await chatMembersRepo.find({
                user_id: userId,
                chat_id: chat.id
            })
            if (chatMbr === null) {
                throw new WorkmateError("USER_ERROR", `user is not a member of chat`, StatusCodes.UNAUTHORIZED)
            }
            if (chatMbr.role !== 'admin') {
                throw new WorkmateError("USER_ERROR", `failed to delete (only admins can delete the chat)`, StatusCodes.UNAUTHORIZED)
            }

            // delete the chat
            const chatRepo = new ChatRepository(await this.#db.getConnection())
            await chatRepo.delete({ id: chat.id })

            return {
                success: true,
                message: `chat deleted successfully`
            }

        } catch (err) {
            await this.#db.transactionRollback()

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", `failed to delete chat {id: ${chat.id}}`, StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    // NOTE: ********************************WORKSPACE Related Functions********************************
    async getWorkspaceMembers({ workspaceId, userId }: GetWorkspaceMembersParams): Promise<GetWorkspaceMembersRet> {
        try {
            // make sure that the user is authorized to recieve the workspace members info
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
                            id: usr.id,
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
            // make sure that the user is authorized to recieve the workspace info
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

    async modifyWorkspaceMember({ workspaceId, userId, member }: ModifyWorkspaceMemberParams): Promise<RemoveWorkspaceMemberRet> {
        try {
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())

            const wkspc = await wkspcRepo.findById(workspaceId)
            if (wkspc === null) {
                throw new WorkmateError("USER_ERROR", `workspace not found, make sure the Workspace ID is valid`, StatusCodes.BAD_REQUEST)
            }

            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            // checking if the user initiating the modification is 'admin' or not
            const user = await mbrsRepo.find({ user_id: userId, workspace_id: workspaceId })
            if (!user) {
                throw new WorkmateError("USER_ERROR", `user is not a member of workspace`, StatusCodes.UNAUTHORIZED)
            }
            if (user.role !== 'admin') {
                throw new WorkmateError("USER_ERROR", `no access to modify workspace data`, StatusCodes.UNAUTHORIZED)
            }

            await mbrsRepo.update({
                role: member.role,
                workspace_id: workspaceId,
                user_id: member.user_id,
            })

            return {
                success: true,
                message: `user data modified successfully`
            }

        } catch (err) {

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", `failed to modify user data `, StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }

    }

    async removeWorkspaceMember({ workspaceId, userId, member }: RemoveWorkspaceMember): Promise<RemoveWorkspaceMemberRet> {
        try {
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())

            const wkspc = await wkspcRepo.findById(workspaceId)
            if (wkspc === null) {
                throw new WorkmateError("USER_ERROR", `workspace not found, make sure the Workspace ID is valid`, StatusCodes.BAD_REQUEST)
            }

            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            // checking if the user initiating the modification is 'admin' or not
            const user = await mbrsRepo.find({ user_id: userId, workspace_id: workspaceId })
            if (!user) {
                throw new WorkmateError("USER_ERROR", `user is not a member of workspace`, StatusCodes.UNAUTHORIZED)
            }
            if (user.role !== 'admin') {
                throw new WorkmateError("USER_ERROR", `no access to remove workspace member`, StatusCodes.UNAUTHORIZED)
            }

            await this.leaveWorkspace({workspaceId, userId: member.user_id})

            return {
                success: true,
                message: `member removed from the workspace successfully`
            }

        } catch (err) {

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", `failed to remove workspace member`, StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

    async leaveWorkspace({ workspaceId, userId }: LeaveWorkspaceParams): Promise<RemoveWorkspaceMemberRet> {
        try {
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())

            const wkspc = await wkspcRepo.findById(workspaceId)
            if (wkspc === null) {
                throw new WorkmateError("USER_ERROR", `workspace not found, make sure the Workspace ID is valid`, StatusCodes.BAD_REQUEST)
            }

            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            await mbrsRepo.delete({
                workspace_id: workspaceId,
                user_id: userId,
            })

            return {
                success: true,
                message: `user left the workspace successfully`
            }

        } catch (err) {

            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", `failed to leave workspace {id: ${workspaceId}}`, StatusCodes.INTERNAL_SERVER_ERROR);
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


    // NOTE: ********************************MESSAGE related functions********************************
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

    async getChatMessages({ workspaceId, userId, chatId }: GetChatMessagesParams): Promise<GetChatMessagesRet> {
        try {
            // make sure that the user is authorized to recieve the messages
            const mbrsRepo = new WorkspaceMemberRepository(await this.#db.getConnection())

            // checking if the user is the member of workspace.
            const mbr = await mbrsRepo.find({
                workspace_id: workspaceId,
                user_id: userId,
            })
            if (mbr === null) {
                throw new WorkmateError('USER_ERROR', `user is not a member of workspace, and the workspace is not public`, StatusCodes.UNAUTHORIZED);
            }

            // check if the user is member of chat
            const chatMembersRepo = new ChatMemberRepository(await this.#db.getConnection())
            const chatMbr = await chatMembersRepo.find({ chat_id: chatId, user_id: userId })
            if (chatMbr === null) {
                throw new WorkmateError('USER_ERROR', `user is not a member of chat`, StatusCodes.UNAUTHORIZED);
            }

            // retrieve all the messages of the chat
            const msgRepo = new MessageRepository(await this.#db.getConnection())

            const messages = await msgRepo.findByChatId({ chat_id: chatId })

            const filteredMsgs = messages.filter(msg => msg.is_deleted === 0)

            return {
                success: true,
                message: `messages for workspace with id: ${workspaceId} and chat with id: ${chatId} retrieved successfully`,
                data: {
                    workspace: {
                        id: workspaceId,
                    },
                    chat: {
                        id: chatId,
                    },
                    messages: filteredMsgs,
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

    async deleteMessage({ userId, messageId }: DeleteChatMessageParams): Promise<DeleteChatMessageRet> {
        try {
            const msgRepo = new MessageRepository(await this.#db.getConnection())

            // checks if msg is in the db
            const msg = await msgRepo.findById({ message_id: messageId })
            if (msg === null) {
                throw new WorkmateError("USER_ERROR", `message with id: ${messageId} not found`, StatusCodes.BAD_REQUEST)
            }

            // checks if the user deleting the msg is the sender.
            if (msg.sender_id !== userId) {
                throw new WorkmateError("USER_ERROR", `failed to delete message`, StatusCodes.UNAUTHORIZED)
            }

            await msgRepo.delete({ message_id: messageId })

            return {
                success: true,
                message: `message with id: ${messageId} successfully deleted`,
            }

        } catch (err) {
            if (!(err instanceof WorkmateError)) {
                logger.error(err);
                throw new WorkmateError("INTERNAL_ERROR", "failed to get workspace members", StatusCodes.INTERNAL_SERVER_ERROR);
            }
            throw err;
        }
    }

}

export default Workmate;
