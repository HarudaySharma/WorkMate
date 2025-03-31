export const ADD_WORKSPACE_MEMBER = `INSERT INTO workspace_members (user_id, workspace_id, role) VALUES(?, ?, ?);`
export const FIND_WORKSPACE_MEMBER = `SELECT * FROM workspace_members WHERE user_id = ? AND workspace_id = ?;`
export const FIND_WORKSPACE_MEMBERS_BY_WORKSPACE_ID = `SELECT * FROM workspace_members WHERE workspace_id = ?;`
export const DELETE_WORKSPACE_MEMBER = `DELETE FROM workspace_members WHERE user_id = ? AND workspace_id = ?;`
