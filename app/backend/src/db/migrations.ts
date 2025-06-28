import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from './connection.js' // your db connection

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface MigrationRecord {
    id: number
    filename: string
    executed_at: Date
}

const createMigrationsTable = async (): Promise<void> => {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) UNIQUE NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
    await db.query(createTableSQL)
}

const getExecutedMigrations = async (): Promise<string[]> => {
    try {
        const result = await db.query('SELECT filename FROM migrations ORDER BY id')
        return result.map((row: MigrationRecord) => row.filename)
    } catch (error) {
        // If migrations table doesn't exist, return empty array
        return []
    }
}

const recordMigration = async (filename: string): Promise<void> => {
    await db.query('INSERT INTO migrations (filename) VALUES ($1)', [filename])
}

export const runMigrations = async (): Promise<void> => {
    try {
        // Ensure migrations table exists
        await createMigrationsTable()

        // Get list of already executed migrations
        const executedMigrations = await getExecutedMigrations()

        // Get all migration files
        const migrationsDir = path.join(__dirname, 'migrations')
        const migrationFiles = await fs.readdir(migrationsDir)

        // Filter and sort migration files
        const sortedMigrations = migrationFiles.filter((file) => file.endsWith('.sql')).sort()

        // Find migrations that haven't been executed
        const pendingMigrations = sortedMigrations.filter((migration) => !executedMigrations.includes(migration))

        if (pendingMigrations.length === 0) {
            console.log('📦 No pending migrations')
            return
        }

        console.log(`📦 Found ${pendingMigrations.length} pending migration(s)`)

        // Run each pending migration
        for (const migrationFile of pendingMigrations) {
            const migrationPath = path.join(migrationsDir, migrationFile)
            const migrationSQL = await fs.readFile(migrationPath, 'utf8')

            console.log(`🔄 Running migration: ${migrationFile}`)

            // Run migration in a transaction
            await db.query('BEGIN')
            try {
                await db.query(migrationSQL)
                await recordMigration(migrationFile)
                await db.query('COMMIT')
                console.log(`✅ Completed migration: ${migrationFile}`)
            } catch (error) {
                await db.query('ROLLBACK')
                throw error
            }
        }

        console.log('✅ All migrations completed successfully')
    } catch (error) {
        console.error('❌ Error running migrations:', error)
        throw error
    }
}

// Optional: Function to check migration status
export const getMigrationStatus = async (): Promise<{
    executed: string[]
    pending: string[]
}> => {
    await createMigrationsTable()

    const executedMigrations = await getExecutedMigrations()
    const migrationsDir = path.join(__dirname, 'migrations')
    const migrationFiles = await fs.readdir(migrationsDir)

    const allMigrations = migrationFiles.filter((file) => file.endsWith('.sql')).sort()

    const pendingMigrations = allMigrations.filter((migration) => !executedMigrations.includes(migration))

    return {
        executed: executedMigrations,
        pending: pendingMigrations,
    }
}
