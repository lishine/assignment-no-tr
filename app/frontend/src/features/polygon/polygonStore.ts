import { useZustandCreate } from '../../utils/useZustandCreate'
import type { Polygon, Point, CreatePolygon } from '../../types/polygon.types'
import { polygonApiService } from '../../services/polygonApiService'

type PolygonState = {
    polygons: Polygon[]
    isLoading: boolean
    error: string | null
    isDrawing: boolean
    currentPoints: Point[]
    selectedPolygonId: number | null
    fetchPolygons: () => Promise<void>
    addPolygon: (name: string, points: Point[]) => Promise<void>
    removePolygon: (id: number) => Promise<void>
    startDrawing: () => void
    addPoint: (point: Point) => void
    finishDrawing: () => void
    setSelectedPolygonId: (id: number | null) => void
}

export const useAccessPolygonStore = () => {
    const usePolygonStore = useZustandCreate<PolygonState>('polygonStore', (set, get) => {
        return {
            polygons: [],
            isLoading: false,
            error: null,
            isDrawing: false,
            currentPoints: [],
            selectedPolygonId: null,

            fetchPolygons: async () => {
                set({ isLoading: true, error: null })
                try {
                    const polygons = await polygonApiService.fetchPolygons()
                    set({ polygons, isLoading: false })
                } catch (err) {
                    set({ error: (err as Error).message || 'Failed to fetch polygons', isLoading: false })
                }
            },

            addPolygon: async (name: string, points: Point[]) => {
                try {
                    const newPolygon = await polygonApiService.createPolygon({ name, points })
                    set((state) => ({
                        polygons: [...state.polygons, newPolygon],
                    }))
                } catch (err) {
                    console.error('Failed to add polygon:', err)
                }
            },

            removePolygon: async (id: number) => {
                try {
                    await polygonApiService.deletePolygon(id)
                    set((state) => ({
                        polygons: state.polygons.filter((polygon) => polygon.id !== id),
                    }))
                } catch (err) {
                    console.error('Failed to remove polygon:', err)
                }
            },

            startDrawing: () => {
                set({ isDrawing: true, currentPoints: [] })
            },

            addPoint: (point: Point) => {
                set((state) => ({
                    currentPoints: [...state.currentPoints, point],
                }))
            },

            finishDrawing: () => {
                set({ isDrawing: false, currentPoints: [] })
            },

            setSelectedPolygonId: (id: number | null) => {
                set({ selectedPolygonId: id })
            },
        }
    })
    return { usePolygonStore }
}
