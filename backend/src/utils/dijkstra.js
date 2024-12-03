export const dijkstra = (graph, startNode) => {
    const distances = {};
    const visited = new Set();
    const priorityQueue = [];

    // Set initial distances to infinity, and distance to startNode to 0
    for (const node in graph) {
        distances[node] = Infinity;
    }
    distances[startNode] = 0;

    // Push the start node to the priority queue
    priorityQueue.push([0, startNode]); // [distance, node]

    while (priorityQueue.length) {
        // Sort by distance (priority queue based on the smallest distance)
        priorityQueue.sort((a, b) => a[0] - b[0]);
        const [currentDistance, currentNode] = priorityQueue.shift();

        if (visited.has(currentNode)) continue; // Skip already visited nodes
        visited.add(currentNode);

        // Update distances to each neighbor of the current node
        for (const neighbor in graph[currentNode]) {
            const distanceToNeighbor = graph[currentNode][neighbor];
            const totalDistance = currentDistance + distanceToNeighbor;

            if (totalDistance < distances[neighbor]) {
                distances[neighbor] = totalDistance;
                priorityQueue.push([totalDistance, neighbor]);
            }
        }
    }

    return distances; // Returns the shortest distances to all nodes from startNode
};
