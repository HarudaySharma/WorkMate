import jwt from "jsonwebtoken";
import env from "../zod.js";
import { User } from "../database_schema.js";
import { JWTPayload } from "../types/index.js";
import logger from "../logger.js";

export const generateToken = (user: Pick<User, "name" | "profile_picture" | "username" | "email" | "id">) => {
    const payload: JWTPayload = {
        data: {
            user: user,
        }
    }

    logger.info({ "token_payload: data": payload.data })

    return jwt.sign(payload, env.JWT_SECRET, { algorithm: "HS256" });
}



