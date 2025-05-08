"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = randomSalt;
const zod_js_1 = __importDefault(require("../zod.js"));
function randomSalt() {
    const str = "ab23$@&)*{L(^cd0elx-}";
    const saltLen = +zod_js_1.default.SALT_LEN;
    const salt = [];
    while (salt.length != saltLen) {
        let idx = Math.floor(Math.random() * str.length);
        salt.push(str[idx]);
    }
    return salt.join("");
}
