"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessageRecipientsTable = exports.deleteMessagesTable = exports.deleteChatMembersTable = exports.deleteWorkspaceMembersTable = exports.deleteChatsTable = exports.deleteWorkspaceTable = exports.deleteUserTable = void 0;
const deleteUserTable = () => {
    return `
        DROP TABLE IF EXISTS users;
    `;
};
exports.deleteUserTable = deleteUserTable;
const deleteWorkspaceTable = () => {
    return `
        DROP TABLE IF EXISTS workspaces;
    `;
};
exports.deleteWorkspaceTable = deleteWorkspaceTable;
const deleteChatsTable = () => {
    return `
        DROP TABLE IF EXISTS chats;
    `;
};
exports.deleteChatsTable = deleteChatsTable;
const deleteWorkspaceMembersTable = () => {
    return `
        DROP TABLE IF EXISTS workspace_members;
    `;
};
exports.deleteWorkspaceMembersTable = deleteWorkspaceMembersTable;
const deleteChatMembersTable = () => {
    return `
        DROP TABLE IF EXISTS chat_members;
    `;
};
exports.deleteChatMembersTable = deleteChatMembersTable;
const deleteMessagesTable = () => {
    return `
        DROP TABLE IF EXISTS messages;
    `;
};
exports.deleteMessagesTable = deleteMessagesTable;
const deleteMessageRecipientsTable = () => {
    return `
        DROP TABLE IF EXISTS message_recipients;
    `;
};
exports.deleteMessageRecipientsTable = deleteMessageRecipientsTable;
