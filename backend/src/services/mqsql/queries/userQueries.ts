export const FIND_USER = `SELECT * FROM users WHERE username = ? OR email = ?;`;
export const ADD_USER = `INSERT INTO users (name, username, email, hashed_password, hash_salt, profile_picture) VALUES (?, ?, ?, ?, ?, ?);`;
export const DELETE_USER = `DELETE FROM users WHERE username = ? OR email = ?;`;


