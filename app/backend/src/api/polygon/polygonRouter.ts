import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { type Router } from 'express'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders'
import { validateRequest } from '../../common/utils/httpHandlers'
import { polygonController } from './polygonController'
import { CreatePolygonSchema, PolygonSchema, PolygonPathParamsSchema } from './polygonModel'

export const polygonRegistry = new OpenAPIRegistry()
export const polygonRouter: Router = express.Router()

polygonRegistry.register('Polygon', PolygonSchema)

// POST /polygons - Create a new polygon
polygonRegistry.registerPath({
    method: 'post',
    path: '/polygons',
    tags: ['Polygon'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: CreatePolygonSchema,
                },
            },
        },
    },
    responses: {
        ...createApiResponse(PolygonSchema, 'Polygon created successfully', StatusCodes.CREATED),
        ...createApiResponse(
            z.object({ message: z.string(), errors: z.any().optional() }),
            'Invalid request body',
            StatusCodes.BAD_REQUEST
        ),
    },
})
polygonRouter.post('/', validateRequest(z.object({ body: CreatePolygonSchema })), polygonController.createPolygon)

// GET /polygons - Get all polygons
polygonRegistry.registerPath({
    method: 'get',
    path: '/polygons',
    tags: ['Polygon'],
    responses: createApiResponse(z.array(PolygonSchema), 'Polygons retrieved successfully'),
})
polygonRouter.get('/', polygonController.getAllPolygons)

// DELETE /polygons/:id - Remove a polygon
polygonRegistry.registerPath({
    method: 'delete',
    path: '/polygons/{id}',
    tags: ['Polygon'],
    request: { params: PolygonPathParamsSchema.shape.params },
    responses: {
        ...createApiResponse(z.null(), 'Polygon deleted successfully', StatusCodes.NO_CONTENT),
        ...createApiResponse(z.null(), 'Polygon not found', StatusCodes.NOT_FOUND),
    },
})
polygonRouter.delete('/:id', validateRequest(PolygonPathParamsSchema), polygonController.deletePolygon)
