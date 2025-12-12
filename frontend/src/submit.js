// submit.js
import { useState } from 'react';
import { useStore } from './store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';

export const SubmitButton = () => {
    const { nodes, edges } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
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
            setResultData(data);
            setShowResultDialog(true);
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            setError('Error submitting pipeline. Please make sure the backend is running.');
            setShowResultDialog(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center">
                <button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-8 py-3 bg-slate-700 dark:bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[140px]"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Submit Pipeline'
                    )}
                </button>
            </div>

            {/* Results Dialog - Centered Popup */}
            <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {error ? '⚠️ Error' : '📊 Pipeline Analysis Results'}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            {error ? 'An error occurred while processing your pipeline.' : 'Analysis of your pipeline structure:'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        {error ? (
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        ) : resultData ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                                    <span className="text-base font-medium text-slate-700 dark:text-slate-300">Number of Nodes</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{resultData.num_nodes}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                                    <span className="text-base font-medium text-slate-700 dark:text-slate-300">Number of Edges</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{resultData.num_edges}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                                    <span className="text-base font-medium text-slate-700 dark:text-slate-300">Is DAG</span>
                                    <span className={`text-lg font-bold ${resultData.is_dag ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {resultData.is_dag ? '✓ Yes' : '✗ No'}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <DialogFooter>
                        <button
                            onClick={() => setShowResultDialog(false)}
                            className="w-full sm:w-auto px-6 py-2.5 bg-slate-700 dark:bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                        >
                            Close
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
