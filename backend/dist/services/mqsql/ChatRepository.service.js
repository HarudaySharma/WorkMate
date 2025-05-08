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
var _ChatRepository_database;
Object.defineProperty(exports, "__esModule", { value: true });
const logger_js_1 = __importDefault(require("../../logger.js"));
const chatQueries_js_1 = require("./queries/chatQueries.js");
class ChatRepository {
    constructor(db) {
        _ChatRepository_database.set(this, void 0);
        __classPrivateFieldSet(this, _ChatRepository_database, db, "f");
    }
    async add(chat) {
        try {
            const [result] = await __classPrivateFieldGet(this, _ChatRepository_database, "f").execute(chatQueries_js_1.ADD_CHAT, [
                chat.name,
                chat.type,
                chat.workspace_id,
            ]);
            const header = result;
            const insertedId = header.insertId;
            if (!insertedId) {
                throw new Error("Failed to retrieve message_id after insertion.");
            }
            logger_js_1.default.info("operation successfull (added chat to db)");
            return { id: insertedId };
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute INSERT query on db");
        }
    }
    async findByWkspcId(chat) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _ChatRepository_database, "f").execute(chatQueries_js_1.FIND_CHATS_BY_WORKSPACE_ID, [
                chat.workspace_id,
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
    async find(chat) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _ChatRepository_database, "f").execute(chatQueries_js_1.FIND_CHAT, [
                chat.id,
            ]);
            if (!Array.isArray(rows)) {
                throw new Error("unexpected database response when selecting chats from database");
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
    async delete(chat) {
        logger_js_1.default.info("deleting chat...");
        try {
            const [rows] = await __classPrivateFieldGet(this, _ChatRepository_database, "f").execute(chatQueries_js_1.DELETE_CHAT, [
                chat.id,
            ]);
            const header = rows;
            if (header.affectedRows !== 1) {
                throw new Error(`failed to delete chat {chat_id: ${chat.id}} from db`);
            }
            logger_js_1.default.info(`Deleted chat {chat_id: ${chat.id}} from db`);
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute DELETE query on db");
        }
    }
}
_ChatRepository_database = new WeakMap();
exports.default = ChatRepository;
