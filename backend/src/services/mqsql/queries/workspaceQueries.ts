export const CREATE_WORKSPACE = `INSERT INTO workspaces (name, creator_id, invite_link) VALUES(?, ?, ?);`
export const FIND_WORKSPACE = `SELECT * FROM workspaces WHERE creator_id = ? AND name = ? LIMIT 1;` // finds particular workspace of a user
export const FIND_WORKSPACE_BY_ID = `SELECT * FROM workspaces WHERE id = ? LIMIT 1;` // finds particular workspace of a user
export const FIND_WORKSPACE_BY_NAME = `SELECT * FROM workspaces WHERE name = ? LIMIT 1;` // finds particular workspace of a user
export const FIND_WORKSPACE_BY_INVITE_LINK = `SELECT * FROM workspaces WHERE invite_link = ? LIMIT 1;` // finds particular workspace of a user
// finds all the workspaces in which user is joined
export const DELETE_WORKSPACE = `DELETE FROM workspaces WHERE id = ?;`

//TODO:
export const FIND_USER_WORKSPACES = `SELECT w.* FROM workspaces w inner join workspace_members m WHERE m.user_id = ? AND w.id = m.workspace_id ;`
