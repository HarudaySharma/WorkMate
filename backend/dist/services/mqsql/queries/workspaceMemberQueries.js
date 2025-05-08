"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODIFY_WORKSPACE_MEMBER = exports.DELETE_WORKSPACE_MEMBER = exports.FIND_WORKSPACE_MEMBERS_BY_WORKSPACE_ID = exports.FIND_WORKSPACE_MEMBER = exports.ADD_WORKSPACE_MEMBER = void 0;
exports.ADD_WORKSPACE_MEMBER = `INSERT INTO workspace_members (user_id, workspace_id, role) VALUES(?, ?, ?);`;
exports.FIND_WORKSPACE_MEMBER = `SELECT * FROM workspace_members WHERE user_id = ? AND workspace_id = ?;`;
exports.FIND_WORKSPACE_MEMBERS_BY_WORKSPACE_ID = `SELECT * FROM workspace_members WHERE workspace_id = ?;`;
exports.DELETE_WORKSPACE_MEMBER = `DELETE FROM workspace_members WHERE user_id = ? AND workspace_id = ?;`;
exports.MODIFY_WORKSPACE_MEMBER = `UPDATE workspace_members SET role = ? WHERE user_id = ? AND workspace_id = ? LIMIT 1;`;
