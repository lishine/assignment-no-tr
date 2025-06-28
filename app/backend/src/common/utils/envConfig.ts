import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const PORT = 3100
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

    HOST: z.string().min(1).default('localhost'),

    PORT: z.coerce.number().int().positive().default(PORT),

    CORS_ORIGIN: z.string().url().default(`http://localhost:${PORT}`),

    COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(1000),

    COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),

    POSTGRES_USER: z.string().default('postgres'),
    POSTGRES_PASSWORD: z.string().default('postgres'),
    POSTGRES_HOST: z.string().default('localhost'),
    POSTGRES_PORT: z.string().default('5432'),
    POSTGRES_DB: z.string().default('polygon_db'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format())
    throw new Error('Invalid environment variables')
}

export const env = {
    ...parsedEnv.data,
    isDevelopment: parsedEnv.data.NODE_ENV === 'development',
    isProduction: parsedEnv.data.NODE_ENV === 'production',
    isTest: parsedEnv.data.NODE_ENV === 'test',
}
