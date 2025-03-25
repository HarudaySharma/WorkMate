import WorkspaceRepository from "../mqsql/WorkspaceRepository.service";
import MemberRepository from "../mqsql/MemberRepository.service";
import { Database } from "../mqsql/mysql.service";
import { Errorr } from "../../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import logger from "../../logger";
import { runInThisContext } from "node:vm";
import { startupSnapshot } from "node:v8";

interface CreateWorkspaceParams {
    name: string;
    creatorId: number;
    inviteLink: string;
}

type ERROR_TYPE = "USER_ERROR" | "INTERNAL_ERROR";

class WorkmateError {
    type: ERROR_TYPE;
    message: string | undefined;
    httpStatusCode: number | undefined;

    constructor(type: ERROR_TYPE, message?: string, httpStatusCode?: number) {
        this.httpStatusCode = httpStatusCode;
        this.type = type;
        this.message = message;
    }
}

class WorkmateReturnObj {
    success: boolean;
    message: string | undefined;

    constructor(success: boolean, message?: string) {
        this.success = success;
        this.message = message;
    }

}

interface JoinWorkspaceParams {
    userId: number;
    inviteLink: string;
}

class Workmate {
    // how should it perform the task?
    #db: Database

    constructor(db: Database) {
        this.#db = db;
    }

    async joinWorkspace({ userId, inviteLink }: JoinWorkspaceParams): Promise<WorkmateReturnObj | WorkmateError> {
        try {
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection())

            await this.#db.startTransaction()

            const wkspc = await wkspcRepo.findByInviteLink(inviteLink)
            if (wkspc === null) {
                await this.#db.transactionRollback()

                return new WorkmateError("USER_ERROR", "workspace not found, make sure your invite link is valid", StatusCodes.BAD_REQUEST)
            }

            const mbrsRepo = new MemberRepository(await this.#db.getConnection())
            await mbrsRepo.add({
                user_id: userId,
                workspace_id: wkspc.id,
                role: "user",
            })

            await this.#db.transactionCommit()

            return new WorkmateReturnObj(true, "user joined the workspace")

        } catch (err) {
            await this.#db.transactionRollback()

            logger.error(err)
            return new WorkmateError("INTERNAL_ERROR", "failed to join workspace", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async createWorkspace({ name, creatorId, inviteLink }: CreateWorkspaceParams): Promise<WorkmateReturnObj | WorkmateError> {
        try {
            await this.#db.startTransaction()

            // create the workspace
            const wkspcRepo = new WorkspaceRepository(await this.#db.getConnection());

            // checking if the workspace with the name is already created by the user
            let wkspc = await wkspcRepo.find({
                creator_id: creatorId,
                name: name,
            });

            if (wkspc !== null) {
                await this.#db.transactionRollback()
                return new WorkmateError("USER_ERROR", `workspace with name: ${name} is already present, please choose different name`, StatusCodes.BAD_REQUEST)
            }


            await wkspcRepo.createWorkspace(name, creatorId, inviteLink);

            // get the newly created workspace
            wkspc = await wkspcRepo.find({
                creator_id: creatorId,
                name: name,
            });

            if (wkspc === null) {
                await this.#db.transactionRollback()
                return new WorkmateError("INTERNAL_ERROR", "failed to find workspace", StatusCodes.INTERNAL_SERVER_ERROR)
            }


            const mbrsRepo = new MemberRepository(await this.#db.getConnection());
            await mbrsRepo.add({
                workspace_id: wkspc.id,
                user_id: creatorId,
                role: "admin",
            })

            await this.#db.transactionCommit()

            return new WorkmateReturnObj(true, "workspace created successfully")

        } catch (err) {
            await this.#db.transactionRollback()

            logger.error(err)

            return new WorkmateError("INTERNAL_ERROR", "failed to create workspace", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
    // create workspaces?
    // patch ----?


    //


}

export default Workmate;
