1. Provide an api for the following actions:
a. Create polygon:
input: name, points
Result: save polygon
b. Delete polygon:
input: polygon id
Result: delete polygon
c. Fetching polygons:
No input
Result:
Return all the saved polygons in the following format:
[
{
"id": 1,
"name": "P1",
"points": [[12.3, 12.0], [16.3, 12.0], [16.3, 8.0], [12.3, 8.0]]
},
...
]
Notes:
● Use Python / NodeJS for the backend.
● Add sleep of 5 seconds when performing each of the actions
● The saved polygons should be persisted even after restarting the backend.
● You can use external libraries

2. Create a UI view that exposes the following functionality:
a. Load and draw existing polygons
b. Support deleting an existing polygons
c. Create new polygon
Notes:
● Use React / Angular for the frontend
● The drawn zones should be drawn by clicking on a canvas.
● The canvas background should be a random image from the following
source https://picsum.photos/1920/1080
● You can use external libraries

3. Optional
a. Add tests for api provided in the first step
b. Add tests for ui provided in second step
c. Dockerize the backend application