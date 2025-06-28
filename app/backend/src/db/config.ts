import { Pool } from 'pg'
import { env } from '../common/utils/envConfig'

const pool = new Pool({
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    host: env.POSTGRES_HOST,
    port: parseInt(env.POSTGRES_PORT),
    database: env.POSTGRES_DB,
})

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

export const db = {
    query: async <T = any>(text: string, params?: any[]): Promise<T[]> => {
        const client = await pool.connect()
        try {
            const result = await client.query(text, params)
            return result.rows
        } finally {
            client.release()
        }
    },
    getClient: () => pool.connect(),
}

export const initDatabase = async () => {
    const createPolygonsTable = `
    CREATE TABLE IF NOT EXISTS polygons (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      points JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

    try {
        await db.query(createPolygonsTable)
        console.log('✅ Database initialized successfully')
    } catch (error) {
        console.error('❌ Error initializing database:', error)
        throw error
    }
}
