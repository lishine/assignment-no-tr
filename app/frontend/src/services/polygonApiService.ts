import { ofetch, FetchError } from 'ofetch'
import type { Polygon, CreatePolygon } from '../types/polygon.types'
import type { ServiceResponse } from '../types/todo.types' // Reusing ServiceResponse type

const API_BASE_URL = 'http://localhost:3100' // As per instructions

export const polygonApiService = {
    fetchPolygons: async (): Promise<Polygon[]> => {
        try {
            const serviceResponse = await ofetch<ServiceResponse<Polygon[]>>('/polygons', { baseURL: API_BASE_URL })
            if (serviceResponse.success && serviceResponse.responseObject !== undefined) {
                return serviceResponse.responseObject
            } else {
                throw new Error(serviceResponse.message || 'Failed to fetch polygons but API reported success.')
            }
        } catch (error: unknown) {
            if (error instanceof FetchError && error.data) {
                throw error.data // This is the ServiceResponse from the backend on HTTP error
            }
            throw error // For other unexpected errors
        }
    },

    createPolygon: async (polygonData: CreatePolygon): Promise<Polygon> => {
        try {
            const serviceResponse = await ofetch<ServiceResponse<Polygon>>('/polygons', {
                method: 'POST',
                body: polygonData,
                baseURL: API_BASE_URL,
            })
            if (serviceResponse.success && serviceResponse.responseObject) {
                return serviceResponse.responseObject
            } else {
                throw new Error(serviceResponse.message || 'Failed to create polygon but API reported success.')
            }
        } catch (error: unknown) {
            if (error instanceof FetchError && error.data) {
                throw error.data
            }
            throw error
        }
    },

    deletePolygon: async (id: number): Promise<void> => {
        try {
            await ofetch<void>(`/polygons/${id}`, {
                method: 'DELETE',
                baseURL: API_BASE_URL,
            })
            return
        } catch (error: unknown) {
            if (error instanceof FetchError && error.data) {
                throw error.data
            }
            throw error
        }
    },
}
