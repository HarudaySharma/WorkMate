import { Router } from "express";
import { deleteUser, login, OAuth, signup } from "../../controllers/auth";
import verifyToken from "../../middlewares/verifyToken.middleware.js";

const router = Router();

router.post("/login", login)
router.post("/signup", signup)
router.post("/oauth/:provider", OAuth)
router.delete("/delete", verifyToken, deleteUser)

export default router;

/*
 * POST /auth/login
 *  payload {
 *      email: string
 *      username: string
 *      password:
 *
 *  }
 *
 * POST /auth/signup
 *  payload {
 *      name: string
 *      username: string
 *      password: string
 *      email:  string
 *  }
 *
 *  POST /auth/oauth/:{google, github...}/
 *   payload {
 *      username:
 *      email:
 *      pfp:
 *   }
 *
 *
 */



