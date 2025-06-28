import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { polygonService } from './polygonService'
import { CreatePolygonSchema, UpdatePolygonSchema } from './polygonModel'

export const polygonController = {
    async createPolygon(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = CreatePolygonSchema.parse(req.body)
            const result = await polygonService.createPolygon(validatedData)
            res.status(result.statusCode).json(result)
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : 'Invalid polygon data',
                responseObject: null,
                statusCode: StatusCodes.BAD_REQUEST,
            })
        }
    },

    async getAllPolygons(_req: Request, res: Response): Promise<void> {
        const result = await polygonService.getAllPolygons()
        res.status(result.statusCode).json(result)
    },

    async getPolygonById(req: Request, res: Response): Promise<void> {
        try {
            const result = await polygonService.getPolygonById(Number(req.params.id))
            res.status(result.statusCode).json(result)
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch polygon',
                responseObject: null,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            })
        }
    },

    async updatePolygon(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = UpdatePolygonSchema.parse(req.body)
            const result = await polygonService.updatePolygon(Number(req.params.id), validatedData)
            res.status(result.statusCode).json(result)
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : 'Invalid update data',
                responseObject: null,
                statusCode: StatusCodes.BAD_REQUEST,
            })
        }
    },

    async deletePolygon(req: Request, res: Response): Promise<void> {
        try {
            const result = await polygonService.deletePolygon(Number(req.params.id))
            res.status(result.statusCode).json(result)
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to delete polygon',
                responseObject: null,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            })
        }
    },
}
