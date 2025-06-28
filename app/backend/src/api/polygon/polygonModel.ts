import { z } from 'zod'

export const PolygonPointSchema = z.object({
    x: z.number(),
    y: z.number(),
})

export const CreatePolygonSchema = z.object({
    name: z.string().min(1).max(255),
    points: z.array(PolygonPointSchema).min(3),
})

export const PolygonSchema = z.object({
    id: z.number(),
    name: z.string(),
    points: z.array(PolygonPointSchema),
    created_at: z.date(),
})

// Schema for validating ID in params for GET, PUT, DELETE requests
export const PolygonPathParamsSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/).transform(Number),
    }),
})

export type Point = z.infer<typeof PolygonPointSchema>
export type CreatePolygon = z.infer<typeof CreatePolygonSchema>
export interface Polygon {
    id: number
    name: string
    points: Point[]
    created_at: Date
}
