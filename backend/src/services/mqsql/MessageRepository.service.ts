import { v4 as uuidv4 } from "uuid";
import { Connection, ResultSetHeader } from "mysql2/promise";
import { Message } from "../../database_schema.js";
import logger from "../../logger.js";
import { ADD_MESSAGE, DELETE_MESSAGE, FIND_MESSAGES_BY_CHAT_ID, FIND_MESSAGES_BY_ID as FIND_MESSAGE_BY_MESSAGE_ID } from "./queries/messageQueries.js";
import { warn } from "console";

class MessageRepository {
    #database: Connection

    constructor(db: Connection) {
        this.#database = db
    }

    async add(message: Omit<Message, "created_at" | "message_id" | "is_deleted">): Promise<Pick<Message, "message_id">> {
        try {
            const id = uuidv4();
            const [result] = await this.#database.execute(ADD_MESSAGE, [
                id, message.sender_id, message.chat_id,
                message.type, message.text, message.image, message.audio,
            ])

            const header = result as ResultSetHeader
            if (header.affectedRows === 0) {
                throw new Error(`Failed to add message: message_id=${id}`)
            }

            // FIX: the ADD_MESSAGE query (MySQL doesn't support RETURNING keyword)
            logger.info(`operation successfull (added message: message_id=${id} to db)`)

            return { message_id: id };

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute INSERT query on db")
        }
    }

    async findById(message: Pick<Message, "message_id">) {
        try {
            const [rows] = await this.#database.execute(FIND_MESSAGE_BY_MESSAGE_ID, [
                message.message_id,
            ])

            if (!Array.isArray(rows)) {
                throw new Error("unexpected database response when selecting message from database")
            }
            if (rows.length == 0) {
                return null;
            }

            return rows[0] as Message;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }

    async findByChatId(message: Pick<Message, "chat_id">) {
        try {
            const [rows] = await this.#database.execute(FIND_MESSAGES_BY_CHAT_ID, [
                message.chat_id,
            ])

            if (!Array.isArray(rows)) {
                throw new Error("unexpected database response when selecting messages from database")
            }

            return rows as Message[];

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }

    async delete(message: Pick<Message, "message_id">) {

        logger.info("deleting message...")

        try {
            const [rows] = await this.#database.execute(DELETE_MESSAGE, [
                message.message_id
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows === 0) {
                throw new Error(`Failed to delete message: message_id=${message.message_id}`)
            }

            logger.info(`Deleted message: message_id=${message.message_id}`)

            return
        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute DELETE query on db")
        }
    }

}

export default MessageRepository;
