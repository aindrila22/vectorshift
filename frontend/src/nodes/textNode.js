// textNode.js

import { useState, useEffect, useRef, useMemo } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [dimensions, setDimensions] = useState({ width: 200, height: 80 });
  const measureRef = useRef(null);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Allow Shift+Enter to create new line, prevent default Enter behavior
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
    // Shift+Enter will work naturally with textarea
  };

  // Extract variables from text (e.g., "{{input}}" -> "input")
  const extractVariables = useMemo(() => {
    const variablePattern = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
    const matches = [];
    let match;
    
    while ((match = variablePattern.exec(currText)) !== null) {
      const varName = match[1].trim();
      if (varName && !matches.includes(varName)) {
        matches.push(varName);
      }
    }
    
    return matches;
  }, [currText]);

  // Measure actual text width and height for accurate sizing
  useEffect(() => {
    // Use a debounce to reduce flickering
    const timeoutId = setTimeout(() => {
      if (measureRef.current) {
        const minWidth = 250;
        const maxWidth = 600;
        const minHeight = 100;
        
        // Split text by newlines to handle multi-line
        const lines = currText.split('\n');
        
        // Find the longest line for width calculation
        // For continuous text, we'll use a more stable approach
        let maxLineWidth = 0;
        const textareaPadding = 16; // px-2 = 8px on each side
        const nodePadding = 24; // p-3 = 12px on each side
        const availableWidth = maxWidth - textareaPadding - nodePadding - 20; // Available width for text
        
        // Check if text contains continuous characters (no spaces)
        const hasContinuousText = lines.some(line => line.length > 30 && !line.includes(' '));
        
        lines.forEach(line => {
          if (line.trim()) {
            // Set the measurement element to the line
            measureRef.current.textContent = line;
            measureRef.current.style.whiteSpace = 'nowrap';
            const lineWidth = measureRef.current.offsetWidth || measureRef.current.scrollWidth;
            
            // For continuous text, use a stable width to prevent flickering
            if (hasContinuousText && lineWidth > availableWidth) {
              // Continuous text - use available width to allow wrapping (stable)
              maxLineWidth = Math.max(maxLineWidth, availableWidth);
            } else if (lineWidth <= availableWidth) {
              // Normal text that fits - use actual width
              maxLineWidth = Math.max(maxLineWidth, lineWidth);
            } else {
              // Long text with spaces - cap at available width
              maxLineWidth = Math.max(maxLineWidth, availableWidth);
            }
          }
        });
        
        // If no text or very short, use minimum
        if (maxLineWidth === 0) {
          maxLineWidth = minWidth - textareaPadding - nodePadding - 20;
        }
        
        // For continuous text, ensure we use a stable width
        if (hasContinuousText) {
          maxLineWidth = Math.max(maxLineWidth, availableWidth);
        }
        
        // Calculate padding and borders
        const textareaBorder = 2; // border width = 2px total
        const extraSpace = 20; // Some extra space for better UX
        
        // Calculate total width needed (based on longest line, but stable for continuous text)
        const totalWidth = maxLineWidth + textareaPadding + textareaBorder + nodePadding + extraSpace;
        const calculatedWidth = Math.max(minWidth, Math.min(maxWidth, totalWidth));
        
        // Calculate height based on actual text content
        // Use a textarea-like measurement for better accuracy
        const titleSectionHeight = 40; // Header with padding
        const labelHeight = 16; // Label height
        const lineHeight = 22; // Approximate line height in textarea (more accurate)
        const minTextareaHeight = 60; // Minimum textarea height
        const textareaPaddingVertical = 8; // py-1 = 4px top and bottom
        
        // Calculate how many lines the text will actually take
        // Account for word wrapping in the textarea
        const textareaWidth = calculatedWidth - nodePadding - textareaPadding - textareaBorder;
        let totalLines = 0;
        
        lines.forEach(line => {
          if (line.trim()) {
            measureRef.current.textContent = line;
            measureRef.current.style.width = `${textareaWidth}px`;
            measureRef.current.style.whiteSpace = 'normal';
            measureRef.current.style.wordBreak = 'break-word';
            const lineHeightPx = measureRef.current.offsetHeight || lineHeight;
            const linesForThisLine = Math.max(1, Math.ceil(lineHeightPx / lineHeight));
            totalLines += linesForThisLine;
          } else {
            totalLines += 1; // Empty line
          }
        });
        
        const textareaHeight = Math.max(
          minTextareaHeight, 
          (totalLines * lineHeight) + textareaPaddingVertical
        );
        
        const gap = 4; // gap-1 = 4px
        const contentPadding = 24; // p-3 = 12px top and bottom
        
        const calculatedHeight = Math.max(
          minHeight, 
          titleSectionHeight + contentPadding + labelHeight + textareaHeight + gap
        );
        
        setDimensions({
          width: calculatedWidth,
          height: calculatedHeight
        });
      }
    }, 150); // Increased debounce to reduce flickering

    return () => clearTimeout(timeoutId);
  }, [currText]);

  // Dynamically create handles based on extracted variables
  const handles = useMemo(() => {
    const leftHandles = extractVariables.map((varName, index) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${varName}`,
      varName: varName, // Store variable name for labeling
      style: { 
        top: extractVariables.length === 1 
          ? '50%' 
          : `${((index + 1) * 100) / (extractVariables.length + 1)}%` 
      }
    }));

    return [
      ...leftHandles,
      {
        type: 'source',
        position: Position.Right,
        id: `${id}-output`
      }
    ];
  }, [id, extractVariables]);

  return (
    <>
      {/* Hidden element to measure text width */}
      <span
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          fontSize: '14px',
          fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: '400',
          padding: '0',
          margin: '0',
          border: 'none',
          zIndex: -1,
          pointerEvents: 'none',
          top: '-9999px',
          left: '-9999px',
          width: 'auto',
          height: 'auto'
        }}
      >
        {currText || '{{input}}'}
      </span>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <BaseNode
          id={id}
          data={data}
          title="Text"
          handles={handles}
          style={{
            width: dimensions.width,
            height: dimensions.height
          }}
        >
          <label className="flex flex-col gap-1 m-0">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Text</span>
            <textarea 
              value={currText} 
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              rows={Math.max(2, Math.ceil((dimensions.height - 100) / 22))}
              style={{ 
                width: '100%', 
                minWidth: '100px',
                minHeight: '60px',
                resize: 'vertical',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
              className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent font-mono overflow-hidden"
              placeholder="Type your text here. Use Shift+Enter for new lines."
            />
          </label>
        </BaseNode>
        
        {/* Variable labels next to left handles - positioned with space for edges */}
        {handles
          .filter(handle => handle.position === Position.Left && handle.varName)
          .map((handle, index) => {
            const topPercent = extractVariables.length === 1 
              ? '50%' 
              : `${((index + 1) * 100) / (extractVariables.length + 1)}%`;
            
            return (
              <div
                key={`${handle.id}-label`}
                className="absolute text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap pointer-events-none bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                style={{
                  left: '-90px', // Moved further left to give space for edges
                  top: topPercent,
                  transform: 'translateY(-50%)',
                  zIndex: 5,
                  minWidth: '60px',
                  textAlign: 'right' // Right align text so it's closer to the handle
                }}
              >
                {handle.varName}
              </div>
            );
          })}
      </div>
    </>
  );
}
