# Backend Integration Update - Summary

## Overview
This update integrates the frontend pipeline builder with a FastAPI backend, enabling users to submit their pipeline graphs for analysis. The integration includes:
1. **Frontend-Backend Communication**: Submit button now sends pipeline data to the backend
2. **Pipeline Analysis Endpoint**: Backend endpoint that analyzes pipeline structure
3. **DAG Detection**: Algorithm to determine if the pipeline forms a valid Directed Acyclic Graph
4. **User Feedback**: Alert system to display analysis results

## Changes Made

### 1. Frontend Submit Button Enhancement

The Submit button now communicates with the backend to analyze the pipeline.

**Features:**
- **Data Collection**: Retrieves current nodes and edges from the Zustand store
- **API Integration**: Sends POST request to `/pipelines/parse` endpoint
- **Error Handling**: Catches and displays errors if backend is unavailable
- **User Feedback**: Displays analysis results in a user-friendly alert dialog

**Implementation Details:**
- Uses `useStore` hook to access `nodes` and `edges` from Zustand store
- Sends JSON payload with nodes and edges arrays
- Handles async/await for API call
- Displays formatted alert with analysis results

**User Experience:**
- Click Submit button → Pipeline data sent to backend
- Backend analyzes pipeline → Returns node count, edge count, and DAG status
- Alert displays results → User sees formatted analysis

### 2. Backend Pipeline Analysis Endpoint

New POST endpoint `/pipelines/parse` that analyzes pipeline structure.

**Features:**
- **Node/Edge Counting**: Calculates total number of nodes and edges in pipeline
- **DAG Validation**: Determines if the pipeline graph is acyclic (no cycles)
- **CORS Support**: Configured to accept requests from frontend (localhost:3000)
- **JSON API**: Accepts and returns JSON data

**Implementation Details:**
- Changed from GET to POST method
- Accepts JSON body with `nodes` and `edges` arrays
- Uses Pydantic `BaseModel` for request validation
- Returns structured response: `{num_nodes, num_edges, is_dag}`

**Response Format:**
```json
{
  "num_nodes": 5,
  "num_edges": 4,
  "is_dag": true
}
```

### 3. DAG Detection Algorithm

Implemented cycle detection using Kahn's algorithm (topological sort).

**Algorithm Overview:**
- **Kahn's Algorithm**: Classic topological sort algorithm for DAG detection
- **In-Degree Tracking**: Counts incoming edges for each node
- **Queue-Based Processing**: Processes nodes with no incoming edges first
- **Cycle Detection**: If not all nodes can be processed, a cycle exists

**Implementation Details:**
- Builds adjacency list from edges
- Calculates in-degree for each node
- Processes nodes starting with in-degree 0
- Reduces in-degree of neighbors as nodes are processed
- Returns `True` if all nodes processed (DAG), `False` if cycle detected

**Edge Cases Handled:**
- Empty graph (no edges) → Returns `True` (valid DAG)
- Disconnected components → Handles correctly
- Self-loops → Detected as cycles
- Multiple cycles → Detected correctly

### 4. CORS Configuration

Added CORS middleware to enable frontend-backend communication.

**Configuration:**
- Allows requests from `http://localhost:3000` (React dev server)
- Enables all HTTP methods (`GET`, `POST`, `OPTIONS`, etc.)
- Allows all headers
- Enables credentials

**Why Needed:**
- Browsers enforce CORS policy for cross-origin requests
- Frontend (port 3000) and backend (port 8000) are different origins
- Preflight OPTIONS requests handled automatically

## Technical Implementation

### Frontend Changes

**File: `frontend/src/submit.js`**

**Key Components:**
1. **Store Integration**: 
   ```javascript
   const { nodes, edges } = useStore();
   ```

2. **API Call**:
   ```javascript
   const response = await fetch('http://localhost:8000/pipelines/parse', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ nodes, edges })
   });
   ```

3. **Response Handling**:
   ```javascript
   const data = await response.json();
   const message = `Pipeline Analysis:\n\n` +
                   `Number of Nodes: ${data.num_nodes}\n` +
                   `Number of Edges: ${data.num_edges}\n` +
                   `Is DAG: ${data.is_dag ? 'Yes' : 'No'}`;
   alert(message);
   ```

### Backend Changes

**File: `backend/main.py`**

**Key Components:**

1. **CORS Middleware**:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Request Model**:
   ```python
   class PipelineRequest(BaseModel):
       nodes: List[Dict[str, Any]]
       edges: List[Dict[str, Any]]
   ```

3. **Endpoint Handler**:
   ```python
   @app.post('/pipelines/parse')
   def parse_pipeline(pipeline: PipelineRequest):
       num_nodes = len(pipeline.nodes)
       num_edges = len(pipeline.edges)
       is_dag = check_dag(pipeline.edges)
       return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}
   ```

4. **DAG Detection Function**:
   - Builds graph adjacency list
   - Calculates in-degrees
   - Implements Kahn's algorithm
   - Returns boolean indicating if graph is acyclic

### DAG Detection Algorithm Details

**Step-by-Step Process:**

1. **Graph Construction**:
   - Iterate through edges
   - Build adjacency list: `graph[source] = [target1, target2, ...]`
   - Track in-degrees: `in_degree[node] = count of incoming edges`

2. **Initial Queue**:
   - Find all nodes with `in_degree == 0`
   - These are nodes with no dependencies (can be processed first)

3. **Topological Sort**:
   - While queue is not empty:
     - Remove node from queue
     - Increment processed count
     - For each neighbor:
       - Decrement neighbor's in-degree
       - If in-degree becomes 0, add to queue

4. **Cycle Detection**:
   - If `processed == total_nodes`: No cycle (DAG)
   - If `processed < total_nodes`: Cycle exists (not a DAG)

**Time Complexity**: O(V + E) where V = vertices (nodes), E = edges
**Space Complexity**: O(V + E) for graph and in-degree storage

## Files Changed

### Modified Files

1. **`frontend/src/submit.js`**:
   - Added store integration to access nodes and edges
   - Implemented `handleSubmit` async function
   - Added API call to backend endpoint
   - Added error handling and user alert

2. **`backend/main.py`**:
   - Added CORS middleware imports and configuration
   - Added Pydantic model for request validation
   - Changed endpoint from GET to POST
   - Changed from Form data to JSON body
   - Implemented node/edge counting logic
   - Implemented `check_dag()` function with Kahn's algorithm
   - Updated response format to match requirements

## Dependencies

### Backend Dependencies
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `pydantic`: Data validation

**Installation:**
```bash
pip install fastapi uvicorn
```

**Run Backend:**
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Dependencies
- No new dependencies required
- Uses existing `zustand` for state management
- Uses native `fetch` API for HTTP requests

## Benefits

1. **Pipeline Validation**: Users can verify their pipeline structure is valid (DAG)
2. **Structure Analysis**: Quick overview of pipeline complexity (node/edge counts)
3. **Error Prevention**: Detects cycles before pipeline execution
4. **User Feedback**: Clear, immediate feedback on pipeline structure
5. **Separation of Concerns**: Backend handles complex graph algorithms
6. **Scalable Architecture**: Easy to extend with additional analysis features

## Testing Scenarios

### 1. Basic Pipeline Submission
- Create simple pipeline (2-3 nodes, 1-2 edges)
- Click Submit
- Verify alert shows correct counts and DAG status

### 2. DAG Validation - Valid DAG
- Create linear pipeline: A → B → C
- Submit → Should show `is_dag: true`

### 3. DAG Validation - Cycle Detection
- Create cycle: A → B → C → A
- Submit → Should show `is_dag: false`

### 4. Empty Pipeline
- Create pipeline with nodes but no edges
- Submit → Should show `is_dag: true` (disconnected nodes are valid)

### 5. Complex Pipeline
- Create pipeline with multiple branches and merges
- Submit → Verify correct node/edge counts
- Verify DAG status is accurate

### 6. Error Handling
- Stop backend server
- Click Submit
- Verify error alert appears

### 7. CORS Testing
- Verify no CORS errors in browser console
- Verify OPTIONS preflight requests succeed

## Example Use Cases

### Use Case 1: Valid Linear Pipeline
```
Input → Transform → Output
```
**Expected Result:**
- `num_nodes: 3`
- `num_edges: 2`
- `is_dag: true`

### Use Case 2: Pipeline with Branch
```
Input → Split → [Branch1, Branch2] → Merge → Output
```
**Expected Result:**
- `num_nodes: 5`
- `num_edges: 5`
- `is_dag: true`

### Use Case 3: Pipeline with Cycle
```
A → B → C → A (cycle)
```
**Expected Result:**
-
