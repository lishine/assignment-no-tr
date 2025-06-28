import { db } from '../../db/connection'
import { CreatePolygon, Polygon } from './polygonModel'

export const polygonRepository = {
    async create(polygon: CreatePolygon): Promise<Polygon> {
        const result = await db.query<Polygon>('INSERT INTO polygons (name, points) VALUES ($1, $2) RETURNING *', [
            polygon.name,
            JSON.stringify(polygon.points),
        ])
        return result[0]
    },

    async findAll(): Promise<Polygon[]> {
        return db.query<Polygon>('SELECT * FROM polygons ORDER BY created_at DESC')
    },

    async findById(id: number): Promise<Polygon | null> {
        const result = await db.query<Polygon>('SELECT * FROM polygons WHERE id = $1', [id])
        return result[0] || null
    },

    async delete(id: number): Promise<boolean> {
        const result = await db.query<Polygon>('DELETE FROM polygons WHERE id = $1 RETURNING *', [id])
        return result.length > 0
    },
}
