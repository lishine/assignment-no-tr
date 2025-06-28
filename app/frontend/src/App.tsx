import './App.css' // Keep global styles if any, or remove if not needed
import PolygonManager from './features/polygon/PolygonManager'

const App = () => {
    return (
        <>
            {/* Global styles can be placed here or in index.css / App.css */}
            <div className="container">
                <PolygonManager />
            </div>
            <style jsx global>{`
                body {
                    font-family:
                        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                * {
                    box-sizing: border-box;
                }
            `}</style>
        </>
    )
}

export default App
