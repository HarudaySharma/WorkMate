
export const ADD_MESSAGE = `INSERT INTO messages (message_id, sender_id, reciever_id, chat_id, type, text, image, audio)
                                VALUES(UUID(), ?, ?, ?, ?, ?, ?)
                                RETURNING message_id;`
export const FIND_MESSAGES_BY_CHAT_ID = `SELECT * FROM messages WHERE chat_id = ?;`
export const DELETE_MESSAGE = `UPDATE messages SET is_deleted = 1 WHERE message_id = ?;`

//export const FIND_CHAT = `SELECT FROM chats WHERE id = ?;`
