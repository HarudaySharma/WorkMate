"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = defaultCookieOptions;
function defaultCookieOptions() {
    return {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 2, // two hours
        secure: false,
        sameSite: 'strict',
    };
}
