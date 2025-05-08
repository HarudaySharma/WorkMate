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
var _MemberRepository_database;
Object.defineProperty(exports, "__esModule", { value: true });
const logger_js_1 = __importDefault(require("../../logger.js"));
const memberQueries_js_1 = require("./queries/memberQueries.js");
class MemberRepository {
    constructor(db) {
        _MemberRepository_database.set(this, void 0);
        __classPrivateFieldSet(this, _MemberRepository_database, db, "f");
    }
    async add(member) {
        //await this.#database.connect() // makes sure that the database is connected
        try {
            const [rows] = await __classPrivateFieldGet(this, _MemberRepository_database, "f").execute(memberQueries_js_1.ADD_MEMBER, [
                member.user_id,
                member.workspace_id,
                member.role || "",
            ]);
            const header = rows;
            if (header.affectedRows !== 1) {
                throw new Error("failed to insert member into db");
            }
            logger_js_1.default.info("operation successfull (added member to db)");
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute INSERT query on db");
        }
    }
    async findByWkspcId(member) {
        // await this.#database.connect() // makes sure that the database is connected
        try {
            const [rows] = await __classPrivateFieldGet(this, _MemberRepository_database, "f").execute(memberQueries_js_1.FIND_MEMBERS_BY_WORKSPACE_ID, [
                member.workspace_id,
            ]);
            if (!Array.isArray(rows)) {
                return null;
            }
            if (rows.length == 0) {
                return null;
            }
            return rows;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute query on db");
        }
    }
    async find(member) {
        // await this.#database.connect() // makes sure that the database is connected
        try {
            const [rows] = await __classPrivateFieldGet(this, _MemberRepository_database, "f").execute(memberQueries_js_1.FIND_MEMBER, [
                member.user_id, member.workspace_id,
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
    async delete(member) {
        // await this.#database.connect() // makes sure that the database is connected
        logger_js_1.default.info("deleting member...");
        try {
            const [rows] = await __classPrivateFieldGet(this, _MemberRepository_database, "f").execute(memberQueries_js_1.DELETE_MEMBER, [
                member.user_id, member.workspace_id,
            ]);
            const header = rows;
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete member {user_id: ${member.user_id}, workspace_id: ${member.workspace_id}} from db`);
            }
            logger_js_1.default.info(`Deleted member {user_id: ${member.user_id}, workspace_id: ${member.workspace_id}} from db`);
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute DELETE query on db");
        }
    }
}
_MemberRepository_database = new WeakMap();
exports.default = MemberRepository;
