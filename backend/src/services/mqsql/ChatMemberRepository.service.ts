import { Connection, ResultSetHeader } from "mysql2/promise";
import { ChatMember } from "../../database_schema.js";
import logger from "../../logger.js";
import { ADD_CHAT_MEMBER, DELETE_CHAT_MEMBER, FIND_CHAT_MEMBER, FIND_CHAT_MEMBERS_BY_CHAT_ID, FIND_CHAT_MEMBERS_BY_USER_ID } from "./queries/chatMembersQueries.js";

class ChatMemberRepository {
    #database: Connection

    constructor(db: Connection) {
        this.#database = db
    }

    async add(chatMember: Omit<ChatMember, "joined_at">) {
        try {
            const [rows] = await this.#database.execute(ADD_CHAT_MEMBER, [
                chatMember.chat_id,
                chatMember.user_id,
                chatMember.role,
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error("failed to insert chat member into db")
            }

            logger.info("operation successfull (added chat member to db)")

            return;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute INSERT query on db")
        }
    }


    async findByChatId(chatMember: Pick<ChatMember, "chat_id">) {
        try {
            const [rows] = await this.#database.execute(FIND_CHAT_MEMBERS_BY_CHAT_ID, [
                chatMember.chat_id,
            ])

            if (!Array.isArray(rows)) {
                return null;
            }

            return rows as ChatMember[];

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }

    async findByUserId(chat: Pick<ChatMember, "user_id">) {
        try {
            const [rows] = await this.#database.execute(FIND_CHAT_MEMBERS_BY_USER_ID, [
                chat.user_id,
            ])

            if (!Array.isArray(rows)) {
                return null;
            }

            return rows as ChatMember[];

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }

    async find(chatMember: Pick<ChatMember, "chat_id" | "user_id">) {
        try {
            const [rows] = await this.#database.execute(FIND_CHAT_MEMBER, [
                chatMember.user_id,
                chatMember.chat_id,
            ])

            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }

            return rows[0] as ChatMember;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }


    async delete(chatMember: Pick<ChatMember, "user_id" | "chat_id">) {

        logger.info("deleting chat member...")

        try {
            const [rows] = await this.#database.execute(DELETE_CHAT_MEMBER, [
                chatMember.user_id,
                chatMember.chat_id,
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete chat member {user_id: ${chatMember.user_id}, chat_id: ${chatMember.chat_id}} from db`)
            }

            logger.info(`Deleted chat member {user_id: ${chatMember.user_id}, chat_id: ${chatMember.chat_id}} from db`)

            return
        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute DELETE query on db")
        }
    }

}

export default ChatMemberRepository;
