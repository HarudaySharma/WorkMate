import { Connection, ResultSetHeader } from "mysql2/promise";
import { Member, WorkSpace } from "../../database_schema.js";
import logger from "../../logger.js";
import db from "./mysql.service.js";
import { CREATE_MEMBER, DELETE_MEMBER, FIND_MEMBER } from "./queries/memberQueries.js";

class MemberRepository {
    #database: Connection

    constructor(db: Connection) {
        this.#database = db
    }

    async createMember(member: Member) {
        await this.#database.connect() // makes sure that the database is connected

        try {
            await db.createTable("members");
            const [rows] = await this.#database.execute(CREATE_MEMBER, [
                member.user_id,
                member.workspace_id,
                member.role || "",
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error("failed to insert member into db")
            }

            logger.info("operation successfull (added member to db)")

            return;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute INSERT query on db")
        }
    }


    async findMember(member: Pick<Member, "user_id" | "workspace_id">) {
        await this.#database.connect() // makes sure that the database is connected

        try {
            await db.createTable("members");
            const [rows] = await this.#database.execute(FIND_MEMBER, [
                member.user_id, member.workspace_id,
            ])

            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }

            return rows[0] as WorkSpace;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }


    async deleteMember(member: Pick<Member, "user_id" | "workspace_id">) {
        await this.#database.connect() // makes sure that the database is connected

        logger.info("deleting member...")

        try {
            const [rows] = await this.#database.execute(DELETE_MEMBER, [
                member.user_id, member.workspace_id,
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete member {user_id: ${member.user_id}, workspace_id: ${member.workspace_id}} from db`)
            }

            logger.info(`Deleted member {user_id: ${member.user_id}, workspace_id: ${member.workspace_id}} from db`)

            return
        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute DELETE query on db")
        }
    }

}

export default MemberRepository;
