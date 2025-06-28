import React, { useEffect } from 'react'
import { useAccessPolygonStore } from './polygonStore'
import PolygonCanvas from './PolygonCanvas'
import PolygonList from './PolygonList'
import AddPolygonForm from './AddPolygonForm'

const PolygonManager = () => {
    const { usePolygonStore } = useAccessPolygonStore()
    const isLoading = usePolygonStore((state) => state.isLoading)
    const error = usePolygonStore((state) => state.error)
    const isDrawing = usePolygonStore((state) => state.isDrawing)
    const currentPoints = usePolygonStore((state) => state.currentPoints)
    const startDrawing = usePolygonStore((state) => state.startDrawing)
    const finishDrawing = usePolygonStore((state) => state.finishDrawing)
    const addPoint = usePolygonStore((state) => state.addPoint)
    const addPolygon = usePolygonStore((state) => state.addPolygon)

    useEffect(() => {
        usePolygonStore.getState().fetchPolygons()
    }, [usePolygonStore])

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawing) {
            const canvas = event.currentTarget
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            addPoint({ x, y })
        }
    }

    const handleFinishDrawing = (polygonName: string) => {
        if (currentPoints.length >= 3) {
            addPolygon(polygonName, currentPoints)
            finishDrawing()
        } else {
            alert('A polygon must have at least 3 points.')
        }
    }

    if (isLoading) {
        return <p>Loading polygons...</p>
    }

    if (error) {
        return <p>Error fetching polygons: {error}</p>
    }

    return (
        <div className="polygon-manager-container">
            <div className="canvas-section">
                <PolygonCanvas onCanvasClick={handleCanvasClick} isDrawing={isDrawing} currentPoints={currentPoints} />
                {isDrawing && currentPoints.length > 0 && (
                    <button onClick={() => handleFinishDrawing(`Polygon ${Date.now()}`)}>Finish Drawing</button>
                )}
            </div>
            <div className="sidebar-section">
                <h1>Polygons</h1>
                <button onClick={startDrawing} disabled={isDrawing}>
                    Create New Polygon
                </button>
                <PolygonList />
                {isDrawing && currentPoints.length >= 3 && (
                    <AddPolygonForm onSave={handleFinishDrawing} onCancel={finishDrawing} />
                )}
            </div>

            <style jsx>{`
                .polygon-manager-container {
                    display: flex;
                    gap: 20px;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                .canvas-section {
                    flex: 2;
                    gap: 10px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .sidebar-section {
                    flex: 1;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 20px;
                }
                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                }
                button {
                    padding: 10px 15px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    )
}

export default PolygonManager
