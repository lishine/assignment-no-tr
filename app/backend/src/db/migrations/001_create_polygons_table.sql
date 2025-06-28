CREATE TABLE polygons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    points JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for better JSONB query performance
CREATE INDEX idx_polygons_points ON polygons USING GIN (points);