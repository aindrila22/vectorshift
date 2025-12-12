import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Set dark mode as default on initial load
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Pipeline Builder
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <PipelineToolbar />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 overflow-hidden">
          <PipelineUI isDark={isDark} />
        </div>

        {/* Footer with Submit Button */}
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-sm py-4">
          <SubmitButton />
        </footer>
      </div>
    </div>
  );
}

export default App;
