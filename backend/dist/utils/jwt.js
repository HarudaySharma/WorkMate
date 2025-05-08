"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_js_1 = __importDefault(require("../zod.js"));
const logger_js_1 = __importDefault(require("../logger.js"));
const generateToken = (user) => {
    const payload = {
        data: {
            user: user,
        }
    };
    logger_js_1.default.info({ "token_payload: data": payload.data });
    return jsonwebtoken_1.default.sign(payload, zod_js_1.default.JWT_SECRET, { algorithm: "HS256" });
};
exports.generateToken = generateToken;
