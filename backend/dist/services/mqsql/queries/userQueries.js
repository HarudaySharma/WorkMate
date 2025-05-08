"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_USER = exports.ADD_USER = exports.FIND_USER_BY_ID = exports.FIND_USER = void 0;
exports.FIND_USER = `SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1;`;
exports.FIND_USER_BY_ID = `SELECT * FROM users WHERE id = ?;`;
exports.ADD_USER = `INSERT INTO users (name, username, email, hashed_password, hash_salt, profile_picture) VALUES (?, ?, ?, ?, ?, ?);`;
exports.DELETE_USER = `DELETE FROM users WHERE username = ? OR email = ?;`;
