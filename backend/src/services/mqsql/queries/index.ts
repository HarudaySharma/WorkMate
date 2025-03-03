import { User } from "../../../database_schema.js"
import logger from "../../../logger.js"
import database from "../mysql.service.js"


export const findUser = async (user: Pick<User, "username" | "email">) => {
    if (database === null) {
        return
    }

    const query = `
        SELECT *
        FROM users
        WHERE username=${user.username} OR email=${user.email};
    `

    try {
        const [result, fields] = await database.query(query)

        logger.info({result, fields});

        return fields[0];
    } catch (err) {
        logger.error(err)
        return null
    }

}
