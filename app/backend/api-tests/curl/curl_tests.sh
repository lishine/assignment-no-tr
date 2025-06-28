#!/bin/bash

BASE_URL="http://localhost:3100"
POLYGON_ID_PLACEHOLDER="123e4567-e89b-12d3-a456-426614174001"

echo "### Health Check ###"
# Expected: { "success": true, "message": "Service is healthy", "responseObject": null, "statusCode": 200 }
curl -X GET "${BASE_URL}/health-check"
echo -e "\n"

echo "### Create Polygon ###"
# Expected: { "success": true, "message": "Polygon created successfully", "responseObject": { ...new_polygon }, "statusCode": 201 }
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "P1", "points": [{"x": 12.3, "y": 12.0}, {"x": 16.3, "y": 12.0}, {"x": 16.3, "y": 8.0}, {"x": 12.3, "y": 8.0}]}' \
  "${BASE_URL}/polygons"
echo -e "\n"

echo "### Get All Polygons ###"
# Expected: { "success": true, "message": "Polygons retrieved successfully", "responseObject": [ ...polygons ], "statusCode": 200 }
curl -X GET "${BASE_URL}/polygons"
echo -e "\n"

echo "### Delete Polygon by ID ###"
# Expected: Empty body, Status 204
curl -X DELETE "${BASE_URL}/polygons/${POLYGON_ID_PLACEHOLDER}" -v
echo -e "\n"