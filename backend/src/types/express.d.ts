import { Request } from "express";
import { JWTPayload } from ".";
import { User } from "../database_schema";

declare module "express" {
    export interface Request {
        head?: {
            viaEmail: boolean;
        };
        user?: Pick<User, "name" | "profile_picture" | "username" | "email" | "id">;
    }
}
