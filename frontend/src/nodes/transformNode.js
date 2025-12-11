// transformNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const TransformNode = ({ id, data }) => {
  const [transformType, setTransformType] = useState(data?.transformType || 'uppercase');

  const handleTransformChange = (e) => {
    setTransformType(e.target.value);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`
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
      title="Transform"
      handles={handles}
      style={{ backgroundColor: '#f3e5f5' }}
    >
      <label>
        Transform:
        <select value={transformType} onChange={handleTransformChange}>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="reverse">Reverse</option>
          <option value="trim">Trim</option>
          <option value="replace">Replace</option>
        </select>
      </label>
    </BaseNode>
  );
}

