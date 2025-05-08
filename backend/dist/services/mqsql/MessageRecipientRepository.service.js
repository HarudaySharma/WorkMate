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
var _MessageRecipientRepository_database;
Object.defineProperty(exports, "__esModule", { value: true });
const logger_js_1 = __importDefault(require("../../logger.js"));
const messageRecipientQueries_js_1 = require("./queries/messageRecipientQueries.js");
class MessageRecipientRepository {
    constructor(db) {
        _MessageRecipientRepository_database.set(this, void 0);
        __classPrivateFieldSet(this, _MessageRecipientRepository_database, db, "f");
    }
    async add(msgRecpt) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _MessageRecipientRepository_database, "f").execute(messageRecipientQueries_js_1.ADD_MESSAGE_RECIPIENT, [
                msgRecpt.message_id, msgRecpt.user_id
            ]);
            const header = rows;
            if (header.affectedRows === 0) {
                throw new Error(`Failed to INSERT message_recipient: message_id=${msgRecpt.message_id}, user_id=${msgRecpt.user_id}`);
            }
            logger_js_1.default.info(`operation successfull, INSERTED message_recipient: message_id=${msgRecpt.message_id}, user_id=${msgRecpt.user_id}`);
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute INSERT query on db");
        }
    }
    async findByMessageId(msgRecpt) {
        try {
            const [rows] = await __classPrivateFieldGet(this, _MessageRecipientRepository_database, "f").execute(messageRecipientQueries_js_1.FIND_MESSAGES_RECIPIENT_BY_MESSAGE_ID, [
                msgRecpt.message_id,
            ]);
            if (!Array.isArray(rows)) {
                return null;
            }
            return rows;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute SELECT query on db");
        }
    }
    async removeRecipientsByMessageId(msgRecpt) {
        logger_js_1.default.info("deleting message recipient...");
        try {
            const [rows] = await __classPrivateFieldGet(this, _MessageRecipientRepository_database, "f").execute(messageRecipientQueries_js_1.DELETE_MESSAGE_RECIPIENT_BY_MESSAGE_ID, [
                msgRecpt.message_id
            ]);
            const header = rows;
            if (header.affectedRows === 0) {
                throw new Error(`Failed to DELETE message recipients: message_id=${msgRecpt.message_id}`);
            }
            logger_js_1.default.info(`opeation succcessfull, DELETED message recipients: message_id=${msgRecpt.message_id}`);
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute DELETE query on db");
        }
    }
    async removeRecipientByUserId(msgRecpt) {
        logger_js_1.default.info("deleting message recipient...");
        try {
            const [rows] = await __classPrivateFieldGet(this, _MessageRecipientRepository_database, "f").execute(messageRecipientQueries_js_1.DELETE_SINGLE_MESSAGE_RECIPIENT, [
                msgRecpt.user_id
            ]);
            const header = rows;
            if (header.affectedRows === 0) {
                throw new Error(`Failed to DELETE message recipient: user_id=${msgRecpt.user_id}`);
            }
            logger_js_1.default.info(`opeation succcessfull, DELETED message recipient: user_id=${msgRecpt.user_id}`);
            return;
        }
        catch (err) {
            logger_js_1.default.error(err);
            throw new Error("failed to execute DELETE query on db");
        }
    }
}
_MessageRecipientRepository_database = new WeakMap();
exports.default = MessageRecipientRepository;
