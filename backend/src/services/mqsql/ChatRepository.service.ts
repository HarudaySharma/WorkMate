import { Connection, QueryResult, ResultSetHeader } from "mysql2/promise";
import { Chat } from "../../database_schema.js";
import logger from "../../logger.js";
import { ADD_CHAT, DELETE_CHAT, FIND_CHAT, FIND_CHATS_BY_WORKSPACE_ID } from "./queries/chatQueries.js";

class ChatRepository {
    #database: Connection

    constructor(db: Connection) {
        this.#database = db
    }

    async add(chat: Omit<Chat, "id" | "last_message_at">): Promise<Pick<Chat, "id">> {
        try {
            const [result] = await this.#database.execute(ADD_CHAT, [
                chat.name,
                chat.type,
                chat.workspace_id,
            ])

            // FIX: the ADD_CHAT query (MySQL doesn't support RETURNING keyword)
            const header = result as ResultSetHeader

            const insertedId = header.insertId
            if (!insertedId) {
                throw new Error("Failed to retrieve message_id after insertion.");
            }

            logger.info("operation successfull (added chat to db)")

            return { id: insertedId };

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute INSERT query on db")
        }
    }


    async findByWkspcId(chat: Pick<Chat, "workspace_id">) {
        try {
            const [rows] = await this.#database.execute(FIND_CHATS_BY_WORKSPACE_ID, [
                chat.workspace_id,
            ])

            if (!Array.isArray(rows)) {
                throw new Error("unexpected database response when selecting chats from database")
            }

            return rows as Chat[];

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }

    async find(chat: Pick<Chat, "id">) {
        try {
            const [rows] = await this.#database.execute(FIND_CHAT, [
                chat.id,
            ])

            if (!Array.isArray(rows)) {
                throw new Error("unexpected database response when selecting chats from database")
            }
            if (rows.length == 0) {
                return null;
            }

            return rows[0] as Chat;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }


    async delete(chat: Pick<Chat, "id">) {

        logger.info("deleting chat...")

        try {
            const [rows] = await this.#database.execute(DELETE_CHAT, [
                chat.id,
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete chat {chat_id: ${chat.id}} from db`)
            }

            logger.info(`Deleted chat {chat_id: ${chat.id}} from db`)

            return
        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute DELETE query on db")
        }
    }

}

export default ChatRepository;
