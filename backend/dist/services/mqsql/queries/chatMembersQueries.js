"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_CHAT_MEMBER = exports.FIND_CHAT_MEMBERS_BY_CHAT_ID = exports.FIND_CHAT_MEMBERS_BY_USER_ID = exports.FIND_CHAT_MEMBER = exports.ADD_CHAT_MEMBER = void 0;
exports.ADD_CHAT_MEMBER = `INSERT INTO chat_members (chat_id, user_id, role) VALUES(?, ?, ?);`;
exports.FIND_CHAT_MEMBER = `SELECT * FROM chat_members WHERE user_id = ? AND chat_id = ? LIMIT 1;`; // will retrieve all the chat member rows of a particular user
exports.FIND_CHAT_MEMBERS_BY_USER_ID = `SELECT * FROM chat_members WHERE user_id = ?;`; // will retrieve all the chat member rows of a particular user
exports.FIND_CHAT_MEMBERS_BY_CHAT_ID = `SELECT * FROM chat_members WHERE chat_id = ?;`; // will retrieve all the chat members of a specific chat.
exports.DELETE_CHAT_MEMBER = `DELETE FROM chat_members WHERE user_id = ? AND chat_id = ?;`; // will remove a member with id: user_id from a chat.
