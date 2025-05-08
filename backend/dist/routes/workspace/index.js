"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_middleware_js_1 = require("../../middlewares/verifyToken.middleware.js");
const index_js_1 = require("../../controllers/workspace/index.js");
const router = (0, express_1.Router)();
// we need to verify whether user is logged in or not, so that we can extract id from itspayload
router.get("/all", verifyToken_middleware_js_1.verifyToken, index_js_1.getUserWorkspaces);
router.get("/inviteToken", verifyToken_middleware_js_1.verifyToken, index_js_1.getInviteToken);
router.get("/:workspaceId/members", verifyToken_middleware_js_1.verifyToken, index_js_1.getWorkspaceMembers);
router.get("/:workspaceId", verifyToken_middleware_js_1.verifyToken, index_js_1.getWorkspace);
router.put("/", verifyToken_middleware_js_1.verifyToken, index_js_1.createWorkspace);
router.delete("/:workspaceId", verifyToken_middleware_js_1.verifyToken, index_js_1.deleteWorkspace);
router.delete("/:workspaceId/member", verifyToken_middleware_js_1.verifyToken, index_js_1.removeWorkspaceMember);
router.patch("/:inviteLink/join", verifyToken_middleware_js_1.verifyToken, index_js_1.joinWorkspace);
router.patch("/:workspaceId", verifyToken_middleware_js_1.verifyToken, index_js_1.leaveWorkspace);
router.patch("/:workspaceId/modify/member", verifyToken_middleware_js_1.verifyToken, index_js_1.modifyWorkspaceMember);
// INFO:
//  1. user can create workspace
//  2. users can join a workspace -> via invite link.
//  3. what more about workspaces???? ->
// ROUTES
// type WorkSpace = {
// 	// each workspace is a container for all kinds of functionality
// 	id: string, // workSpace id
// 	inviteLink: string, // to let users join this particular workspace
// 	name: string,
// 	members: Member[], // join requests should also be there.
//     chats: string[] // Foreign Key (Chat.id)
//     // multiple chats in one workspace (one-one or group chats)
// }
// GET /api/workspace/:id
//  response payload {
//      id: number;
//      name: string;
//      inviteLink: string; // only if they are the member
//      memberData: {
//          //the member specific information for that workspace
//          kanbans
//      }
//
//  }
//
//  GET /api/workspace/:id/chats/
//      response payload {
//          chats: // all the chats in the workspace
//      }
//  GET /api/workspace/:id/members/
//      response payload {
//          members: // all the chats in the workspace
//      }
//
//  GET /api/workspace/:id/u/:userId/chats/
//      response payload {
//          chats: // chats of the workspace in which user is a participant
//      }
//
//
exports.default = router;
