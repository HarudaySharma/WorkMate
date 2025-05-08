"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.logout = exports.userInfo = void 0;
const http_status_codes_1 = require("http-status-codes");
const mysql_service_js_1 = __importDefault(require("../../services/mqsql/mysql.service.js"));
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
const UserRepository_service_js_1 = __importDefault(require("../../services/mqsql/UserRepository.service.js"));
const userInfo = async (req, res, next) => {
    const user = req.user;
    if (user === undefined) {
        next(new error_middleware_js_1.Errorr("not authorized to get user information", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        id: user.id,
        profile_picture: user.profile_picture,
        name: user.name,
        username: user.username,
        email: user.email,
    });
    return;
};
exports.userInfo = userInfo;
const logout = async (req, res, next) => {
    const user = req.user;
    if (user === undefined) {
        next(new error_middleware_js_1.Errorr("not authorized to logout the user", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    res.clearCookie("access_token");
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true });
};
exports.logout = logout;
const deleteUser = async (req, res, next) => {
    const user = req.user;
    if (user === undefined) {
        next(new error_middleware_js_1.Errorr("not authorized to delete this user", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const userRepo = new UserRepository_service_js_1.default(await mysql_service_js_1.default.getConnection());
        await userRepo.delete({
            username: user.username,
            email: user.email,
        });
        res.clearCookie("access_token");
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true });
    }
    catch (err) {
        next(new error_middleware_js_1.Errorr("failed to delete user", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
};
exports.deleteUser = deleteUser;
