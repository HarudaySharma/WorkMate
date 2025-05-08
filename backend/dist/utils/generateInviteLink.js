"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateInviteToken;
function generateInviteToken() {
    const now = new Date();
    const datePart = now.toISOString().slice(2, 16) // "yy-MM-ddTHH:mm"
        .replace(/[-:T]/g, '') // "yyMMddHHmm"
        .slice(0, 10); // just to be safe
    const randomPart = Math.random().toString(36).slice(2, 8); // 6-char random
    return datePart + randomPart; // e.g. "2504301312kfj3h"
}
