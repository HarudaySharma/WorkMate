export const ADD_CHAT = `INSERT INTO chats (name, type, workspace_id) VALUES(?, ?, ?)`;
export const FIND_CHAT = `SELECT * FROM chats WHERE id = ?;`
export const DELETE_CHAT = `DELETE FROM chats WHERE id = ?;`
export const FIND_CHATS_BY_WORKSPACE_ID = `SELECT * FROM chats WHERE workspace_id = ?;`
