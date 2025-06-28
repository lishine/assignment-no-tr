import { useAccessPolygonStore } from '../polygonStore'

export const PolygonList = () => {
    const { usePolygonStore } = useAccessPolygonStore()
    const polygons = usePolygonStore((state) => state.polygons)
    const removePolygon = usePolygonStore((state) => state.removePolygon)
    const selectedPolygonId = usePolygonStore((state) => state.selectedPolygonId)
    const setSelectedPolygonId = usePolygonStore((state) => state.setSelectedPolygonId)
    const isDrawing = usePolygonStore((state) => state.isDrawing)

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this polygon?')) {
            removePolygon(id)
        }
    }

    return (
        <div className="polygon-list-container">
            {!isDrawing && polygons.length === 0 && <p className="empty-message">No polygons yet. Create one!</p>}
            <ul>
                {polygons.map((polygon) => (
                    <li
                        key={polygon.id}
                        className={polygon.id === selectedPolygonId ? 'selected' : ''}
                        onClick={() => setSelectedPolygonId(polygon.id)}
                    >
                        <span>{polygon.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(polygon.id)
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <style jsx>{`
                .empty-message {
                    margin-top: 150px;
                    color: #999;
                }
                .polygon-list-container {
                    margin-top: 20px;
                }
                ul {
                    list-style: none;
                    padding: 0;
                }
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border: 1px solid #eee;
                    margin-bottom: 5px;
                    border-radius: 5px;
                    cursor: pointer;
                    background-color: #f9f9f9;
                }
                li.selected {
                    border-color: #007bff;
                    background-color: #e6f2ff;
                }
                li span {
                    flex-grow: 1;
                }
                li button {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 14px;
                }
                li button:hover {
                    background-color: #c82333;
                }
            `}</style>
        </div>
    )
}
