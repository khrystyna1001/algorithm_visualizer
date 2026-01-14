from flask_api import FlaskAPI
from flask import Flask
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from algorithms.dijkstra import dijkstra

app = FlaskAPI(__name__)
CORS(app)

@app.route('/dijkstra')
def dijkstra_endpoint():
    # Sample graph for visualization
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
    
    # Run the algorithm
    shortest_paths = dijkstra(graph, start_node)
    
    # Create visualization data
    return {
        'graph': graph,
        'start': start_node,
        'steps': generate_visualization_steps(graph, start_node, shortest_paths),
        'shortest_path': ['A', 'B', 'D', 'G'],  # Example shortest path
        'final_distances': shortest_paths
    }

def generate_visualization_steps(graph, start_node, final_distances):
    """Generate step-by-step visualization data"""
    steps = []
    visited = []
    unvisited = list(graph.keys())
    distances = {node: None for node in graph}
    distances[start_node] = 0
    
    # Simplified visualization steps
    for node in graph.keys():
        if node != start_node:
            current_distances = {k: (v if v != float('inf') else None) for k, v in distances.items()}
            
            steps.append({
                'current': node,
                'distances': current_distances,
                'unvisited': unvisited.copy(),
                'visited': visited.copy(),
                'final_distances': {k: (v if v != float('inf') else None) for k, v in final_distances.items()}
            })
            visited.append(node)
            if node in unvisited:
                unvisited.remove(node)
            distances[node] = final_distances[node]
    
    return steps

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
