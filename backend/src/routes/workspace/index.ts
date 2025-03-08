import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken.middleware.js";
import { createWorkspace } from "../../controllers/workspace/index.js";

const router = Router();

router.get(":/workspaceId", );
// we need to verify whether user is logged in or not, so that we can extract id from itspayload
router.post("/create", verifyToken, createWorkspace)

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


export default router;
