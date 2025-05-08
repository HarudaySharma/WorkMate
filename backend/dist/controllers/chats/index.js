"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChat = exports.leaveChat = exports.getChatMembers = exports.joinChat = exports.getWorkspaceChats = exports.createChat = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
const mysql_service_js_1 = __importDefault(require("../../services/mqsql/mysql.service.js"));
const logger_js_1 = __importDefault(require("../../logger.js"));
const workmate_service_js_1 = __importDefault(require("../../services/workmate/workmate.service.js"));
const createChat = async (req, res, next) => {
    logger_js_1.default.info("HIT: PUT /chat");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot see the workspace chats", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot see the workspace chats", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { workspaceId } = req.params;
    const { chat, recieverId } = req.body;
    if (workspaceId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.createChat({
            userId: userId,
            recieverId: recieverId,
            chat: {
                name: chat.name,
                type: chat.type,
                workspace_id: +workspaceId,
            }
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(ret); // show user the workspace -> redirect them to the workspace
    }
    catch (err) {
        const er = err; // err will always be of type WorkmateError
        if (er.type === undefined) {
            console.log(err);
            next(new error_middleware_js_1.Errorr("internal server error"));
            return;
        }
        logger_js_1.default.error(er.error);
        const statusCode = (er.type === "USER_ERROR" ? http_status_codes_1.StatusCodes.BAD_REQUEST : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        next(new error_middleware_js_1.Errorr(er.message, er.httpStatusCode || statusCode));
    }
};
exports.createChat = createChat;
const getWorkspaceChats = async (req, res, next) => {
    logger_js_1.default.info("HIT: GET /chat/all");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot see the workspace chats", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot see the workspace chats", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.getWorkspaceChats({
            userId: userId,
            workspaceId: +workspaceId,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(ret); // show user the workspace -> redirect them to the workspace
    }
    catch (err) {
        const er = err; // err will always be of type WorkmateError
        if (er.type === undefined) {
            next(new error_middleware_js_1.Errorr("internal server error"));
            return;
        }
        logger_js_1.default.error(er.error);
        const statusCode = (er.type === "USER_ERROR" ? http_status_codes_1.StatusCodes.BAD_REQUEST : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        next(new error_middleware_js_1.Errorr(er.message, er.httpStatusCode || statusCode));
    }
};
exports.getWorkspaceChats = getWorkspaceChats;
const joinChat = async (req, res, next) => {
    logger_js_1.default.info("HIT: PATCH /chat/:workspaceId/:chatId/");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot join the chat", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot join the chat", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided or chat Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { role } = req.query;
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.joinChat({
            workspaceId: +workspaceId,
            chatId: +chatId,
            userId: userId,
            role: role,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(ret); // show user the workspace -> redirect them to the workspace
    }
    catch (err) {
        const er = err; // err will always be of type WorkmateError
        if (er.type === undefined) {
            console.log(err);
            next(new error_middleware_js_1.Errorr("internal server error"));
            return;
        }
        logger_js_1.default.error(er.error);
        const statusCode = (er.type === "USER_ERROR" ? http_status_codes_1.StatusCodes.BAD_REQUEST : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        next(new error_middleware_js_1.Errorr(er.message, er.httpStatusCode || statusCode));
    }
};
exports.joinChat = joinChat;
const getChatMembers = async (req, res, next) => {
    logger_js_1.default.info("HIT: GET /chat/:workspaceId/:chatId/members");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot get chat members", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot get chat members", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided or chat Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.getChatMembers({
            userId: userId,
            workspaceId: +workspaceId,
            chatId: +chatId,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(ret); // show user the workspace -> redirect them to the workspace
    }
    catch (err) {
        const er = err; // err will always be of type WorkmateError
        if (er.type === undefined) {
            console.log(err);
            next(new error_middleware_js_1.Errorr("internal server error"));
            return;
        }
        logger_js_1.default.error(er.error);
        const statusCode = (er.type === "USER_ERROR" ? http_status_codes_1.StatusCodes.BAD_REQUEST : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        next(new error_middleware_js_1.Errorr(er.message, er.httpStatusCode || statusCode));
    }
};
exports.getChatMembers = getChatMembers;
const leaveChat = async (req, res, next) => {
    logger_js_1.default.info("HIT: DELETE /chat/leave");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot leave chat", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot leave chat", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    const { chatId, workspaceId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided or chat Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.leaveChat({
            chat: {
                id: +chatId,
                workspace_id: +workspaceId,
            },
            userId: userId,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(ret);
    }
    catch (err) {
        const er = err; // err will always be of type WorkmateError
        if (er.type === undefined) { // this won't happen usually
            logger_js_1.default.error(err);
            next(new error_middleware_js_1.Errorr("internal server error"));
            return;
        }
        logger_js_1.default.error(er.error);
        const statusCode = (er.type === "USER_ERROR" ? http_status_codes_1.StatusCodes.BAD_REQUEST : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        next(new error_middleware_js_1.Errorr(er.message, er.httpStatusCode || statusCode));
    }
};
exports.leaveChat = leaveChat;
const deleteChat = async (req, res, next) => {
    logger_js_1.default.info("HIT: DELETE /chat");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot delete chat", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot delete chat", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    const { chatId, workspaceId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided or chat Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.deleteChat({
            chat: {
                id: +chatId,
                workspace_id: +workspaceId,
            },
            userId: userId,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(ret);
    }
    catch (err) {
        const er = err; // err will always be of type WorkmateError
        if (er.type === undefined) { // this won't happen usually
            logger_js_1.default.error(err);
            next(new error_middleware_js_1.Errorr("internal server error"));
            return;
        }
        logger_js_1.default.error(er.error);
        const statusCode = (er.type === "USER_ERROR" ? http_status_codes_1.StatusCodes.BAD_REQUEST : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        next(new error_middleware_js_1.Errorr(er.message, er.httpStatusCode || statusCode));
    }
};
exports.deleteChat = deleteChat;
