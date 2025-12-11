// numberNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const NumberNode = ({ id, data }) => {
  const [number, setNumber] = useState(data?.number || 0);
  const [operation, setOperation] = useState(data?.operation || 'set');

  const handleNumberChange = (e) => {
    setNumber(parseFloat(e.target.value) || 0);
  };

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
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
      title="Number"
      handles={handles}
      style={{ backgroundColor: '#e3f2fd' }}
    >
      <label>
        Operation:
        <select value={operation} onChange={handleOperationChange}>
          <option value="set">Set Value</option>
          <option value="add">Add</option>
          <option value="multiply">Multiply</option>
        </select>
      </label>
      <label>
        Value:
        <input 
          type="number" 
          value={number} 
          onChange={handleNumberChange} 
        />
      </label>
    </BaseNode>
  );
}

