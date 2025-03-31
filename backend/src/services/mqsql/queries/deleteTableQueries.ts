
export const deleteUserTable = () => {
    return `
        DROP TABLE IF EXISTS users;
    `
}

export const deleteWorkspaceTable = () => {
    return `
        DROP TABLE IF EXISTS workspaces;
    `
}

export const deleteChatsTable = () => {
    return `
        DROP TABLE IF EXISTS chats;
    `
}

export const deleteWorkspaceMembersTable = () => {
    return `
        DROP TABLE IF EXISTS workspace_members;
    `
}

export const deleteChatMembersTable = () => {
    return `
        DROP TABLE IF EXISTS chat_members;
    `
}
