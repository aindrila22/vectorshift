from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    nodes = pipeline.nodes
    edges = pipeline.edges
    
    # Calculate number of nodes and edges
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Check if the pipeline is a DAG (Directed Acyclic Graph)
    is_dag = check_dag(edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }

def check_dag(edges: List[Dict[str, Any]]) -> bool:
    """
    Check if the graph formed by edges is a Directed Acyclic Graph (DAG).
    Uses topological sort (Kahn's algorithm) to detect cycles.
    """
    if not edges:
        return True  # Empty graph is a DAG
    
    # Build adjacency list and in-degree count
    graph = {}
    in_degree = {}
    
    # Initialize all nodes (from edges) with 0 in-degree
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        
        if source not in graph:
            graph[source] = []
        if target not in in_degree:
            in_degree[target] = 0
        if source not in in_degree:
            in_degree[source] = 0
        
        graph[source].append(target)
        in_degree[target] += 1
    
    # Find all nodes with in-degree 0
    queue = [node for node in in_degree if in_degree[node] == 0]
    processed = 0
    
    # Process nodes with no incoming edges
    while queue:
        node = queue.pop(0)
        processed += 1
        
        # Reduce in-degree of neighbors
        if node in graph:
            for neighbor in graph[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
    
    # If we processed all nodes, there's no cycle (it's a DAG)
    # If there are unprocessed nodes, there's a cycle
    return processed == len(in_degree)
