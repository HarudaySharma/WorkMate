"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_MESSAGE_RECIPIENT_BY_MESSAGE_ID = exports.DELETE_SINGLE_MESSAGE_RECIPIENT = exports.FIND_MESSAGES_RECIPIENT_BY_USER_ID = exports.FIND_MESSAGES_RECIPIENT_BY_MESSAGE_ID = exports.ADD_MESSAGE_RECIPIENT = void 0;
exports.ADD_MESSAGE_RECIPIENT = `INSERT INTO message_recipients (message_id, user_id) VALUES(?, ?);`;
exports.FIND_MESSAGES_RECIPIENT_BY_MESSAGE_ID = `SELECT * FROM message_recipients WHERE message_id = ?;`; // can be more than one if the message is sent in a group or single o/w
exports.FIND_MESSAGES_RECIPIENT_BY_USER_ID = `SELECT * FROM message_recipients WHERE user_id = ?;`;
exports.DELETE_SINGLE_MESSAGE_RECIPIENT = `DELETE FROM message_recipients WHERE user_id = ? AND message_id = ?;`; // will delete the particular user with `user_id` as the message_recipient
exports.DELETE_MESSAGE_RECIPIENT_BY_MESSAGE_ID = `DELETE FROM message_recipients WHERE message_id = ?;`; // will delete all the message_recipients which recieved the message (group or one-one)
//export const FIND_CHAT = `SELECT FROM chats WHERE id = ?;`
