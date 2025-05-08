"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getChatMessages = exports.createMessage = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
const mysql_service_js_1 = __importDefault(require("../../services/mqsql/mysql.service.js"));
const logger_js_1 = __importDefault(require("../../logger.js"));
const workmate_service_js_1 = __importDefault(require("../../services/workmate/workmate.service.js"));
const createMessage = async (req, res, next) => {
    logger_js_1.default.info("HIT: PUT /chat/:workspaceId/:chatId/message");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot create a message", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot create a message", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided or chat Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { message, chat } = req.body;
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.createMessage({
            userId: userId,
            chat: {
                id: +chatId,
                workspace_id: +workspaceId,
                type: chat.type,
            },
            msg: {
                type: message.type,
                text: message.text,
                audio_url: message.audio_url,
                image_url: message.image_url,
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
exports.createMessage = createMessage;
const getChatMessages = async (req, res, next) => {
    logger_js_1.default.info("HIT: GET /chat/:workspaceId/:chatId/messages");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot get messages", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot get messages", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided or chat Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.getChatMessages({
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
exports.getChatMessages = getChatMessages;
const deleteMessage = async (req, res, next) => {
    logger_js_1.default.info("HIT: DELETE /chat/:workspaceId/:chatId/message");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot get messages", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot get messages", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { workspaceId, chatId } = req.params;
    if (workspaceId === undefined || chatId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided or chat Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { messageId } = req.body;
    if (messageId == undefined) {
        next(new error_middleware_js_1.Errorr("missing messageId in request body", http_status_codes_1.StatusCodes.BAD_REQUEST));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.deleteMessage({
            messageId: messageId,
            userId: userId,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(ret);
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
exports.deleteMessage = deleteMessage;
