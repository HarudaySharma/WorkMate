import { Router } from "express";

import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { createChat, getChatMembers, getWorkspaceChats, joinChat } from "../../controllers/chats/index.js";
import { createMessage, deleteMessage, getChatMessages } from "../../controllers/messages/index.js";

const router = Router();

// we need to verify whether user is logged in or not, so that we can extract id from itspayload
router.get("/:workspaceId/all", verifyToken, getWorkspaceChats);

router.put("/:workspaceId", verifyToken, createChat)
router.patch("/:workspaceId/:chatId/join", verifyToken, joinChat)
router.get("/:workspaceId/:chatId/members", verifyToken, getChatMembers)

// message routes
router.get("/:workspaceId/:chatId/message/all", verifyToken, getChatMessages)
router.put("/:workspaceId/:chatId/message", verifyToken, createMessage)
router.delete("/:workspaceId/:chatId/message", verifyToken, deleteMessage)

export default router;

