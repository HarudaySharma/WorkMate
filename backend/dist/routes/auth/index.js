"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../controllers/auth");
const router = (0, express_1.Router)();
router.post("/login", auth_1.login);
router.post("/signup", auth_1.signup);
router.post("/oauth/:provider", auth_1.oAuth);
exports.default = router;
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
