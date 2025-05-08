"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsVerifyToken = exports.verifyToken = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_js_1 = __importDefault(require("../zod.js"));
const error_middleware_js_1 = require("./error.middleware.js");
const verifyToken = (req, _, next) => {
    if (!req.cookies) {
        next(new error_middleware_js_1.Errorr("missing cookies", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { access_token } = req.cookies;
    if (!access_token) {
        next(new error_middleware_js_1.Errorr("missing access_token", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(access_token, zod_js_1.default.JWT_SECRET);
        req.user = decoded.data.user;
        next();
    }
    catch (err) {
        next(new error_middleware_js_1.Errorr("access token not verified", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
};
exports.verifyToken = verifyToken;
const wsVerifyToken = (socket, next) => {
    const { access_token } = socket.handshake.auth;
    if (!access_token) {
        next(new error_middleware_js_1.Errorr("missing access_token", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(access_token, zod_js_1.default.JWT_SECRET);
        socket.data.user = decoded.data.user;
        next();
    }
    catch (err) {
        next(new error_middleware_js_1.Errorr("access token not verified", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
};
exports.wsVerifyToken = wsVerifyToken;
