import { z } from "zod"

const envSchema = z.object({
    VITE_API_URL: z.string().nonempty(),
    VITE_GOOGLE_CLIENT_ID: z.string().nonempty(),
})

const env = envSchema.parse(import.meta.env)

export default env




