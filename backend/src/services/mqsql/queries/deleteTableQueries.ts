
export const deleteUserTable = () => {
    return `
        DROP TABLE users;
    `
}

export const deleteWorkspaceTable = () => {
    return `
        DROP TABLE workspaces;
    `
}

export const deleteMembersTable = () => {
    return `
        DROP TABLE members;
    `
}
