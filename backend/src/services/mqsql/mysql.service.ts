import mysql, { Connection, ResultSetHeader } from "mysql2/promise"
import logger from "../../logger.js"
import { createUserTable as createUserTableQ } from "./queries/createTableQueries.js";
import { deleteUserTable } from "./queries/deleteTableQueries.js";
import { User } from "../../database_schema.js";
import { Errorr } from "../../middlewares/error.middleware.js";

type Table = "user" | "workspace" | "chat" | "message"

class Database {
    #database: Connection | null = null

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
            logger.error("error connection to mysql database")
            throw err;
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

    async findUser(user: Pick<User, "username" | "email">) {
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
            throw new Error("failed to execute query on db")
        }
    }
}

const db = new Database();
export default db;


// export const connectToDb = async () => {
//     try {
//         database = await mysql.createConnection({
//             host: 'localhost',
//             user: 'harud',
//             password: '123',
//             database: 'db',
//         })
//         logger.info(`connected to mysql db with id: ${database.threadId}`)
//
//     } catch (err) {
//         logger.error("error connection to mysql database")
//         logger.error(err)
//     }
// }

// export const createUserTable = async () => {
//     logger.info("creating user table...")
//
//     const userTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//
//         name VARCHAR(100),
//         username VARCHAR(100) UNIQUE NOT NULL,
//
//         email VARCHAR(100) UNIQUE NOT NULL,
//         email_verified TINYINT(1) DEFAULT 0, -- Boolean field with default value (0 = false)
//
//         hashed_password TEXT NOT NULL,
//         hash_salt CHAR(10) NOT NULL,
//
//         profile_picture VARCHAR(2083) DEFAULT "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y", -- maximum url length is 2083 in most of the browsers
//
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//     );
// `
//
//     if (database === null) {
//         logger.error("database is not defined, check database connection")
//         return
//     }
//
//     try {
//         const [result, fields] = await database.execute(userTableQuery)
//         logger.info({ result, fields })
//     } catch (err) {
//         logger.error("error creating user table")
//         logger.error(err)
//         return
//     }
// }

// export const deleteUserTable = async () => {
//     logger.info("deleting user table...")
//
//     const deleteQuery = `
//         DROP TABLE users;
//     `
//
//     if (database === null) {
//         logger.error("database is not defined, check database connection")
//         return
//     }
//
//     try {
//         const [result, fields] = await database.execute(deleteQuery)
//         logger.info({ result, fields })
//     } catch (err) {
//         logger.error("error deleting the user table");
//         logger.error(err)
//         return
//     }
// }
//

