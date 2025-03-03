import { z } from "zod"
import { config } from "dotenv"

config()

let envSchema = z.object({
    PORT: z.string().nonempty(),
})

const env = envSchema.parse(process.env)

export default env



