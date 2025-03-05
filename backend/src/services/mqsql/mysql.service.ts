import mysql, { Connection, ResultSetHeader } from "mysql2/promise"
import logger from "../../logger.js"
import { createUserTable as createUserTableQ } from "./queries/createTableQueries.js";
import { deleteUserTable } from "./queries/deleteTableQueries.js";
import { User } from "../../database_schema.js";

type Table = "user" | "workspace" | "chat" | "message"

class Database {
    #database: Connection | null = null

    //TODO: for connection retries to db
    // #MAX_RETRIES = 10
    // #retryCount = 0

    constructor() {
        this.connect();
    }

    async connect() {
        logger.info("connecting to db...")

        if (this.#database !== null) {
            logger.info("db already connected")
            return this.#database;
        }

        try {
            this.#database = await mysql.createConnection({
                host: 'localhost',
                user: 'harud',
                password: '123',
                database: 'db',
            })

            logger.info(`connected to mysql db with id: ${this.#database.threadId}`)

            return this.#database
        }
        catch (err) {
            logger.error("error connecting to mysql database")
            console.log(err)

            logger.info("database not connecting, Stopping the server")
            process.exit(1)
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

        if (this.#database === null) {
            try {
                this.#database = await this.connect();
            }
            catch (err) {
                logger.error("database is not defined, check database connection")
                logger.error(err)
                return;
            }
        }

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


        await this.connect() // makes sure that the database is connected
        if (this.#database === null) { // still not connected to db (check the server logs)
            return
        }

        try {
            const [result, fields] = await this.#database!.execute(query)
            logger.info({ result, fields })
        } catch (err) {
            logger.error(`error deleting the ${table} table`);
            logger.error(err)
            return
        }
    }

    async findUser(user: Partial<Pick<User, "username" | "email">>) {
        await this.connect() // makes sure that the database is connected

        if (this.#database === null) { // still not connected to db (check the server logs)
            throw new Error("failed to connect to database")
        }

        const query = `SELECT * FROM users WHERE username = ? or email = ?;`

        try {
            const [rows] = await this.#database.execute(query, [
                user.username || "",
                user.email || "",
            ])

            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }

            return rows[0] as User;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }

    async addUser(user: Partial<User>) {
        await this.connect() // makes sure that the database is connected

        if (this.#database === null) { // still not connected to db (check the server logs)
            throw new Error("failed to connect to database")
        }

        logger.info("adding user to the db...")

        const query = `INSERT INTO users (name, username, email, hashed_password, hash_salt, profile_picture) VALUES (?, ?, ?, ?, ?, ?);`
        try {
            const [rows] = await this.#database.execute(query, [
                user.name || user.username || "",
                user.username || "",
                user.email,
                user.hashed_password,
                user.hash_salt,
                user.profile_picture,
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error("failed to insert user into db")
            }

            logger.info("operation successfull (added user to db)")

            return;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to INSERT execute query on db")
        }
    }

    async deleteUser(user: Partial<Pick<User, "username" | "email">>) {
        await db.connect();

        if (this.#database === null) { // still not connected to db (check the server logs)
            throw new Error("failed to connect to database")
        }

        logger.info("deleting user...")

        const query = `DELETE FROM users where username = ? or email = ?`
        try {
            const [rows] = await this.#database.execute(query, [
                user.username,
                user.email,
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete user ${user} from db`)
            }

            logger.info(`operation successfull (deleted user ${user} from db)`)

            return
        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute DELETE query on db")
        }
    }
}

const db = new Database();
export default db;

