import { Request } from "express";
import { JWTPayload } from ".";

declare module "express" {
    export interface Request {
        head?: {
            viaEmail: boolean;
        };
        user?: Pick<User, "name" | "profile_picture" | "username" | "email" | "id">;
    }
}
