import { Connection, ResultSetHeader } from "mysql2/promise";
import { WorkSpace } from "../../database_schema.js";
import logger from "../../logger.js";
import { CREATE_WORKSPACE, DELETE_WORKSPACE, FIND_WORKSPACE } from "./queries/workspaceQueries.js";


class WorkspaceRepository {
    #database: Connection

    constructor(db: Connection) {
        this.#database = db
    }


    async createWorkspace(name: string, creatorId: number, inviteLink: string) {
        await this.#database.connect() // makes sure that the database is connected

        try {
            const [rows] = await this.#database.execute(CREATE_WORKSPACE, [
                name, creatorId, inviteLink
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error("failed to insert workspace into db")
            }

            logger.info("operation successfull (added workspace to db)")

            return;

        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute INSERT query on db")
        }
    }


    async findWorkspace(workspace: Pick<WorkSpace, "creator_id" | "name">) {
        await this.#database.connect() // makes sure that the database is connected

        try {
            const [rows] = await this.#database.execute(FIND_WORKSPACE, [
                workspace.creator_id, workspace.name
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


    async deleteWorkspace(workspace: Pick<WorkSpace, "id">) {
        await this.#database.connect() // makes sure that the database is connected

        logger.info("deleting workspace...")

        try {
            const [rows] = await this.#database.execute(DELETE_WORKSPACE, [
                workspace.id,
            ])

            const header = rows as ResultSetHeader
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete workspace id: ${workspace.id} from db`)
            }

            logger.info(`Deleted workspace with id: ${workspace.id}`)

            return
        } catch (err) {
            logger.error(err)
            throw new Error("failed to execute DELETE query on db")
        }
    }

}

export default WorkspaceRepository;
