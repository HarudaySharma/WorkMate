import mysql, { Connection } from "mysql2/promise"
import logger from "../../logger.js"


var database: Connection | null = null;

export const connectToDb = async () => {
    try {
        database = await mysql.createConnection({
            host: 'localhost',
            user: 'harud',
            password: '123',
            database: 'db',
        })
        logger.info(`connected to mysql db with id: ${database.threadId}`)

    } catch (err) {
        logger.error("error connection to mysql database")
        logger.error(err)
    }
}

export const createUserTable = async () => {
    logger.info("creating user table...")

    const userTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,

        name VARCHAR(100),
        username VARCHAR(100) UNIQUE NOT NULL,

        email VARCHAR(100) UNIQUE NOT NULL,
        email_verified TINYINT(1) DEFAULT 0, -- Boolean field with default value (0 = false)

        hashed_password TEXT NOT NULL,
        hash_salt CHAR(10) NOT NULL,

        profile_picture VARCHAR(2083) DEFAULT "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y", -- maximum url length is 2083 in most of the browsers

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`

    if (database === null) {
        logger.error("database is not defined, check database connection")
        return
    }

    try {
        const [result, fields] = await database.execute(userTableQuery)
        logger.info({ result, fields })
    } catch (err) {
        logger.error("error creating user table")
        logger.error(err)
        return
    }
}

export const deleteUserTable = async () => {
    logger.info("deleting user table...")

    const deleteQuery = `
        DROP TABLE users;
    `

    if (database === null) {
        logger.error("database is not defined, check database connection")
        return
    }

    try {
        const [result, fields] = await database.execute(deleteQuery)
        logger.info({ result, fields })
    } catch (err) {
        logger.error("error deleting the user table");
        logger.error(err)
        return
    }
}

export default database;

