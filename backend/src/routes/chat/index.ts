import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken.middleware.js";
import { createChat, getWorkspaceChats } from "../../controllers/chats/index.js";
import { createMessage, getMessages } from "../../controllers/messages/index.js";

const router = Router();

// we need to verify whether user is logged in or not, so that we can extract id from itspayload
router.get("/:workspaceId/all", verifyToken, getWorkspaceChats);

router.put("/:workspaceId", verifyToken, createChat)

// message routes
router.get("/:workspaceId/:chatId/messages", verifyToken, getMessages)
router.put("/:workspaceId/:chatId/messages", verifyToken, createMessage)

export default router;

