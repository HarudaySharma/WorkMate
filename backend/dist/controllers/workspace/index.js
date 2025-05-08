"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyWorkspaceMember = exports.leaveWorkspace = exports.removeWorkspaceMember = exports.getInviteToken = exports.getWorkspaceMembers = exports.getUserWorkspaces = exports.deleteWorkspace = exports.createWorkspace = exports.joinWorkspace = exports.getWorkspace = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
const mysql_service_js_1 = __importDefault(require("../../services/mqsql/mysql.service.js"));
const logger_js_1 = __importDefault(require("../../logger.js"));
const workmate_service_js_1 = __importDefault(require("../../services/workmate/workmate.service.js"));
const generateInviteLink_js_1 = __importDefault(require("../../utils/generateInviteLink.js"));
// TODO: test all these routes
const getWorkspace = async (req, res, next) => {
    logger_js_1.default.info("HIT: GET /workspace");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot visit the workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot visit the workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new error_middleware_js_1.Errorr("workspace not found", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.getWorkspaceInfo({
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
exports.getWorkspace = getWorkspace;
const joinWorkspace = async (req, res, next) => {
    logger_js_1.default.info("HIT: PATCH /workspace/join");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot join workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot create workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { inviteLink } = req.params;
    if (inviteLink === undefined) {
        next(new error_middleware_js_1.Errorr("invite link invalid", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.joinWorkspace({
            userId: userId,
            inviteLink: inviteLink,
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
exports.joinWorkspace = joinWorkspace;
const createWorkspace = async (req, res, next) => {
    logger_js_1.default.info("HIT: PUT /workspace");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot create workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot create workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    const { name, inviteLink } = req.body;
    logger_js_1.default.info({ body: req.body });
    if (name === undefined || inviteLink === undefined) {
        next(new error_middleware_js_1.Errorr("Insufficient data provided", http_status_codes_1.StatusCodes.BAD_REQUEST));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.createWorkspace({
            name: name,
            creatorId: userId,
            inviteLink: inviteLink,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(ret);
    }
    catch (err) {
        const er = err; // err will always be of type WorkmateError
        if (er.type === undefined) {
            logger_js_1.default.error(err);
            next(new error_middleware_js_1.Errorr("internal server error"));
            return;
        }
        logger_js_1.default.error(er.error);
        const statusCode = (er.type === "USER_ERROR" ? http_status_codes_1.StatusCodes.BAD_REQUEST : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        next(new error_middleware_js_1.Errorr(er.message, er.httpStatusCode || statusCode));
    }
};
exports.createWorkspace = createWorkspace;
const deleteWorkspace = async (req, res, next) => {
    logger_js_1.default.info("HIT: DELETE /workspace");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot delete workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot delete workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    const { workspaceName } = req.body;
    if (workspaceName === undefined) {
        next(new error_middleware_js_1.Errorr("Insufficient data provided", http_status_codes_1.StatusCodes.BAD_REQUEST));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        // user can either provide the name of the workspace or id to delete it.
        const ret = await workmate.deleteWorkspace({
            workspaceName: workspaceName,
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
exports.deleteWorkspace = deleteWorkspace;
const getUserWorkspaces = async (req, res, next) => {
    logger_js_1.default.info("HIT: GET /workspace/all");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot see the workspace members", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot see the workspace members", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.getUserWorkspaces({
            userId: userId,
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
exports.getUserWorkspaces = getUserWorkspaces;
const getWorkspaceMembers = async (req, res, next) => {
    logger_js_1.default.info("HIT: GET /workspace/members");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot see the workspace members", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot see the workspace members", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.getWorkspaceMembers({
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
exports.getWorkspaceMembers = getWorkspaceMembers;
const getInviteToken = async (req, res, next) => {
    logger_js_1.default.info("HIT: GET /workspace/inviteLink");
    const uniqueInviteLink = (0, generateInviteLink_js_1.default)();
    res.json({ token: uniqueInviteLink });
};
exports.getInviteToken = getInviteToken;
const removeWorkspaceMember = async (req, res, next) => {
    logger_js_1.default.info("HIT: DELETE /workspace/member");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot remove workspace member", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot remove workspace member", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { member } = req.body;
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.removeWorkspaceMember({
            workspaceId: +workspaceId,
            userId: userId,
            member: {
                user_id: member.id,
            }
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
exports.removeWorkspaceMember = removeWorkspaceMember;
const leaveWorkspace = async (req, res, next) => {
    logger_js_1.default.info("HIT: PATCH /workspace/leave");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot leave workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot leave workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.leaveWorkspace({
            workspaceId: +workspaceId,
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
exports.leaveWorkspace = leaveWorkspace;
const modifyWorkspaceMember = async (req, res, next) => {
    logger_js_1.default.info("HIT: PATCH /workspace/modify/member");
    if (!req.user) {
        next(new error_middleware_js_1.Errorr("no user found, cannot leave workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { id: userId } = req.user;
    if (userId === undefined) {
        next(new error_middleware_js_1.Errorr("invalid user id, cannot leave workspace", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    const { workspaceId } = req.params;
    if (workspaceId === undefined) {
        next(new error_middleware_js_1.Errorr("no Workspace Id provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        return;
    }
    const { member } = req.body;
    try {
        const workmate = new workmate_service_js_1.default(mysql_service_js_1.default);
        const ret = await workmate.modifyWorkspaceMember({
            workspaceId: +workspaceId,
            userId: userId,
            member: {
                user_id: member.user_id,
                role: member.role,
            }
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
exports.modifyWorkspaceMember = modifyWorkspaceMember;
