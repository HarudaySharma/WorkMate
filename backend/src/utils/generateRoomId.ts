function generateRoomId (workspaceId: string, chatId: string) {
    return `${workspaceId}#${chatId}`;
}

export default generateRoomId;
