import mysql, { Connection } from "mysql2/promise"
import logger from "../../logger.js"
import { createWorkspaceMembersTableQ, createUsersTableQ, createWorkspacesTableQ, createChatsTableQ, createChatMembersTableQ, createMessagesTableQ, createMessageRecipientsTableQ } from "./queries/createTableQueries.js";
import { deleteWorkspaceMembersTable, deleteUserTable, deleteWorkspaceTable, deleteChatMembersTable, deleteChatsTable, deleteMessagesTable, deleteMessageRecipientsTable } from "./queries/deleteTableQueries.js";
import env from "../../zod.js";

type Table = "users" | "workspaces" | "chats" | "messages" | "chat_members" | "workspace_members" | "message_recipients"

export class Database {
    #database: Connection | null = null;

    #MAX_RETRIES = 10

    constructor() {
        this.#connect()
            .then(() => {
            });
    }

    async initializeDatabase() {
        // await this.deleteTable("message_recipients")
        // await this.deleteTable("chat_members")
        // await this.deleteTable("workspace_members")
        // await this.deleteTable("messages")
        // await this.deleteTable("chats")
        // await this.deleteTable("workspaces")
        // await this.deleteTable("users")

        await this.createTable("users");
        await this.createTable("workspaces");
        await this.createTable("chats");
        await this.createTable("messages");
        await this.createTable("workspace_members");
        await this.createTable("chat_members");
        await this.createTable("message_recipients");
        logger.info("All required tables are initialized");
    }

    async #connect() {
        if (this.#database !== null) {
            return this.#database;
        }

        logger.info("connecting to db...")
        for (let attempt = 1; attempt <= this.#MAX_RETRIES; attempt++) {
            try {
                this.#database = await mysql.createConnection({
                    host: env.MYSQL_HOST,
                    user: env.MYSQL_USER,
                    password: env.MYSQL_USER_PASS,
                    database: env.MYSQL_DATABASE,
                })

                logger.info(`connected to MySQL database "${env.MYSQL_DATABASE}" with id: ${this.#database.threadId}.`)

                return this.#database
            }
            catch (err) {
                logger.error(`Connection attempt ${attempt} failed.`);
                logger.error(err)

                if (attempt == this.#MAX_RETRIES) {
                    logger.error("Max retries reached. Stopping server.");
                    process.exit(1)
                }

                await new Promise(res => setTimeout(res, 2000)) // wait before retry
            }
        }

        logger.error(`couldn't connect to MySQL database "${env.MYSQL_DATABASE}."`);
        process.exit(1)
    }

    async startTransaction() {
        try {
            await (await this.getConnection()).beginTransaction()
            logger.info("***transaction started***")
        } catch (err) {
            logger.error("***transaction failed to start***")
            throw err
        }
    }

    async transactionCommit() {
        try {
            await (await this.getConnection()).commit()
            logger.info("***transaction commited***")
        } catch (err) {
            logger.error("***transaction commit failed***")
            throw err
        }
    }

    async transactionRollback() {
        try {
            await (await this.getConnection()).rollback()
            logger.info("***transaction rollback successfull***")
            return
        } catch (err) {
            logger.error("***transaction rollback failed***")
            throw err
        }
    }

    async getConnection(): Promise<Connection> {
        return await this.#connect();
    }

    async close() {
        if (this.#database) {
            await this.#database.end();
            logger.info("Database connection closed.");
        }
    }

    async createTable(table: Table) {
        let query = "";
        switch (table) {
            case "users":
                query = createUsersTableQ()
                break
            case "workspaces":
                query = createWorkspacesTableQ()
                break
            case "chats":
                query = createChatsTableQ()
                break
            case "workspace_members":
                query = createWorkspaceMembersTableQ()
                break
            case "chat_members":
                query = createChatMembersTableQ()
                break
            case "messages":
                query = createMessagesTableQ()
                break
            case "message_recipients":
                query = createMessageRecipientsTableQ()
                break
        }

        logger.info(`creating ${table} table...`)

        this.#database = await this.getConnection()

        try {
            const [result, fields] = await this.#database.execute(query)
            logger.info({ result, fields })
        } catch (err) {
            logger.error(`error creating ${table} table`)
            throw err
        }
    }

    async deleteTable(table: Table) {

        let query = ``;
        switch (table) {
            case "users":
                query = deleteUserTable()
                break
            case "workspaces":
                query = deleteWorkspaceTable()
                break
            case "chats":
                query = deleteChatsTable()
                break
            case "workspace_members":
                query = deleteWorkspaceMembersTable()
                break;
            case "chat_members":
                query = deleteChatMembersTable()
                break;
            case "messages":
                query = deleteMessagesTable()
                break;
            case "message_recipients":
                query = deleteMessageRecipientsTable()
                break;
        }


        this.#database = await this.getConnection()

        try {
            const [result, fields] = await this.#database.execute(query)

            logger.info(`${table} table DELETED...`)
            logger.info({ result, fields })
        } catch (err) {
            logger.error(`error deleting the ${table} table`);
            logger.error(err)
            return
        }
    }

}

const db = new Database();
export default db;

