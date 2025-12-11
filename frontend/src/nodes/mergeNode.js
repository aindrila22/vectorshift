// mergeNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const MergeNode = ({ id, data }) => {
  const [mergeStrategy, setMergeStrategy] = useState(data?.mergeStrategy || 'concat');

  const handleStrategyChange = (e) => {
    setMergeStrategy(e.target.value);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input1`,
      style: { top: '25%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input2`,
      style: { top: '50%' }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input3`,
      style: { top: '75%' }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Merge"
      handles={handles}
      style={{ backgroundColor: '#e8f5e9', height: 100 }}
    >
      <label>
        Strategy:
        <select value={mergeStrategy} onChange={handleStrategyChange}>
          <option value="concat">Concatenate</option>
          <option value="sum">Sum</option>
          <option value="average">Average</option>
          <option value="join">Join</option>
        </select>
      </label>
    </BaseNode>
  );
}

