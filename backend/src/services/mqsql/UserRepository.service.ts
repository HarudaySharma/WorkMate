import { Connection, ResultSetHeader } from "mysql2/promise";
import { User } from "../../database_schema.js";
import { ADD_USER, DELETE_USER, FIND_USER } from "./queries/userQueries.js";
import logger from "../../logger.js";

class UserRepository {
    #database: Connection

    constructor(db: Connection) {
        this.#database = db
    }

    async findUser(user: Partial<Pick<User, "username" | "email">>) {
        await this.#database.connect() // makes sure that the database is connected

        if (this.#database === null) { // still not connected to db (check the server logs)
            throw new Error("failed to connect to database")
        }

        try {
            const [rows] = await this.#database.execute(FIND_USER, [
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
        await this.#database.connect() // makes sure that the database is connected

        if (this.#database === null) { // still not connected to db (check the server logs)
            throw new Error("failed to connect to database")
        }

        logger.info("adding user to the db...")

        try {
            const [rows] = await this.#database.execute(ADD_USER, [
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
        await this.#database.connect();

        if (this.#database === null) { // still not connected to db (check the server logs)
            throw new Error("failed to connect to database")
        }

        logger.info("deleting user...")

        try {
            const [rows] = await this.#database.execute(DELETE_USER, [
                user.username,
                user.email,
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete user {username: ${user.username}, email: ${user.email}} from db`)
            }

            logger.info(`Deleted user {username: ${user.username}, email: ${user.email}} from db`);

            return
        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute DELETE query on db")
        }
    }

}

export default UserRepository;
