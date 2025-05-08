"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_MESSAGE = exports.FIND_MESSAGES_BY_CHAT_ID = exports.FIND_MESSAGES_BY_ID = exports.ADD_MESSAGE = void 0;
exports.ADD_MESSAGE = `INSERT INTO messages (message_id, sender_id, chat_id, type, text, image_url, audio_url)
                                VALUES(?, ?, ?, ?, ?, ?, ?);`;
exports.FIND_MESSAGES_BY_ID = `SELECT * FROM messages WHERE message_id = ? LIMIT 1;`;
exports.FIND_MESSAGES_BY_CHAT_ID = `SELECT * FROM messages WHERE chat_id = ?;`;
exports.DELETE_MESSAGE = `UPDATE messages SET is_deleted = 1 WHERE message_id = ?;`;
//export const FIND_CHAT = `SELECT FROM chats WHERE id = ?;`
