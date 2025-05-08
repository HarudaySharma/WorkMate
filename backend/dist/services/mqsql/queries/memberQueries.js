"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_MEMBER = exports.FIND_MEMBERS_BY_WORKSPACE_ID = exports.FIND_MEMBER = exports.ADD_MEMBER = void 0;
exports.ADD_MEMBER = `INSERT INTO workspace_members (user_id, workspace_id, role) VALUES(?, ?, ?);`;
exports.FIND_MEMBER = `SELECT * FROM workspace_members WHERE user_id = ? && workspace_id = ?;`;
exports.FIND_MEMBERS_BY_WORKSPACE_ID = `SELECT * FROM workspace_members WHERE workspace_id = ?;`;
exports.DELETE_MEMBER = `DELETE FROM workspace_members WHERE user_id = ? && workspace_id = ?;`;
