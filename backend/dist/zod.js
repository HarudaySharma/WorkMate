"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let envSchema = zod_1.z.object({
    PORT: zod_1.z.string().nonempty(),
    WS_PORT: zod_1.z.string().nonempty(),
    SALT_LEN: zod_1.z.string().nonempty(),
    JWT_SECRET: zod_1.z.string().nonempty(),
    MYSQL_HOST: zod_1.z.string().nonempty(),
    MYSQL_USER: zod_1.z.string().nonempty(),
    MYSQL_USER_PASS: zod_1.z.string().nonempty(),
    MYSQL_DATABASE: zod_1.z.string().nonempty(),
    MYSQL_PORT: zod_1.z.string().nonempty(),
    GITHUB_OAUTH_CLIENT_ID: zod_1.z.string().nonempty(),
    GITHUB_OAUTH_CLIENT_SECRET: zod_1.z.string().nonempty(),
    GITHUB_OAUTH_REDIRECT_URI: zod_1.z.string().nonempty(),
});
const env = envSchema.parse(process.env);
exports.default = env;
