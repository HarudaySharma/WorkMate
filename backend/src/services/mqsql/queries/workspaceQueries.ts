export const CREATE_WORKSPACE = `INSERT INTO workspaces (name, creator_id, invite_link) VALUES(?, ?, ?);`
export const FIND_WORKSPACE = `SELECT * FROM workspaces WHERE creator_id = ? && name = ?;` // finds particular workspace of a user
export const DELETE_WORKSPACE = `DELETE FROM workspaces WHERE id = ?;`
