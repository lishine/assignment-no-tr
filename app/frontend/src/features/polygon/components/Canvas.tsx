import { useRef, useEffect, useState } from 'react'
import type { Point, Polygon } from '../../../types/polygon.types'
import { useAccessPolygonStore } from '../polygonStore'

type PolygonCanvasProps = {
    onCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
    isDrawing: boolean
    currentPoints: Point[]
}

export const PolygonCanvas = ({ onCanvasClick, isDrawing, currentPoints }: PolygonCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { usePolygonStore } = useAccessPolygonStore()
    const polygons = usePolygonStore((state) => state.polygons)
    const selectedPolygonId = usePolygonStore((state) => state.selectedPolygonId)
    const setSelectedPolygonId = usePolygonStore((state) => state.setSelectedPolygonId)
    const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)

    useEffect(() => {
        const img = new Image()
        img.src = 'https://picsum.photos/1920/1080' // Random background image
        img.onload = () => {
            setBackgroundImage(img)
        }
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }

        const context = canvas.getContext('2d')
        if (!context) {
            return
        }

        context.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background image
        if (backgroundImage) {
            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
        }

        // Draw existing polygons
        polygons.forEach((polygon) => {
            drawPolygon(context, polygon, polygon.id === selectedPolygonId)
        })

        // Draw current drawing points
        if (isDrawing && currentPoints.length > 0) {
            context.strokeStyle = 'blue'
            context.lineWidth = 2
            context.beginPath()
            context.moveTo(currentPoints[0].x, currentPoints[0].y)
            for (let i = 1; i < currentPoints.length; i++) {
                context.lineTo(currentPoints[i].x, currentPoints[i].y)
            }
            context.stroke()

            currentPoints.forEach((point) => {
                context.beginPath()
                context.arc(point.x, point.y, 5, 0, 2 * Math.PI)
                context.fillStyle = 'red'
                context.fill()
            })
        }
    }, [polygons, isDrawing, currentPoints, backgroundImage, selectedPolygonId])

    const drawPolygon = (context: CanvasRenderingContext2D, polygon: Polygon, isSelected: boolean) => {
        context.beginPath()
        context.moveTo(polygon.points[0].x, polygon.points[0].y)
        for (let i = 1; i < polygon.points.length; i++) {
            context.lineTo(polygon.points[i].x, polygon.points[i].y)
        }
        context.closePath()

        context.strokeStyle = isSelected ? 'red' : 'green'
        context.lineWidth = isSelected ? 3 : 2
        context.stroke()
        context.fillStyle = 'rgba(0, 255, 0, 0.2)'
        context.fill()
    }

    const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            // Check if an existing polygon was clicked
            const canvas = canvasRef.current
            if (!canvas) {
                return
            }
            const rect = canvas.getBoundingClientRect()
            const clickX = event.clientX - rect.left
            const clickY = event.clientY - rect.top

            let clickedPolygon: Polygon | null = null
            for (const polygon of polygons) {
                if (isPointInPolygon(clickX, clickY, polygon.points)) {
                    clickedPolygon = polygon
                    break
                }
            }

            if (clickedPolygon) {
                setSelectedPolygonId(clickedPolygon.id)
            } else {
                setSelectedPolygonId(null) // Deselect if clicking outside any polygon
            }
        }
        onCanvasClick(event)
    }

    // Helper function to check if a point is inside a polygon (Ray Casting Algorithm)
    const isPointInPolygon = (px: number, py: number, poly: Point[]): boolean => {
        let inside = false
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i].x,
                yi = poly[i].y
            const xj = poly[j].x,
                yj = poly[j].y

            const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
            if (intersect) {
                inside = !inside
            }
        }
        return inside
    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onClick={handleCanvasMouseDown}
                style={{ border: '1px solid black' }}
            />
            <div>{isDrawing && <p className="drawing-message">Click on canvas to put points</p>}</div>

            <style jsx>{`
                .drawing-message {
                    margin-top: 10px;
                    color: green;
                    font-style: italic;
                    font-size: 18px;
                }
            }
            `}</style>
        </div>
    )
}
