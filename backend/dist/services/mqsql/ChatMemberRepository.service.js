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
var _ChatMemberRepository_database;
Object.defineProperty(exports, "__esModule", { value: true });
const logger_js_1 = __importDefault(require("../../logger.js"));
const chatMembersQueries_js_1 = require("./queries/chatMembersQueries.js");
class ChatMemberRepository {
    constructor(db) {
        _ChatMemberRepository_database.set(this, void 0);
        __classPrivateFieldSet(this, _ChatMemberRepository_database, db, "f");
    }
    async add(chatMember) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _ChatMemberRepository_database, "f").execute(chatMembersQueries_js_1.ADD_CHAT_MEMBER, [
                chatMember.chat_id,
                chatMember.user_id,
                chatMember.role,
            ]);
            const header = rows;
            if (header.affectedRows !== 1) {
                throw new Error("failed to insert chat member into db");
            }
            logger_js_1.default.info("operation successfull (added chat member to db)");
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute INSERT query on db");
        }
    }
    async findByChatId(chatMember) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _ChatMemberRepository_database, "f").execute(chatMembersQueries_js_1.FIND_CHAT_MEMBERS_BY_CHAT_ID, [
                chatMember.chat_id,
            ]);
            if (!Array.isArray(rows)) {
                throw new Error("unexpected database response when selecting chats from database");
            }
            return rows;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute query on db");
        }
    }
    async findByUserId(chat) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _ChatMemberRepository_database, "f").execute(chatMembersQueries_js_1.FIND_CHAT_MEMBERS_BY_USER_ID, [
                chat.user_id,
            ]);
            if (!Array.isArray(rows)) {
                throw new Error("unexpected database response when selecting chats from database");
            }
            return rows;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute query on db");
        }
    }
    async find(chatMember) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _ChatMemberRepository_database, "f").execute(chatMembersQueries_js_1.FIND_CHAT_MEMBER, [
                chatMember.user_id,
                chatMember.chat_id,
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
    async delete(chatMember) {
        logger_js_1.default.info("deleting chat member...");
        try {
            const [rows] = await __classPrivateFieldGet(this, _ChatMemberRepository_database, "f").execute(chatMembersQueries_js_1.DELETE_CHAT_MEMBER, [
                chatMember.user_id,
                chatMember.chat_id,
            ]);
            const header = rows;
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete chat member {user_id: ${chatMember.user_id}, chat_id: ${chatMember.chat_id}} from db`);
            }
            logger_js_1.default.info(`Deleted chat member {user_id: ${chatMember.user_id}, chat_id: ${chatMember.chat_id}} from db`);
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute DELETE query on db");
        }
    }
}
_ChatMemberRepository_database = new WeakMap();
exports.default = ChatMemberRepository;
