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
var _UserRepository_database;
Object.defineProperty(exports, "__esModule", { value: true });
const userQueries_js_1 = require("./queries/userQueries.js");
const logger_js_1 = __importDefault(require("../../logger.js"));
class UserRepository {
    constructor(db) {
        _UserRepository_database.set(this, void 0);
        __classPrivateFieldSet(this, _UserRepository_database, db, "f");
    }
    async findById(userId) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _UserRepository_database, "f").execute(userQueries_js_1.FIND_USER_BY_ID, [
                userId,
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
    async find(user) {
        //await this.#database.connect() // makes sure that the database is connected
        if (__classPrivateFieldGet(this, _UserRepository_database, "f") === null) { // still not connected to db (check the server logs)
            throw new Error("failed to connect to database");
        }
        try {
            const [rows] = await __classPrivateFieldGet(this, _UserRepository_database, "f").execute(userQueries_js_1.FIND_USER, [
                user.username || "",
                user.email || "",
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
    async add(user) {
        // await this.#database.connect() // makes sure that the database is connected
        if (__classPrivateFieldGet(this, _UserRepository_database, "f") === null) { // still not connected to db (check the server logs)
            throw new Error("failed to connect to database");
        }
        logger_js_1.default.info("adding user to the db...");
        try {
            const [rows] = await __classPrivateFieldGet(this, _UserRepository_database, "f").execute(userQueries_js_1.ADD_USER, [
                user.name || user.username || "",
                user.username || "",
                user.email,
                user.hashed_password,
                user.hash_salt,
                user.profile_picture,
            ]);
            const header = rows;
            if (header.affectedRows !== 1) {
                throw new Error("failed to insert user into db");
            }
            logger_js_1.default.info("operation successfull (added user to db)");
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to INSERT execute query on db");
        }
    }
    async delete(user) {
        //await this.#database.connect();
        if (__classPrivateFieldGet(this, _UserRepository_database, "f") === null) { // still not connected to db (check the server logs)
            throw new Error("failed to connect to database");
        }
        logger_js_1.default.info("deleting user...");
        try {
            const [rows] = await __classPrivateFieldGet(this, _UserRepository_database, "f").execute(userQueries_js_1.DELETE_USER, [
                user.username,
                user.email,
            ]);
            const header = rows;
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete user {username: ${user.username}, email: ${user.email}} from db`);
            }
            logger_js_1.default.info(`Deleted user {username: ${user.username}, email: ${user.email}} from db`);
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute DELETE query on db");
        }
    }
}
_UserRepository_database = new WeakMap();
exports.default = UserRepository;
