function generateRoomId (workspaceId: number, chatId: number) {
    return `${workspaceId}#${chatId}`;
}

export default generateRoomId;
