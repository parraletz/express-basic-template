import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000')
})

const env = envSchema.parse(process.env)

export const config = {
  env: env.NODE_ENV,
  port: parseInt(env.PORT, 10)
}
