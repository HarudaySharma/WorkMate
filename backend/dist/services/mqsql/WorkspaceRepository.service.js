"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _WorkspaceRepository_database;
Object.defineProperty(exports, "__esModule", { value: true });
const logger_js_1 = __importDefault(require("../../logger.js"));
const workspaceQueries_js_1 = require("./queries/workspaceQueries.js");
class WorkspaceRepository {
    constructor(db) {
        _WorkspaceRepository_database.set(this, void 0);
        __classPrivateFieldSet(this, _WorkspaceRepository_database, db, "f");
    }
    async createWorkspace(name, creatorId, inviteLink) {
        // await this.#database.connect() // makes sure that the database is connected
        try {
            const [rows] = await __classPrivateFieldGet(this, _WorkspaceRepository_database, "f").execute(workspaceQueries_js_1.CREATE_WORKSPACE, [
                name, creatorId, inviteLink
            ]);
            const header = rows;
            if (header.affectedRows !== 1) {
                throw new Error("failed to insert workspace into db");
            }
            logger_js_1.default.info("operation successfull (added workspace to db)");
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute INSERT query on db");
        }
    }
    //TODO:
    async findUserWorkspaces(userId) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _WorkspaceRepository_database, "f").execute(workspaceQueries_js_1.FIND_USER_WORKSPACES, [
                userId,
            ]);
            if (!Array.isArray(rows)) {
                return null;
            }
            return rows;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute query on db");
        }
    }
    async findByName(name) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _WorkspaceRepository_database, "f").execute(workspaceQueries_js_1.FIND_WORKSPACE_BY_NAME, [
                name,
            ]);
            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }
            return rows[0];
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute query on db");
        }
    }
    async findById(id) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _WorkspaceRepository_database, "f").execute(workspaceQueries_js_1.FIND_WORKSPACE_BY_ID, [
                id,
            ]);
            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }
            return rows[0];
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute query on db");
        }
    }
    async findByInviteLink(inviteLink) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _WorkspaceRepository_database, "f").execute(workspaceQueries_js_1.FIND_WORKSPACE_BY_INVITE_LINK, [
                inviteLink,
            ]);
            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }
            return rows[0];
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute query on db");
        }
    }
    async find(workspace) {
        // await this.#database.connect() // makes sure that the database is connected
        try {
            const [rows] = await __classPrivateFieldGet(this, _WorkspaceRepository_database, "f").execute(workspaceQueries_js_1.FIND_WORKSPACE, [
                workspace.creator_id, workspace.name
            ]);
            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }
            return rows[0];
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute query on db");
        }
    }
    async deleteWorkspace(workspace) {
        await __classPrivateFieldGet(this, _WorkspaceRepository_database, "f").connect(); // makes sure that the database is connected
        logger_js_1.default.info("deleting workspace...");
        try {
            const [rows] = await __classPrivateFieldGet(this, _WorkspaceRepository_database, "f").execute(workspaceQueries_js_1.DELETE_WORKSPACE, [
                workspace.id,
            ]);
            const header = rows;
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete workspace id: ${workspace.id} from db`);
            }
            logger_js_1.default.info(`Deleted workspace with id: ${workspace.id}`);
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute DELETE query on db");
        }
    }
}
_WorkspaceRepository_database = new WeakMap();
exports.default = WorkspaceRepository;
