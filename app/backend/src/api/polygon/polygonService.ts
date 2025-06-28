import { StatusCodes } from 'http-status-codes'
import { ServiceResponse } from '../../common/models/serviceResponse'
import { CreatePolygon, CreatePolygonSchema, Polygon, UpdatePolygon, UpdatePolygonSchema } from './polygonModel'
import { polygonRepository } from './polygonRepository'

export const polygonService = {
    async createPolygon(data: CreatePolygon): Promise<ServiceResponse<Polygon>> {
        try {
            const validatedData = CreatePolygonSchema.parse(data)
            const polygon = await polygonRepository.create(validatedData)
            return ServiceResponse.success('Polygon created successfully', polygon, StatusCodes.CREATED)
        } catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                return ServiceResponse.failure<Polygon>(
                    error.message,
                    {} as Polygon,
                    StatusCodes.BAD_REQUEST
                )
            }
            return ServiceResponse.failure<Polygon>(
                error instanceof Error ? error.message : 'Failed to create polygon',
                {} as Polygon,
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    },

    async getAllPolygons(): Promise<ServiceResponse<Polygon[]>> {
        try {
            const polygons = await polygonRepository.findAll()
            return ServiceResponse.success('Polygons retrieved successfully', polygons)
        } catch (error) {
            return ServiceResponse.failure<Polygon[]>(
                error instanceof Error ? error.message : 'Failed to fetch polygons',
                [] as Polygon[],
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    },

    async getPolygonById(id: number): Promise<ServiceResponse<Polygon>> {
        try {
            const polygon = await polygonRepository.findById(id)
            if (!polygon) {
                return ServiceResponse.failure<Polygon>('Polygon not found', {} as Polygon, StatusCodes.NOT_FOUND)
            }
            return ServiceResponse.success('Polygon retrieved successfully', polygon)
        } catch (error) {
            return ServiceResponse.failure<Polygon>(
                error instanceof Error ? error.message : 'Failed to fetch polygon',
                {} as Polygon,
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    },

    async updatePolygon(id: number, data: UpdatePolygon): Promise<ServiceResponse<Polygon>> {
        try {
            const validatedData = UpdatePolygonSchema.parse(data)
            const polygon = await polygonRepository.update(id, validatedData)
            if (!polygon) {
                return ServiceResponse.failure<Polygon>('Polygon not found', {} as Polygon, StatusCodes.NOT_FOUND)
            }
            return ServiceResponse.success('Polygon updated successfully', polygon)
        } catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                return ServiceResponse.failure<Polygon>(
                    error.message,
                    {} as Polygon,
                    StatusCodes.BAD_REQUEST
                )
            }
            return ServiceResponse.failure<Polygon>(
                error instanceof Error ? error.message : 'Failed to update polygon',
                {} as Polygon,
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    },

    async deletePolygon(id: number): Promise<ServiceResponse<Polygon>> {
        try {
            const deleted = await polygonRepository.delete(id)
            if (!deleted) {
                return ServiceResponse.failure<Polygon>('Polygon not found', {} as Polygon, StatusCodes.NOT_FOUND)
            }
            return ServiceResponse.success<Polygon>('Polygon deleted successfully', {} as Polygon)
        } catch (error) {
            return ServiceResponse.failure<Polygon>(
                error instanceof Error ? error.message : 'Failed to delete polygon',
                {} as Polygon,
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    },
}
