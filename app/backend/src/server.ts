import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'
import { pino } from 'pino'

import { openAPIRouter } from './api-docs/openAPIRouter'
import { healthCheckRouter } from './api/healthCheck/healthCheckRouter'
import { polygonRouter } from './api/polygon/polygonRouter'
import errorHandler from './common/middleware/errorHandler'
import rateLimiter from './common/middleware/rateLimiter'
import requestLogger from './common/middleware/requestLogger'
import { env } from './common/utils/envConfig'

const logger = pino({ name: 'server start' })
const app: Express = express()

app.set('trust proxy', true)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(helmet())
app.use(rateLimiter)

app.use(requestLogger)

app.use('/health-check', healthCheckRouter)

app.use('/polygons', polygonRouter)

app.use(openAPIRouter)

app.use(errorHandler())

export { app, logger }
