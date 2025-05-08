"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIND_USER_WORKSPACES = exports.DELETE_WORKSPACE = exports.FIND_WORKSPACE_BY_INVITE_LINK = exports.FIND_WORKSPACE_BY_NAME = exports.FIND_WORKSPACE_BY_ID = exports.FIND_WORKSPACE = exports.CREATE_WORKSPACE = void 0;
exports.CREATE_WORKSPACE = `INSERT INTO workspaces (name, creator_id, invite_link) VALUES(?, ?, ?);`;
exports.FIND_WORKSPACE = `SELECT * FROM workspaces WHERE creator_id = ? AND name = ? LIMIT 1;`; // finds particular workspace of a user
exports.FIND_WORKSPACE_BY_ID = `SELECT * FROM workspaces WHERE id = ? LIMIT 1;`; // finds particular workspace of a user
exports.FIND_WORKSPACE_BY_NAME = `SELECT * FROM workspaces WHERE name = ? LIMIT 1;`; // finds particular workspace of a user
exports.FIND_WORKSPACE_BY_INVITE_LINK = `SELECT * FROM workspaces WHERE invite_link = ? LIMIT 1;`; // finds particular workspace of a user
// finds all the workspaces in which user is joined
exports.DELETE_WORKSPACE = `DELETE FROM workspaces WHERE id = ?;`;
//TODO:
exports.FIND_USER_WORKSPACES = `SELECT w.* FROM workspaces w inner join workspace_members m WHERE m.user_id = ? AND w.id = m.workspace_id ;`;
