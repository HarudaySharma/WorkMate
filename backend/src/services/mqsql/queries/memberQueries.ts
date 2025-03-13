export const ADD_MEMBER = `INSERT INTO members (user_id, workspace_id, role) VALUES(?, ?, ?);`
export const FIND_MEMBER = `SELECT * FROM members WHERE user_id = ? && workspace_id = ?;`
export const FIND_MEMBERS_BY_WORKSPACE_ID = `SELECT * FROM members WHERE workspace_id = ?;`
export const DELETE_MEMBER = `DELETE FROM members WHERE user_id = ? && workspace_id = ?;`
