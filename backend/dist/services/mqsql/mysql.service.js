"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Database_instances, _Database_database, _Database_MAX_RETRIES, _Database_connect;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const logger_js_1 = __importDefault(require("../../logger.js"));
const createTableQueries_js_1 = require("./queries/createTableQueries.js");
const deleteTableQueries_js_1 = require("./queries/deleteTableQueries.js");
const zod_js_1 = __importDefault(require("../../zod.js"));
class Database {
    constructor() {
        _Database_instances.add(this);
        _Database_database.set(this, null);
        _Database_MAX_RETRIES.set(this, 10);
        __classPrivateFieldGet(this, _Database_instances, "m", _Database_connect).call(this)
            .then(() => {
        });
    }
    async initializeDatabase() {
        // await this.deleteTable("message_recipients")
        // await this.deleteTable("chat_members")
        // await this.deleteTable("workspace_members")
        // await this.deleteTable("messages")
        // await this.deleteTable("chats")
        // await this.deleteTable("workspaces")
        // await this.deleteTable("users")
        await this.createTable("users");
        await this.createTable("workspaces");
        await this.createTable("chats");
        await this.createTable("messages");
        await this.createTable("workspace_members");
        await this.createTable("chat_members");
        await this.createTable("message_recipients");
        logger_js_1.default.info("All required tables are initialized");
    }
    async startTransaction() {
        try {
            await (await this.getConnection()).beginTransaction();
            logger_js_1.default.info("***transaction started***");
        }
        catch (err) {
            logger_js_1.default.error("***transaction failed to start***");
            throw err;
        }
    }
    async transactionCommit() {
        try {
            await (await this.getConnection()).commit();
            logger_js_1.default.info("***transaction commited***");
        }
        catch (err) {
            logger_js_1.default.error("***transaction commit failed***");
            throw err;
        }
    }
    async transactionRollback() {
        try {
            await (await this.getConnection()).rollback();
            logger_js_1.default.info("***transaction rollback successfull***");
            return;
        }
        catch (err) {
            logger_js_1.default.error("***transaction rollback failed***");
            throw err;
        }
    }
    async getConnection() {
        return await __classPrivateFieldGet(this, _Database_instances, "m", _Database_connect).call(this);
    }
    async close() {
        if (__classPrivateFieldGet(this, _Database_database, "f")) {
            await __classPrivateFieldGet(this, _Database_database, "f").end();
            logger_js_1.default.info("Database connection closed.");
        }
    }
    async createTable(table) {
        let query = "";
        switch (table) {
            case "users":
                query = (0, createTableQueries_js_1.createUsersTableQ)();
                break;
            case "workspaces":
                query = (0, createTableQueries_js_1.createWorkspacesTableQ)();
                break;
            case "chats":
                query = (0, createTableQueries_js_1.createChatsTableQ)();
                break;
            case "workspace_members":
                query = (0, createTableQueries_js_1.createWorkspaceMembersTableQ)();
                break;
            case "chat_members":
                query = (0, createTableQueries_js_1.createChatMembersTableQ)();
                break;
            case "messages":
                query = (0, createTableQueries_js_1.createMessagesTableQ)();
                break;
            case "message_recipients":
                query = (0, createTableQueries_js_1.createMessageRecipientsTableQ)();
                break;
        }
        logger_js_1.default.info(`creating ${table} table...`);
        __classPrivateFieldSet(this, _Database_database, await this.getConnection(), "f");
        try {
            const [result, fields] = await __classPrivateFieldGet(this, _Database_database, "f").execute(query);
            logger_js_1.default.info({ result, fields });
        }
        catch (err) {
            logger_js_1.default.error(`error creating ${table} table`);
            throw err;
        }
    }
    async deleteTable(table) {
        let query = ``;
        switch (table) {
            case "users":
                query = (0, deleteTableQueries_js_1.deleteUserTable)();
                break;
            case "workspaces":
                query = (0, deleteTableQueries_js_1.deleteWorkspaceTable)();
                break;
            case "chats":
                query = (0, deleteTableQueries_js_1.deleteChatsTable)();
                break;
            case "workspace_members":
                query = (0, deleteTableQueries_js_1.deleteWorkspaceMembersTable)();
                break;
            case "chat_members":
                query = (0, deleteTableQueries_js_1.deleteChatMembersTable)();
                break;
            case "messages":
                query = (0, deleteTableQueries_js_1.deleteMessagesTable)();
                break;
            case "message_recipients":
                query = (0, deleteTableQueries_js_1.deleteMessageRecipientsTable)();
                break;
        }
        __classPrivateFieldSet(this, _Database_database, await this.getConnection(), "f");
        try {
            const [result, fields] = await __classPrivateFieldGet(this, _Database_database, "f").execute(query);
            logger_js_1.default.info(`${table} table DELETED...`);
            logger_js_1.default.info({ result, fields });
        }
        catch (err) {
            logger_js_1.default.error(`error deleting the ${table} table`);
            logger_js_1.default.error(err);
            return;
        }
    }
}
exports.Database = Database;
_Database_database = new WeakMap(), _Database_MAX_RETRIES = new WeakMap(), _Database_instances = new WeakSet(), _Database_connect = async function _Database_connect() {
    if (__classPrivateFieldGet(this, _Database_database, "f") !== null) {
        return __classPrivateFieldGet(this, _Database_database, "f");
    }
    logger_js_1.default.info("connecting to db...");
    for (let attempt = 1; attempt <= __classPrivateFieldGet(this, _Database_MAX_RETRIES, "f"); attempt++) {
        try {
            __classPrivateFieldSet(this, _Database_database, await promise_1.default.createConnection({
                host: zod_js_1.default.MYSQL_HOST,
                user: zod_js_1.default.MYSQL_USER,
                password: zod_js_1.default.MYSQL_USER_PASS,
                database: zod_js_1.default.MYSQL_DATABASE,
                port: +zod_js_1.default.MYSQL_PORT,
            }), "f");
            logger_js_1.default.info(`connected to MySQL database "${zod_js_1.default.MYSQL_DATABASE}" with id: ${__classPrivateFieldGet(this, _Database_database, "f").threadId}.`);
            return __classPrivateFieldGet(this, _Database_database, "f");
        }
        catch (err) {
            logger_js_1.default.error(`Connection attempt ${attempt} failed.`);
            logger_js_1.default.error(err);
            if (attempt == __classPrivateFieldGet(this, _Database_MAX_RETRIES, "f")) {
                logger_js_1.default.error("Max retries reached. Stopping server.");
                process.exit(1);
            }
            await new Promise(res => setTimeout(res, 2000)); // wait before retry
        }
    }
    logger_js_1.default.error(`couldn't connect to MySQL database "${zod_js_1.default.MYSQL_DATABASE}."`);
    process.exit(1);
};
const db = new Database();
exports.default = db;
