import { env } from './common/utils/envConfig'
import { app, logger } from './server'
import { runMigrations, getMigrationStatus } from './db/migrations'

console.log({ NODE_ENV: env.NODE_ENV })

const startServer = async (): Promise<void> => {
    try {
        // Run migrations before starting server
        await runMigrations()

        // Optional: Log migration status
        const status = await getMigrationStatus()
        console.log(`📊 Migration Status:`)
        console.log(`   Executed: ${status.executed.length}`)
        console.log(`   Pending: ${status.pending.length}`)

        // Start your Express server
        const server = app.listen(env.PORT, () => {
            const { NODE_ENV, HOST, PORT } = env
            logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`)
        })

        const onCloseSignal = () => {
            logger.info('sigint received, shutting down')
            server.close(() => {
                logger.info('server closed')
                process.exit()
            })
            setTimeout(() => {
                return process.exit(1)
            }, 10000).unref() // Force shutdown after 10s
        }

        process.on('SIGINT', onCloseSignal)
        process.on('SIGTERM', onCloseSignal)
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
