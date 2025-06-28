import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { app } from '../../../server'
import { Polygon, CreatePolygon } from '../polygonModel'
import { ServiceResponse } from '../../../common/models/serviceResponse'
import { polygonRepository } from '../polygonRepository'

vi.mock('../../../common/delay', () => ({
    api5000Delay: vi.fn().mockResolvedValue(undefined),
}))

describe('Polygon API Endpoints', () => {
    // Clear polygons before each test to ensure a clean state
    beforeEach(async () => {
        const allPolygons = await polygonRepository.findAll()
        for (const polygon of allPolygons) {
            await polygonRepository.delete(polygon.id)
        }
    })

    const comparePolygons = (expected: Polygon, actual: Polygon) => {
        expect(actual.id).toBe(expected.id)
        expect(actual.name).toBe(expected.name)
        expect(actual.points).toEqual(expected.points)
        expect(new Date(actual.created_at).toISOString()).toBe(new Date(expected.created_at).toISOString())
    }

    describe('POST /polygons', () => {
        it('should create a new polygon', async () => {
            const createDto: CreatePolygon = {
                name: 'Test Create Polygon',
                points: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                    { x: 2, y: 0 },
                ],
            }

            const response = await request(app).post('/polygons').send(createDto)
            const responseBody: ServiceResponse<Polygon> = response.body

            expect(response.statusCode).toBe(StatusCodes.CREATED)
            expect(responseBody.success).toBe(true)
            expect(responseBody.message).toBe('Polygon created successfully')
            expect(responseBody.responseObject.id).toBeDefined()
            expect(responseBody.responseObject.name).toBe(createDto.name)
            expect(responseBody.responseObject.points).toEqual(createDto.points)
        })

        it('should return bad request for invalid data', async () => {
            const invalidDto = { name: '', points: [] }
            const response = await request(app).post('/polygons').send(invalidDto)
            const responseBody: ServiceResponse<null> = response.body

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
            expect(responseBody.success).toBe(false)
            expect(responseBody.message).toContain('Invalid input')
        })

        it('should return bad request for insufficient points', async () => {
            const invalidDto = {
                name: 'Invalid Polygon',
                points: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                ],
            }
            const response = await request(app).post('/polygons').send(invalidDto)
            const responseBody: ServiceResponse<null> = response.body

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
            expect(responseBody.success).toBe(false)
            expect(responseBody.message).toContain('Invalid input')
        })
    })

    describe('GET /polygons', () => {
        it('should return an empty list if no polygons exist', async () => {
            const response = await request(app).get('/polygons')
            const responseBody: ServiceResponse<Polygon[]> = response.body

            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(responseBody.success).toBe(true)
            expect(responseBody.message).toBe('Polygons retrieved successfully')
            expect(responseBody.responseObject).toEqual([])
        })

        it('should return a list of polygons', async () => {
            const polygon1 = await polygonRepository.create({
                name: 'Polygon 1',
                points: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                    { x: 2, y: 0 },
                ],
            })
            const polygon2 = await polygonRepository.create({
                name: 'Polygon 2',
                points: [
                    { x: 0, y: 0 },
                    { x: 2, y: 2 },
                    { x: 4, y: 0 },
                ],
            })

            const response = await request(app).get('/polygons')
            const responseBody: ServiceResponse<Polygon[]> = response.body

            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(responseBody.success).toBe(true)
            expect(responseBody.message).toBe('Polygons retrieved successfully')
            expect(responseBody.responseObject.length).toBe(2)
            comparePolygons(polygon1, responseBody.responseObject.find((p) => p.id === polygon1.id)!)
            comparePolygons(polygon2, responseBody.responseObject.find((p) => p.id === polygon2.id)!)
        })
    })

    describe('GET /polygons/:id', () => {
        it('should return a polygon for a valid ID', async () => {
            const createdPolygon = await polygonRepository.create({
                name: 'Specific Polygon',
                points: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                    { x: 2, y: 0 },
                ],
            })

            const response = await request(app).get(`/polygons/${createdPolygon.id}`)
            const responseBody: ServiceResponse<Polygon> = response.body

            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(responseBody.success).toBe(true)
            expect(responseBody.message).toBe('Polygon retrieved successfully')
            comparePolygons(createdPolygon, responseBody.responseObject)
        })

        it('should return not found for a non-existent ID', async () => {
            const nonExistentId = 999
            const response = await request(app).get(`/polygons/${nonExistentId}`)
            const responseBody: ServiceResponse<null> = response.body

            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
            expect(responseBody.success).toBe(false)
            expect(responseBody.message).toBe('Polygon not found')
        })

        it('should return bad request for an invalid ID format', async () => {
            const invalidId = 'not-a-number'
            const response = await request(app).get(`/polygons/${invalidId}`)
            const responseBody: ServiceResponse<null> = response.body

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
            expect(responseBody.success).toBe(false)
            expect(responseBody.message).toContain('Invalid input')
        })
    })

    describe('DELETE /polygons/:id', () => {
        it('should delete a polygon successfully', async () => {
            const createdPolygon = await polygonRepository.create({
                name: 'To Be Deleted',
                points: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                    { x: 2, y: 0 },
                ],
            })

            const response = await request(app).delete(`/polygons/${createdPolygon.id}`)

            expect(response.statusCode).toBe(StatusCodes.OK)

            // Verify it's actually deleted
            const findResponse = await request(app).get(`/polygons/${createdPolygon.id}`)
            expect(findResponse.statusCode).toBe(StatusCodes.NOT_FOUND)
        })

        it('should return not found when trying to delete a non-existent polygon', async () => {
            const nonExistentId = 999
            const response = await request(app).delete(`/polygons/${nonExistentId}`)
            const responseBody: ServiceResponse<null> = response.body

            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
            expect(responseBody.success).toBe(false)
            expect(responseBody.message).toBe('Polygon not found')
        })

        it('should return bad request for an invalid ID format', async () => {
            const invalidId = 'not-a-number'
            const response = await request(app).delete(`/polygons/${invalidId}`)
            const responseBody: ServiceResponse<null> = response.body

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
            expect(responseBody.success).toBe(false)
            expect(responseBody.message).toContain('Invalid input')
        })
    })
})
