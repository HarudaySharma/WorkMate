import { Connection, ResultSetHeader } from "mysql2/promise";
import { Message, MessageRecipient } from "../../database_schema.js";
import logger from "../../logger.js";
import { ADD_MESSAGE_RECIPIENT, DELETE_MESSAGE_RECIPIENT_BY_MESSAGE_ID, DELETE_SINGLE_MESSAGE_RECIPIENT, FIND_MESSAGES_RECIPIENT_BY_MESSAGE_ID } from "./queries/messageRecipientQueries.js";

class MessageRecipientRepository {
    #database: Connection

    constructor(db: Connection) {
        this.#database = db
    }

    async add(msgRecpt: Omit<MessageRecipient, "is_read" | "read_at">) {
        try {
            const [rows] = await this.#database.execute(ADD_MESSAGE_RECIPIENT, [
                msgRecpt.message_id, msgRecpt.user_id
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows === 0) {
                throw new Error(`Failed to INSERT message_recipient: message_id=${msgRecpt.message_id}, user_id=${msgRecpt.user_id}`)
            }

            logger.info(`operation successfull, INSERTED message_recipient: message_id=${msgRecpt.message_id}, user_id=${msgRecpt.user_id}`)

            return

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute INSERT query on db")
        }
    }

    async findByMessageId(msgRecpt: Pick<MessageRecipient, "message_id">) {
        try {
            const [rows] = await this.#database.execute(FIND_MESSAGES_RECIPIENT_BY_MESSAGE_ID, [
                msgRecpt.message_id,
            ])

            if (!Array.isArray(rows)) {
                return null;
            }

            return rows as Message[];

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute SELECT query on db")
        }
    }

    async removeRecipientsByMessageId(msgRecpt: Pick<MessageRecipient, "message_id">) {

        logger.info("deleting message recipient...")

        try {
            const [rows] = await this.#database.execute(DELETE_MESSAGE_RECIPIENT_BY_MESSAGE_ID, [
                msgRecpt.message_id
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows === 0) {
                throw new Error(`Failed to DELETE message recipients: message_id=${msgRecpt.message_id}`)
            }

            logger.info(`opeation succcessfull, DELETED message recipients: message_id=${msgRecpt.message_id}`)

            return
        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute DELETE query on db")
        }
    }


    async removeRecipientByUserId(msgRecpt: Pick<MessageRecipient, "user_id">) {

        logger.info("deleting message recipient...")

        try {
            const [rows] = await this.#database.execute(DELETE_SINGLE_MESSAGE_RECIPIENT, [
                msgRecpt.user_id
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows === 0) {
                throw new Error(`Failed to DELETE message recipient: user_id=${msgRecpt.user_id}`)
            }

            logger.info(`opeation succcessfull, DELETED message recipient: user_id=${msgRecpt.user_id}`)

            return
        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute DELETE query on db")
        }
    }

}

export default MessageRecipientRepository;
