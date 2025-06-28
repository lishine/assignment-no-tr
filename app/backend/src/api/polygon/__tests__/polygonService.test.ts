import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import type { Mocked } from 'vitest'
import { polygonService } from '../polygonService'
import { polygonRepository } from '../polygonRepository'
import { CreatePolygon, Polygon, UpdatePolygon } from '../polygonModel'

vi.mock('../polygonRepository')

describe('polygonService', () => {
    let mockRepository: Mocked<typeof polygonRepository>
    const now = new Date()

    const mockPolygon: Polygon = {
        id: 1,
        name: 'Test Polygon',
        points: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
        created_at: now,
    }

    const mockPolygons: Polygon[] = [
        mockPolygon,
        {
            id: 2,
            name: 'Test Polygon 2',
            points: [
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 1, y: 2 },
            ],
            created_at: now,
        },
    ]

    beforeEach(() => {
        vi.resetAllMocks()
        mockRepository = polygonRepository as Mocked<typeof polygonRepository>
    })

    describe('createPolygon', () => {
        const createDto: CreatePolygon = {
            name: 'New Polygon',
            points: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
            ],
        }

        it('should create a new polygon successfully', async () => {
            const newPolygon: Polygon = { ...createDto, id: 1, created_at: now }
            mockRepository.create.mockResolvedValue(newPolygon)

            const result = await polygonService.createPolygon(createDto)

            expect(mockRepository.create).toHaveBeenCalledWith(createDto)
            expect(result.success).toBe(true)
            expect(result.statusCode).toBe(StatusCodes.OK)
            expect(result.message).toBe('Polygon created successfully')
            expect(result.responseObject).toEqual(newPolygon)
        })

        it('should handle validation errors during creation', async () => {
            const invalidDto = {
                name: '',
                points: [{ x: 0, y: 0 }], // Less than 3 points
            }

            const result = await polygonService.createPolygon(invalidDto as CreatePolygon)

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST)
            expect(result.message).toContain('Failed to create polygon')
        })

        it('should handle repository errors during creation', async () => {
            mockRepository.create.mockRejectedValue(new Error('Database error'))

            const result = await polygonService.createPolygon(createDto)

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST)
            expect(result.message).toBe('Database error')
        })
    })

    describe('getAllPolygons', () => {
        it('should return all polygons successfully', async () => {
            mockRepository.findAll.mockResolvedValue(mockPolygons)

            const result = await polygonService.getAllPolygons()

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
            expect(result.success).toBe(true)
            expect(result.statusCode).toBe(StatusCodes.OK)
            expect(result.message).toBe('Polygons retrieved successfully')
            expect(result.responseObject).toEqual(mockPolygons)
        })

        it('should handle repository errors when fetching all polygons', async () => {
            mockRepository.findAll.mockRejectedValue(new Error('Database error'))

            const result = await polygonService.getAllPolygons()

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(result.message).toBe('Database error')
            expect(result.responseObject).toEqual([])
        })
    })

    describe('getPolygonById', () => {
        it('should return a polygon for a valid ID', async () => {
            mockRepository.findById.mockResolvedValue(mockPolygon)

            const result = await polygonService.getPolygonById(1)

            expect(mockRepository.findById).toHaveBeenCalledWith(1)
            expect(result.success).toBe(true)
            expect(result.statusCode).toBe(StatusCodes.OK)
            expect(result.message).toBe('Polygon retrieved successfully')
            expect(result.responseObject).toEqual(mockPolygon)
        })

        it('should return not found for non-existent ID', async () => {
            mockRepository.findById.mockResolvedValue(null)

            const result = await polygonService.getPolygonById(999)

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
            expect(result.message).toBe('Polygon not found')
        })

        it('should handle repository errors when fetching by ID', async () => {
            mockRepository.findById.mockRejectedValue(new Error('Database error'))

            const result = await polygonService.getPolygonById(1)

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(result.message).toBe('Database error')
        })
    })

    describe('updatePolygon', () => {
        const updateDto: UpdatePolygon = {
            name: 'Updated Polygon',
            points: [
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 1, y: 2 },
            ],
        }

        it('should update a polygon successfully', async () => {
            const updatedPolygon: Polygon = { ...mockPolygon, ...updateDto }
            mockRepository.update.mockResolvedValue(updatedPolygon)

            const result = await polygonService.updatePolygon(1, updateDto)

            expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto)
            expect(result.success).toBe(true)
            expect(result.statusCode).toBe(StatusCodes.OK)
            expect(result.message).toBe('Polygon updated successfully')
            expect(result.responseObject).toEqual(updatedPolygon)
        })

        it('should return not found when updating non-existent polygon', async () => {
            mockRepository.update.mockResolvedValue(null)

            const result = await polygonService.updatePolygon(999, updateDto)

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
            expect(result.message).toBe('Polygon not found')
        })

        it('should handle validation errors during update', async () => {
            const invalidDto = {
                name: '',
                points: [{ x: 0, y: 0 }], // Less than 3 points
            }

            const result = await polygonService.updatePolygon(1, invalidDto as UpdatePolygon)

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST)
            expect(result.message).toContain('Failed to update polygon')
        })

        it('should handle repository errors during update', async () => {
            mockRepository.update.mockRejectedValue(new Error('Database error'))

            const result = await polygonService.updatePolygon(1, updateDto)

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST)
            expect(result.message).toBe('Database error')
        })
    })

    describe('deletePolygon', () => {
        it('should delete a polygon successfully', async () => {
            mockRepository.delete.mockResolvedValue(true)

            const result = await polygonService.deletePolygon(1)

            expect(mockRepository.delete).toHaveBeenCalledWith(1)
            expect(result.success).toBe(true)
            expect(result.statusCode).toBe(StatusCodes.OK)
            expect(result.message).toBe('Polygon deleted successfully')
        })

        it('should return not found when deleting non-existent polygon', async () => {
            mockRepository.delete.mockResolvedValue(false)

            const result = await polygonService.deletePolygon(999)

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
            expect(result.message).toBe('Polygon not found')
        })

        it('should handle repository errors during deletion', async () => {
            mockRepository.delete.mockRejectedValue(new Error('Database error'))

            const result = await polygonService.deletePolygon(1)

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(result.message).toBe('Database error')
        })
    })
})
