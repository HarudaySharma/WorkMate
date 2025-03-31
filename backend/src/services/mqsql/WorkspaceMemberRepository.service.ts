import { Connection, ResultSetHeader } from "mysql2/promise";
import { WorkspaceMember } from "../../database_schema.js";
import logger from "../../logger.js";
import { ADD_WORKSPACE_MEMBER, DELETE_WORKSPACE_MEMBER, FIND_WORKSPACE_MEMBER, FIND_WORKSPACE_MEMBERS_BY_WORKSPACE_ID } from "./queries/workspaceMemberQueries.js";

class WorkspaceMemberRepository {
    #database: Connection

    constructor(db: Connection) {
        this.#database = db
    }

    async add(member: WorkspaceMember) {
        //await this.#database.connect() // makes sure that the database is connected

        try {
            const [rows] = await this.#database.execute(ADD_WORKSPACE_MEMBER, [
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


    async findByWkspcId(member: Pick<WorkspaceMember, "workspace_id">) {
        // await this.#database.connect() // makes sure that the database is connected

        try {
            const [rows] = await this.#database.execute(FIND_WORKSPACE_MEMBERS_BY_WORKSPACE_ID, [
                member.workspace_id,
            ])

            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }

            return rows as WorkspaceMember[];

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }

    async find(member: Pick<WorkspaceMember, "user_id" | "workspace_id">) {
        // await this.#database.connect() // makes sure that the database is connected

        try {
            const [rows] = await this.#database.execute(FIND_WORKSPACE_MEMBER, [
                member.user_id, member.workspace_id,
            ])

            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }

            return rows[0] as WorkspaceMember;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute query on db")
        }
    }


    async delete(member: Pick<WorkspaceMember, "user_id" | "workspace_id">) {
        // await this.#database.connect() // makes sure that the database is connected

        logger.info("deleting member...")

        try {
            const [rows] = await this.#database.execute(DELETE_WORKSPACE_MEMBER, [
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

export default WorkspaceMemberRepository;
