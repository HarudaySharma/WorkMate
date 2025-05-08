"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_middleware_js_1 = require("../../middlewares/verifyToken.middleware.js");
const index_js_1 = require("../../controllers/chats/index.js");
const index_js_2 = require("../../controllers/messages/index.js");
const router = (0, express_1.Router)();
// we need to verify whether user is logged in or not, so that we can extract id from itspayload
router.get("/:workspaceId/all", verifyToken_middleware_js_1.verifyToken, index_js_1.getWorkspaceChats);
router.delete("/:workspaceId/:chatId/leave", verifyToken_middleware_js_1.verifyToken, index_js_1.leaveChat);
router.delete("/:workspaceId/:chatId", verifyToken_middleware_js_1.verifyToken, index_js_1.deleteChat);
router.put("/:workspaceId", verifyToken_middleware_js_1.verifyToken, index_js_1.createChat);
router.patch("/:workspaceId/:chatId/join", verifyToken_middleware_js_1.verifyToken, index_js_1.joinChat);
router.get("/:workspaceId/:chatId/members", verifyToken_middleware_js_1.verifyToken, index_js_1.getChatMembers);
// message routes
router.get("/:workspaceId/:chatId/message/all", verifyToken_middleware_js_1.verifyToken, index_js_2.getChatMessages);
router.put("/:workspaceId/:chatId/message", verifyToken_middleware_js_1.verifyToken, index_js_2.createMessage);
router.delete("/:workspaceId/:chatId/message", verifyToken_middleware_js_1.verifyToken, index_js_2.deleteMessage);
exports.default = router;
