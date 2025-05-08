"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateRoomId(workspaceId, chatId) {
    return `${workspaceId}#${chatId}`;
}
exports.default = generateRoomId;
