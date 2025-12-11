// splitNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const SplitNode = ({ id, data }) => {
  const [splitBy, setSplitBy] = useState(data?.splitBy || 'newline');
  const [maxOutputs, setMaxOutputs] = useState(data?.maxOutputs || 3);

  const handleSplitByChange = (e) => {
    setSplitBy(e.target.value);
  };

  const handleMaxOutputsChange = (e) => {
    setMaxOutputs(parseInt(e.target.value) || 1);
  };

  // Dynamically generate handles based on maxOutputs
  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`
    },
    ...Array.from({ length: Math.min(maxOutputs, 5) }, (_, i) => ({
      type: 'source',
      position: Position.Right,
      id: `${id}-output${i + 1}`,
      style: { top: `${((i + 1) * 100) / (Math.min(maxOutputs, 5) + 1)}%` }
    }))
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Split"
      handles={handles}
      style={{ backgroundColor: '#fce4ec', height: Math.max(100, maxOutputs * 20 + 60) }}
    >
      <label>
        Split By:
        <select value={splitBy} onChange={handleSplitByChange}>
          <option value="newline">Newline</option>
          <option value="comma">Comma</option>
          <option value="space">Space</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      <label>
        Max Outputs:
        <input 
          type="number" 
          min="1" 
          max="5" 
          value={maxOutputs} 
          onChange={handleMaxOutputsChange} 
        />
      </label>
    </BaseNode>
  );
}

