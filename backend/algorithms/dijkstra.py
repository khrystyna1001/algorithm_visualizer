import heapq

def dijkstra(graph, start_node):
    distances = {node: float('inf') for node in graph}
    distances[start_node] = 0
    priority_queue = [(0, start_node)]

    while priority_queue:

        current_distance, current_node = heapq.heappop(priority_queue)
        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight

            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))
                
    return distances

def main():
    graph = {
        'A': {'B': 1, 'C': 4},
        'B': {'A': 1, 'D': 2, 'E': 5},
        'C': {'A': 4, 'F': 3},
        'D': {'B': 2, 'G': 1},
        'E': {'B': 5, 'G': 2},
        'F': {'C': 3, 'G': 1},
        'G': {'D': 1, 'E': 2, 'F': 1}
    }

    start_node = 'A'
    shortest_paths = dijkstra(graph, start_node)
    print(f"Shortest paths from {start_node}: {shortest_paths}")

if __name__ == "__main__":
    main()