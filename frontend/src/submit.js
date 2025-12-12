// submit.js
import { useStore } from './store';

export const SubmitButton = () => {
    const { nodes, edges } = useStore();

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodes: nodes,
                    edges: edges
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Display alert with the results
            const message = `Pipeline Analysis:\n\n` +
                          `Number of Nodes: ${data.num_nodes}\n` +
                          `Number of Edges: ${data.num_edges}\n` +
                          `Is DAG: ${data.is_dag ? 'Yes' : 'No'}`;
            
            alert(message);
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert('Error submitting pipeline. Please make sure the backend is running.');
        }
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <button type="button" onClick={handleSubmit}>Submit</button>
        </div>
    );
}
