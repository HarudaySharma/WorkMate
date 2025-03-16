import { z } from "zod"
import { config } from "dotenv"

config()

let envSchema = z.object({
    PORT: z.string().nonempty(),
    SALT_LEN: z.string().nonempty(),
    JWT_SECRET: z.string().nonempty(),
    MYSQL_HOST: z.string().nonempty(),
    MYSQL_USER: z.string().nonempty(),
    MYSQL_USER_PASS: z.string().nonempty(),
    MYSQL_DATABASE: z.string().nonempty(),
    GITHUB_OAUTH_CLIENT_ID: z.string().nonempty(),
    GITHUB_OAUTH_CLIENT_SECRET: z.string().nonempty(),
    GITHUB_OAUTH_REDIRECT_URI: z.string().nonempty(),
})

const env = envSchema.parse(process.env)

export default env



