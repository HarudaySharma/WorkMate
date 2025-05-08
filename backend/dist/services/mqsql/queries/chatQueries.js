"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIND_CHATS_BY_WORKSPACE_ID = exports.DELETE_CHAT = exports.FIND_CHAT = exports.ADD_CHAT = void 0;
exports.ADD_CHAT = `INSERT INTO chats (name, type, workspace_id) VALUES(?, ?, ?)`;
exports.FIND_CHAT = `SELECT * FROM chats WHERE id = ?;`;
exports.DELETE_CHAT = `DELETE FROM chats WHERE id = ?;`;
exports.FIND_CHATS_BY_WORKSPACE_ID = `SELECT * FROM chats WHERE workspace_id = ?;`;
