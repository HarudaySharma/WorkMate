
export const ADD_MESSAGE = `INSERT INTO messages (message_id, sender_id, chat_id, type, text, image_url, audio_url)
                                VALUES(?, ?, ?, ?, ?, ?, ?);`
export const FIND_MESSAGES_BY_ID = `SELECT * FROM messages WHERE message_id = ? LIMIT 1;`
export const FIND_MESSAGES_BY_CHAT_ID = `SELECT * FROM messages WHERE chat_id = ?;`
export const DELETE_MESSAGE = `UPDATE messages SET is_deleted = 1 WHERE message_id = ?;`

//export const FIND_CHAT = `SELECT FROM chats WHERE id = ?;`
