import { db } from '../../db/config'
import { CreatePolygon, Polygon, UpdatePolygon } from './polygonModel'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const OPERATION_DELAY = 5000 // 5 seconds delay for all operations

export const polygonRepository = {
    async create(polygon: CreatePolygon): Promise<Polygon> {
        await delay(OPERATION_DELAY)
        const result = await db.query<Polygon>('INSERT INTO polygons (name, points) VALUES ($1, $2) RETURNING *', [
            polygon.name,
            JSON.stringify(polygon.points),
        ])
        return result[0]
    },

    async findAll(): Promise<Polygon[]> {
        await delay(OPERATION_DELAY)
        return db.query<Polygon>('SELECT * FROM polygons ORDER BY created_at DESC')
    },

    async findById(id: number): Promise<Polygon | null> {
        await delay(OPERATION_DELAY)
        const result = await db.query<Polygon>('SELECT * FROM polygons WHERE id = $1', [id])
        return result[0] || null
    },

    async update(id: number, polygon: UpdatePolygon): Promise<Polygon | null> {
        await delay(OPERATION_DELAY)
        const updates: string[] = []
        const values: any[] = []
        let paramCount = 1

        if (polygon.name !== undefined) {
            updates.push(`name = $${paramCount}`)
            values.push(polygon.name)
            paramCount++
        }

        if (polygon.points !== undefined) {
            updates.push(`points = $${paramCount}`)
            values.push(JSON.stringify(polygon.points))
            paramCount++
        }

        if (updates.length === 0) {
            return null
        }

        values.push(id)
        const result = await db.query<Polygon>(
            `UPDATE polygons SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        )
        return result[0] || null
    },

    async delete(id: number): Promise<boolean> {
        await delay(OPERATION_DELAY)
        const result = await db.query<Polygon>('DELETE FROM polygons WHERE id = $1 RETURNING *', [id])
        return result.length > 0
    },
}
