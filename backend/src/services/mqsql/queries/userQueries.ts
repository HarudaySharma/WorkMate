export const FIND_USER = `SELECT * FROM users WHERE username = ? OR email = ?;`;
export const FIND_USER_BY_ID = `SELECT * FROM users WHERE id = ?;`;
export const ADD_USER = `INSERT INTO users (name, username, email, hashed_password, hash_salt, profile_picture) VALUES (?, ?, ?, ?, ?, ?);`;
export const DELETE_USER = `DELETE FROM users WHERE username = ? OR email = ?;`;


