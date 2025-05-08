"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateHashedPass;
const bcrypt_1 = __importDefault(require("bcrypt"));
const randomSalt_1 = __importDefault(require("./randomSalt"));
async function generateHashedPass(password) {
    try {
        const salt = (0, randomSalt_1.default)();
        const passString = password + salt;
        const hashedPass = await bcrypt_1.default.hash(passString, 10);
        return { hashedPass, salt };
    }
    catch (err) {
        throw err;
    }
}
