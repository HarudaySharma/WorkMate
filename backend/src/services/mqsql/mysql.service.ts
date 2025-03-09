import mysql, { Connection } from "mysql2/promise"
import logger from "../../logger.js"
import { createMembersTableQ, createUsersTableQ, createWorkspacesTableQ } from "./queries/createTableQueries.js";
import { deleteUserTable } from "./queries/deleteTableQueries.js";
import env from "../../zod.js";

type Table = "user" | "workspace" | "members" | "chat" | "message"

class Database {
    #database: Connection | null = null;

    #MAX_RETRIES = 10

    constructor() {
        this.connect()
            .then(() => {
                this.createTable("user");
                this.createTable("members");
                this.createTable("workspace");
            });
    }

    async connect() {
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

                logger.info(`connected to MySQL database with id: ${this.#database.threadId}`)

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

        logger.error("couldn't connect to MySQL database");
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
        return await this.connect();
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
            case "user":
                query = createUsersTableQ()
                break
            case "workspace":
                query = createWorkspacesTableQ()
                break
            case "members":
                query = createMembersTableQ()
                break
            case "chat":
                break
            case "message":
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
        logger.info("deleting user table...")

        let query = ``;
        switch (table) {
            case "user":
                query = deleteUserTable()
                break
            case "workspace":
                break
            case "chat":
                break
            case "message":
                break
        }

        this.#database = await this.getConnection()

        try {
            const [result, fields] = await this.#database.execute(query)
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

