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

  // Measure actual text width for more accurate sizing
  useEffect(() => {
    if (measureRef.current) {
      const minWidth = 200;
      const minHeight = 70;
      const padding = 6;
      const titleHeight = 24;
      const labelHeight = 16;
      const inputHeight = 24;
      const gap = 4;
      
      // Measure text width - add minimal padding
      const textWidth = measureRef.current.offsetWidth;
      const calculatedWidth = Math.max(minWidth, Math.min(500, textWidth + padding));
      
      // Tighter height calculation
      const calculatedHeight = Math.max(minHeight, titleHeight + labelHeight + inputHeight + gap + padding);
      
      setDimensions({
        width: calculatedWidth,
        height: calculatedHeight
      });
    }
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
          whiteSpace: 'nowrap',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      >
        {currText || '{{input}}'}
      </span>
      <div style={{ position: 'relative' }}>
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
          <label style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: 0 }}>
            <span style={{ fontSize: '12px' }}>Text:</span>
            <input 
              type="text" 
              value={currText} 
              onChange={handleTextChange}
              style={{
                width: '100%',
                minWidth: '100px',
                padding: '2px 4px',
                fontSize: '14px'
              }}
            />
          </label>
        </BaseNode>
        
        {/* Variable labels next to left handles */}
        {handles
          .filter(handle => handle.position === Position.Left && handle.varName)
          .map((handle, index) => {
            const topPercent = extractVariables.length === 1 
              ? '50%' 
              : `${((index + 1) * 100) / (extractVariables.length + 1)}%`;
            
            return (
              <div
                key={`${handle.id}-label`}
                style={{
                  position: 'absolute',
                  left: '-50px',
                  top: topPercent,
                  transform: 'translateY(-50%)',
                  fontSize: '11px',
                  color: '#666',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  border: '1px solid #ddd'
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
