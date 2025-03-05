import { Router } from "express";
import { login, oAuth, signup } from "../../controllers/auth";

const router = Router();

router.post("/login", login)
router.post("/signup", signup)
router.post("/oauth/:provider", oAuth)

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



