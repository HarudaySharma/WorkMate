import { Connection, ResultSetHeader } from "mysql2/promise";
import { Message } from "../../database_schema.js";
import logger from "../../logger.js";
import { ADD_MESSAGE, DELETE_MESSAGE, FIND_MESSAGES_BY_CHAT_ID } from "./queries/messageQueries.js";

class MessageRepository {
    #database: Connection

    constructor(db: Connection) {
        this.#database = db
    }

    async add(message: Omit<Message, "created_at">): Promise<Pick<Message, "message_id">> {
        try {
            const [rows] = await this.#database.execute(ADD_MESSAGE, [
                message.sender_id, message.reciever_id, message.chat_id,
                message.type, message.text, message.image, message.audio,
            ])

            if (!rows || !Array.isArray(rows) || rows.length === 0) {
                throw new Error("Failed to retrieve message_id after insertion.");
            }

            const message_id = (rows[0] as { message_id: string })

            if (message_id === undefined) {
                throw new Error("Failed to retrieve message_id after insertion.");
            }

            logger.info("operation successfull (added message to db)")

            return message_id;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute INSERT query on db")
        }
    }


    async findByChatId(message: Pick<Message, "chat_id">) {
        try {
            const [rows] = await this.#database.execute(FIND_MESSAGES_BY_CHAT_ID, [
                message.chat_id,
            ])

            if (!Array.isArray(rows)) {
                return null;
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
