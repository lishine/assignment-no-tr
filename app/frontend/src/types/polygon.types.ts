export type Point = {
    x: number
    y: number
}

export type Polygon = {
    id: number
    name: string
    points: Point[]
    created_at: string // Assuming string for simplicity, will be Date object from backend
}

export type CreatePolygon = {
    name: string
    points: Point[]
}

export interface ServiceResponse<T = unknown> {
    // Using unknown for T default
    success: boolean
    message: string
    responseObject: T
    statusCode: number // Added statusCode as it's part of the backend response
}
