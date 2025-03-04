import { User } from "../database_schema.js";

export interface JWTPayload {
    data: {
        user: Pick<User, "name" | "profile_picture" | "username" | "email" | "id">;
    }
}

