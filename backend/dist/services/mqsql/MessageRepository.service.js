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
var _MessageRepository_database;
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const logger_js_1 = __importDefault(require("../../logger.js"));
const messageQueries_js_1 = require("./queries/messageQueries.js");
class MessageRepository {
    constructor(db) {
        _MessageRepository_database.set(this, void 0);
        __classPrivateFieldSet(this, _MessageRepository_database, db, "f");
    }
    async add(message) {
        try {
            const id = (0, uuid_1.v4)();
            const [result] = await __classPrivateFieldGet(this, _MessageRepository_database, "f").execute(messageQueries_js_1.ADD_MESSAGE, [
                id, message.sender_id, message.chat_id,
                message.type,
                message.text || null,
                message.image_url || null,
                message.audio_url || null,
            ]);
            const header = result;
            if (header.affectedRows === 0) {
                throw new Error(`Failed to add message: message_id=${id}`);
            }
            logger_js_1.default.info(`operation successfull (added message: message_id=${id} to db)`);
            return { message_id: id };
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute INSERT query on db");
        }
    }
    async findById(message) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _MessageRepository_database, "f").execute(messageQueries_js_1.FIND_MESSAGES_BY_ID, [
                message.message_id,
            ]);
            if (!Array.isArray(rows)) {
                throw new Error("unexpected database response when selecting message from database");
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
    async findByChatId(message) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _MessageRepository_database, "f").execute(messageQueries_js_1.FIND_MESSAGES_BY_CHAT_ID, [
                message.chat_id,
            ]);
            if (!Array.isArray(rows)) {
                throw new Error("unexpected database response when selecting messages from database");
            }
            return rows;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute query on db");
        }
    }
    async delete(message) {
        logger_js_1.default.info("deleting message...");
        try {
            const [rows] = await __classPrivateFieldGet(this, _MessageRepository_database, "f").execute(messageQueries_js_1.DELETE_MESSAGE, [
                message.message_id
            ]);
            const header = rows;
            if (header.affectedRows === 0) {
                throw new Error(`Failed to delete message: message_id=${message.message_id}`);
            }
            logger_js_1.default.info(`Deleted message: message_id=${message.message_id}`);
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute DELETE query on db");
        }
    }
}
_MessageRepository_database = new WeakMap();
exports.default = MessageRepository;
