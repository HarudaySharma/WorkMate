import mysql, { Connection } from "mysql2/promise"
import logger from "../../logger.js"
import { createUserTable as createUserTableQ } from "./queries/createTableQueries.js";
import { deleteUserTable } from "./queries/deleteTableQueries.js";

type Table = "user" | "workspace" | "chat" | "message"

class Database {
    #database: Connection | null = null;

    #MAX_RETRIES = 10

    constructor() {
        this.connect();
    }

    async connect() {
        if (this.#database !== null) {
            return this.#database;
        }

        logger.info("connecting to db...")
        for (let attempt = 1; attempt <= this.#MAX_RETRIES; attempt++) {
            try {
                this.#database = await mysql.createConnection({
                    host: 'localhost',
                    user: 'harud',
                    password: '123',
                    database: 'db',
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
                query = createUserTableQ()
                break
            case "workspace":
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
            logger.error(err)
            return
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

